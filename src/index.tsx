// EnBuild UI Plugin - Fixed Navigation Issues & Submenu Visibility
import {
  AppLogoProps,
  ConfigStore,
  registerAppLogo,
  registerPluginSettings,
} from '@kinvolk/headlamp-plugin/lib';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Cpu, GitBranchPlus, LayoutDashboard, LayoutList, Settings, Store } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import OverviewDemo from './pages/overview/overview';

// ========================= CONSTANTS & CONFIG =========================
const DEFAULTS = {
  primary: '#05A2C2',
  secondary: '#ffffff',
  font: 'Inter',
  logoURL: 'https://enbuild-docs.vivplatform.io/images/emma/enbuild-logo.png',
};

const FONTS = ['Inter', 'Arial', 'Roboto', 'Courier New', 'Georgia', 'Monospace', 'Verdana'];

const MENU_ITEMS = [
  { text: 'Overview', path: '/overview', icon: <LayoutDashboard size={20} /> },
  { text: 'Pipelines', path: '/pipelines', icon: <LayoutList size={20} /> },
  { text: 'Marketplace', path: '/marketplace', icon: <Store size={20} /> },
  { text: 'Components', path: '/components', icon: <Cpu size={20} /> },
  { text: 'Deployment Flows', path: '/deployment-flows', icon: <GitBranchPlus size={20} /> },
  { text: 'Configuration', path: '/configuration', icon: <Settings size={20} /> },
];

const store = new ConfigStore('enbuild-customiser-theme');

// ========================= UTILITY FUNCTIONS =========================
const loadFont = (fontName = DEFAULTS.font) => {
  ['custom-font-loader', 'custom-font-style'].forEach(id => document.getElementById(id)?.remove());

  if (!['Times New Roman', 'Arial', 'Roboto', 'Courier New', 'Georgia'].includes(fontName)) {
    const link = Object.assign(document.createElement('link'), {
      id: 'custom-font-loader',
      rel: 'stylesheet',
      href: `https://fonts.googleapis.com/css2?family=${fontName.replace(
        / /g,
        '+'
      )}:wght@300;400;500;600;700&display=swap`,
    });
    document.head.appendChild(link);
  }

  const style = Object.assign(document.createElement('style'), {
    id: 'custom-font-style',
    innerHTML: `body, * { font-family: "${fontName}", sans-serif !important; }`,
  });
  document.head.appendChild(style);
};

const injectTheme = ({ primaryColor = DEFAULTS.primary, secondaryColor = DEFAULTS.secondary }) => {
  document.getElementById('enbuild-theme')?.remove();

  const style = Object.assign(document.createElement('style'), {
    id: 'enbuild-theme',
    innerHTML: `
      /* Core Theme */
      .MuiDrawer-paper { background-color: ${primaryColor} !important; }
      .MuiAppBar-root { background-color: ${primaryColor} !important; }
      .MuiButton-contained { background-color: ${primaryColor} !important; color: ${secondaryColor} !important; }
      
      /* Header Text - Ensure it's secondary color */
      .MuiAppBar-root,
      .MuiAppBar-root .MuiTypography-root, /* Target common text components in app bar */
      .MuiAppBar-root .MuiButtonBase-root { /* Target buttons/icons in app bar */
          color: ${secondaryColor} !important;
      }

      /* Drawer Navigation (Default Headlamp menus) */
      .MuiDrawer-paper .MuiListItem-root,
      .MuiDrawer-paper .MuiListItemText-primary,
      .MuiDrawer-paper .MuiListItemIcon-root { color: ${secondaryColor} !important; }
      
      /* Hover States (Default Headlamp menus) */
      .MuiDrawer-paper .MuiListItem-root:hover,
      .MuiDrawer-paper .MuiListItem-root.Mui-selected {
        background-color: ${secondaryColor} !important;
      }
      .MuiDrawer-paper .MuiListItem-root:hover *,
      .MuiDrawer-paper .MuiListItem-root.Mui-selected * { color: ${primaryColor} !important; }
      
      /* Custom Menu */
      .enbuild-menu { padding: 8px 0; margin-top: 60px; }
      .enbuild-menu .menu-item {
        padding: 8px 16px; margin: 2px 8px; border-radius: 4px;
        cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center;
        color: ${secondaryColor} !important; /* Ensure unselected/unhovered text is secondary */
      }
      .enbuild-menu .menu-item *, /* Target icons and text inside menu-item */
      .enbuild-menu .menu-item .MuiListItemIcon-root,
      .enbuild-menu .menu-item .MuiListItemText-primary {
          color: ${secondaryColor} !important; /* Explicitly set color for child elements */
      }
      .enbuild-menu .menu-item:hover { background-color: ${secondaryColor} !important; }
      .enbuild-menu .menu-item:hover *,
      .enbuild-menu .menu-item:hover .MuiListItemIcon-root,
      .enbuild-menu .menu-item:hover .MuiListItemText-primary { color: ${primaryColor} !important; }

      .enbuild-menu .menu-item.active { background-color: ${secondaryColor} !important; }
      .enbuild-menu .menu-item.active *,
      .enbuild-menu .menu-item.active .MuiListItemIcon-root,
      .enbuild-menu .menu-item.active .MuiListItemText-primary { color: ${primaryColor} !important; }
      
      /* Logo Container */
      .enbuild-logo-container {
        position: sticky; bottom: 0; background-color: ${primaryColor};
        border-top: 1px solid ${secondaryColor}33; padding: 16px;
        display: flex; justify-content: center; gap: 16px;
      }
      .enbuild-logo {
        display: flex; flex-direction: column; align-items: center;
        cursor: pointer; transition: all 0.2s ease;
      }
      .enbuild-logo:hover { opacity: 0.8; transform: scale(1.05); }
      .enbuild-logo .icon {
        width: 40px; height: 40px; background: white; border-radius: 4px;
        display: flex; align-items: center; justify-content: center; padding: 4px;
      }
      .enbuild-logo .text { margin-top: 8px; color: ${secondaryColor}; font-size: 12px; }
      .enbuild-logo.active .icon { box-shadow: 0 0 8px rgba(255,255,255,0.5); }
      
      /* Hide/Show menus based on mode */
      .enbuild-menu { display: none; }
      .MuiDrawer-paper.enbuild-active .MuiListItem-root:not(.enbuild-item):not(.MuiListItemButton-root) { display: none !important; }
      .MuiDrawer-paper.enbuild-active .enbuild-menu { display: block !important; }
    `,
  });
  document.head.appendChild(style);
};

// ========================= NAVIGATION MANAGER =========================
class NavigationManager {
  constructor() {
    this.activeMode = 'default';
    this.overviewContainer = null;
    // We no longer store originalContent or originalMenuItems this way.
    // Headlamp manages its own content and menu items.
  }

  getContentContainer() {
    return (
      document.querySelector('main[role="main"]') ||
      document.querySelector('.MuiContainer-root') ||
      document.querySelector('main') ||
      document.body.querySelector('div[class*="content"]')
    );
  }

  navigateTo(path) {
    const customRoutes = [
      '/overview',
      '/pipelines',
      '/marketplace',
      '/components',
      '/deployment-flows',
      '/configuration',
    ];

    if (customRoutes.includes(path)) {
      // If navigating to a custom route, ensure custom UI is active
      if (this.activeMode !== 'custom') {
        this.showCustomUI(false); // Pass false to prevent immediate navigation if already on a custom route
      }

      if (window.location.pathname === path) {
        // If already on the path, just ensure overview is rendered if it's the overview path
        if (path === '/overview') {
          this.renderOverview();
        }
        return;
      }

      if (path === '/overview') {
        this.renderOverview();
      } else {
        this.cleanupOverview();
        // For other custom routes, just update URL
      }
      window.history.pushState({ page: path }, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      // If navigating to a default Headlamp route
      this.cleanupOverview();
      this.showDefaultUI(false); // Pass false to prevent immediate navigation if already on a default route
      window.history.pushState({ page: path }, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  renderOverview() {
    // Ensure this runs *after* the Headlamp content container is available
    setTimeout(() => {
      const container = this.getContentContainer();
      if (!container) {
        console.warn('Overview container not found.');
        return;
      }

      // Hide Headlamp's default content by clearing it.
      // A better approach might be to leverage Headlamp's routing system to ensure
      // it doesn't render its own content for '/overview'.
      // For now, we'll clear it as in your original code.
      container.innerHTML = '';

      const overviewDiv = Object.assign(document.createElement('div'), {
        id: 'enbuild-overview',
        style: 'width: 100%; height: 100vh; background: #f8f9fa; overflow-y: auto;',
      });

      this.overviewContainer = overviewDiv;
      container.appendChild(overviewDiv);
      ReactDOM.render(<OverviewDemo />, overviewDiv);
    }, 100);
  }

  cleanupOverview() {
    if (this.overviewContainer) {
      const overviewElement = document.getElementById('enbuild-overview');
      if (overviewElement) {
        ReactDOM.unmountComponentAtNode(overviewElement);
        overviewElement.remove();
      }
      this.overviewContainer = null;

      // When cleaning up overview, ensure Headlamp's content can be rendered again
      // This is crucial. If you came from a custom path, and are switching to default,
      // the popstate event handler for the default path should make Headlamp re-render.
    }
  }

  showDefaultUI(navigateHome = true) {
    console.log('Switching to default UI mode');
    this.activeMode = 'default';
    this.cleanupOverview(); // Ensure any custom overview content is removed

    const drawer = document.querySelector('.MuiDrawer-paper');
    if (drawer) {
      // Remove custom mode class to show default menu
      drawer.classList.remove('enbuild-active');

      // Do NOT try to restore original menu items. Just make sure Headlamp's
      // own rendering mechanism is allowed to show them.
      // We rely on the CSS `enbuild-active` to hide the custom menu and show default ones.

      // Hide custom menu explicitly if it exists
      const customMenu = drawer.querySelector('.enbuild-menu');
      if (customMenu) {
        customMenu.style.display = 'none';
      }

      // Update logo states
      document.querySelectorAll('.enbuild-logo').forEach(el => el.classList.remove('active'));
      document.querySelector('.enbuild-logo.home')?.classList.add('active');

      // IMPORTANT: Navigate to Headlamp's base path to reset its state if requested
      if (navigateHome && window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
    console.log('Switched to default UI mode - Headlamp controls navigation');
  }

  showCustomUI(navigateOverview = true) {
    console.log('Switching to custom UI mode');
    this.activeMode = 'custom';

    const drawer = document.querySelector('.MuiDrawer-paper');
    if (!drawer) return;

    // Headlamp's menu items will be hidden by the CSS when enbuild-active is applied.
    // No need to store anything.

    this.createCustomMenu(drawer); // Ensure custom menu is created/updated

    // Apply custom mode class to hide default menu and show custom menu
    drawer.classList.add('enbuild-active');

    // Update logo states
    document.querySelectorAll('.enbuild-logo').forEach(el => el.classList.remove('active'));
    document.querySelector('.enbuild-logo.custom')?.classList.add('active');

    const customRoutes = [
      '/overview',
      '/pipelines',
      '/marketplace',
      '/components',
      '/deployment-flows',
      '/configuration',
    ];

    // If we're not on a custom route, navigate to overview
    if (navigateOverview) {
      if (!customRoutes.includes(window.location.pathname)) {
        this.navigateTo('/overview'); // This will trigger renderOverview if path is /overview
      } else if (window.location.pathname === '/overview') {
        this.renderOverview(); // Ensure overview is rendered if we are already on it.
      }
    }
  }

  createCustomMenu(drawer) {
    // Remove existing custom menu if it exists
    const existingMenu = drawer.querySelector('.enbuild-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    const menu = Object.assign(document.createElement('div'), {
      className: 'enbuild-menu',
    });

    MENU_ITEMS.forEach(item => {
      const menuItem = Object.assign(document.createElement('div'), {
        className: `menu-item enbuild-item ${
          window.location.pathname === item.path ? 'active' : ''
        }`,
        innerHTML: `
          <span style="margin-right: 12px; display: flex; align-items: center;"></span>
          <span>${item.text}</span>
        `,
      });

      // Render icon
      const iconContainer = menuItem.querySelector('span');
      if (iconContainer) {
        // Ensure container exists before rendering
        ReactDOM.render(item.icon, iconContainer);
      }

      menuItem.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        drawer.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        menuItem.classList.add('active');

        // Handle navigation through our custom navigation system
        this.navigateTo(item.path);
      });

      menu.appendChild(menuItem);
    });

    // Insert custom menu at the beginning of the drawer's scrollable content
    const scrollContainer = drawer.querySelector('.MuiDrawer-paper > div:first-child');
    if (scrollContainer) {
      scrollContainer.prepend(menu); // Prepend to the first div inside the drawer paper
    } else {
      drawer.prepend(menu); // Fallback if scrollContainer is not found
    }
  }

  setupDrawer() {
    const drawer = document.querySelector('.MuiDrawer-paper');
    if (!drawer || drawer.querySelector('.enbuild-logo-container')) return false;

    // Create logo container
    const logoContainer = Object.assign(document.createElement('div'), {
      className: 'enbuild-logo-container',
      innerHTML: `
        <div class="enbuild-logo custom" title="EnBuild UI">
          <div class="icon">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="${DEFAULTS.primary}"/>
            </svg>
          </div>
          <div class="text">EnBuild</div>
        </div>
        <div class="enbuild-logo home active" title="Default UI">
          <div class="icon">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" fill="${DEFAULTS.primary}"/>
            </svg>
          </div>
          <div class="text">Home</div>
        </div>
      `,
    });

    // Add event listeners
    logoContainer.querySelector('.custom').addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      console.log('EnBuild logo clicked - switching to custom UI');
      this.showCustomUI();
    });

    logoContainer.querySelector('.home').addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Home logo clicked - switching to default UI');
      this.showDefaultUI();
    });

    drawer.appendChild(logoContainer);
    return true;
  }

  init() {
    // Setup drawer
    const setupDrawerInterval = setInterval(() => {
      if (this.setupDrawer()) {
        clearInterval(setupDrawerInterval);
        this.setupRouting();

        // Check current path to decide which UI to show initially
        const customRoutes = [
          '/overview',
          '/pipelines',
          '/marketplace',
          '/components',
          '/deployment-flows',
          '/configuration',
        ];

        if (customRoutes.includes(window.location.pathname)) {
          this.showCustomUI(false); // Don't trigger another navigation on init
          if (window.location.pathname === '/overview') {
            this.renderOverview();
          }
        } else {
          // If a default Headlamp route is loaded, ensure default UI is active
          // No need to force navigate to '/' if already on a default route
          this.showDefaultUI(false); // Don't trigger another navigation on init
        }
      }
    }, 500); // Increased interval slightly to give Headlamp more time to render
  }

  setupRouting() {
    window.addEventListener('popstate', e => {
      const path = window.location.pathname;
      const customRoutes = [
        '/overview',
        '/pipelines',
        '/marketplace',
        '/components',
        '/deployment-flows',
        '/configuration',
      ];

      if (customRoutes.includes(path)) {
        // If a custom route is accessed directly or via history, ensure custom UI is active
        if (this.activeMode !== 'custom') {
          this.showCustomUI(false); // Switch UI without causing navigation loop
        }

        e.preventDefault(); // Prevent Headlamp from handling this popstate for custom routes
        e.stopPropagation(); // Stop propagation to ensure Headlamp doesn't interfere

        if (path === '/overview') {
          this.renderOverview();
        } else {
          this.cleanupOverview();
        }

        // Update menu selection for custom menu items
        document.querySelectorAll('.enbuild-menu .menu-item').forEach(item => {
          const textElement = item.querySelector('span:last-child');
          if (textElement) {
            const text = textElement.textContent;
            const menuItem = MENU_ITEMS.find(mi => mi.text === text);
            item.classList.toggle('active', menuItem?.path === path);
          }
        });
      } else {
        // For non-custom routes, clean up any custom content and switch to default mode
        this.cleanupOverview();
        this.showDefaultUI(false); // Switch UI without causing navigation loop
        // Let Headlamp's own popstate handlers take over for its routes
      }
    });
  }
}

// ========================= COMPONENTS =========================
export function SimpleLogo(props) {
  const { className = '' } = props;
  const config = store.useConfig()();

  if (!config?.logoURL) return null;

  return (
    <Box
      component="img"
      src={config.logoURL}
      alt="EnBuild Logo"
      className={className}
      sx={{
        backgroundColor: '#ffffff',
        height: '36px',
        maxWidth: '100%',
        objectFit: 'contain',
        position: 'absolute',
        top: '10px',
        zIndex: 10,
        padding: '2px',
        borderRadius: '4px',
      }}
      onError={e => {
        console.error('Logo load error:', e.currentTarget.src);
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}

const ThemeCustomizer = () => {
  const config = store.get() || {};
  const [settings, setSettings] = useState({
    primaryColor: config.primaryColor || DEFAULTS.primary,
    secondaryColor: config.secondaryColor || DEFAULTS.secondary,
    font: config.font || DEFAULTS.font,
    logoURL: config.logoURL || DEFAULTS.logoURL,
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value || DEFAULTS[key] }));
  };

  const applySettings = () => {
    store.set(settings);
    injectTheme(settings);
    loadFont(settings.font);
    registerAppLogo(SimpleLogo);
  };

  const resetSettings = () => {
    setSettings({ ...DEFAULTS });
    store.set(DEFAULTS);
    injectTheme(DEFAULTS);
    loadFont(DEFAULTS.font);
    // Re-registering with default logo URL, if the original one was default
    registerAppLogo(SimpleLogo);
  };

  return (
    <Box width="50%" style={{ paddingTop: '8vh' }}>
      <Typography variant="h6" align="center" mb={2}>
        EnBuild UI Customizer
      </Typography>

      <TextField
        type="color"
        label="Primary Color"
        value={settings.primaryColor}
        onChange={e => updateSetting('primaryColor', e.target.value)}
        fullWidth
        margin="dense"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        type="color"
        label="Secondary Color"
        value={settings.secondaryColor}
        onChange={e => updateSetting('secondaryColor', e.target.value)}
        fullWidth
        margin="dense"
        InputLabelProps={{ shrink: true }}
      />

      <FormControl fullWidth margin="dense">
        <InputLabel>Font</InputLabel>
        <Select
          value={settings.font}
          onChange={e => updateSetting('font', e.target.value)}
          label="Font"
        >
          {FONTS.map(font => (
            <MenuItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Logo URL"
        value={settings.logoURL}
        onChange={e => updateSetting('logoURL', e.target.value)}
        fullWidth
        margin="dense"
        InputLabelProps={{ shrink: true }}
      />

      <Box mt={2} display="flex" gap={2}>
        <Button onClick={applySettings} variant="contained">
          Apply
        </Button>
        <Button onClick={resetSettings} variant="outlined">
          Reset
        </Button>
      </Box>
    </Box>
  );
};

// ========================= INITIALIZATION =========================
const nav = new NavigationManager();

// Initialize
(() => {
  const config = store.get() || {};
  injectTheme(config);
  config.font && loadFont(config.font);
  config.logoURL && registerAppLogo(SimpleLogo);

  nav.init();
  registerPluginSettings('enbuild-theme', ThemeCustomizer, false);
})();
