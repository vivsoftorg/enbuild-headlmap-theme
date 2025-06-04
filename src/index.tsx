// EnBuild UI Plugin - Fixed Navigation Issues
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

  if (!['Times New Roman', 'Arial', 'Courier New', 'Georgia'].includes(fontName)) {
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
      .MuiAppBar-root { background-color: ${primaryColor} !important; color: ${secondaryColor} !important; }
      .MuiButton-contained { background-color: ${primaryColor} !important; color: ${secondaryColor} !important; }
      
      /* Drawer Navigation */
      .MuiDrawer-paper .MuiListItem-root,
      .MuiDrawer-paper .MuiListItemText-primary,
      .MuiDrawer-paper .MuiListItemIcon-root { color: ${secondaryColor} !important; }
      
      /* Hover States */
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
      }
      .enbuild-menu .menu-item:hover { background-color: ${secondaryColor} !important; }
      .enbuild-menu .menu-item:hover * { color: ${primaryColor} !important; }
      .enbuild-menu .menu-item.active { background-color: ${secondaryColor} !important; }
      .enbuild-menu .menu-item.active * { color: ${primaryColor} !important; }
      
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
      
      /* Hide/Show menus based on mode - FIXED */
      .MuiDrawer-paper.enbuild-active .MuiListItem-root:not(.enbuild-item) { display: none !important; }
      .MuiDrawer-paper.enbuild-active .enbuild-menu { display: block !important; }
      .MuiDrawer-paper:not(.enbuild-active) .enbuild-menu { display: none !important; }
      .MuiDrawer-paper:not(.enbuild-active) .MuiListItem-root { display: flex !important; }
    `,
  });
  document.head.appendChild(style);
};

// ========================= NAVIGATION MANAGER =========================
class NavigationManager {
  constructor() {
    this.activeMode = 'default';
    this.overviewContainer = null;
    this.originalContent = null;
    this.originalClickHandlers = new Map(); // Store original click handlers
  }

  getContentContainer() {
    return (
      document.querySelector('main[role="main"]') ||
      document.querySelector('.MuiContainer-root') ||
      document.querySelector('main') ||
      document.body.querySelector('div[class*="content"]')
    );
  }

  // Store original click handlers before overriding
  storeOriginalHandlers() {
    const defaultMenuItems = document.querySelectorAll(
      '.MuiDrawer-paper .MuiListItem-root:not(.enbuild-item)'
    );
    defaultMenuItems.forEach((item, index) => {
      if (!this.originalClickHandlers.has(index)) {
        // Clone the node to preserve original event listeners
        const clonedItem = item.cloneNode(true);
        this.originalClickHandlers.set(index, clonedItem);
      }
    });
  }

  // Restore original click handlers
  restoreOriginalHandlers() {
    const defaultMenuItems = document.querySelectorAll(
      '.MuiDrawer-paper .MuiListItem-root:not(.enbuild-item)'
    );
    defaultMenuItems.forEach((item, index) => {
      if (this.originalClickHandlers.has(index)) {
        const originalItem = this.originalClickHandlers.get(index);
        // Replace the current item with the original one that has intact event listeners
        item.parentNode.replaceChild(originalItem.cloneNode(true), item);
      }
    });
  }

  navigateTo(path) {
    // Only handle navigation when in custom mode
    if (this.activeMode !== 'custom') {
      console.log('Default mode active - letting Headlamp handle navigation');
      return;
    }

    if (window.location.pathname === path) return;

    // Only handle custom routes, let Headlamp handle everything else
    const customRoutes = [
      '/overview',
      '/pipelines',
      '/marketplace',
      '/components',
      '/deployment-flows',
      '/configuration',
    ];

    if (customRoutes.includes(path)) {
      if (path === '/overview') {
        this.renderOverview();
      } else {
        this.cleanupOverview();
        // For other custom routes, just update URL without interfering with content
        window.history.pushState({ page: path }, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } else {
      // For non-custom routes (like /settings), let Headlamp handle it
      this.cleanupOverview();
      console.log(`Letting Headlamp handle route: ${path}`);
    }
  }

  renderOverview() {
    setTimeout(() => {
      const container = this.getContentContainer();
      if (!container) return;

      if (!this.originalContent) {
        this.originalContent = container.cloneNode(true);
      }

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
      // Remove the overview content
      const overviewElement = document.getElementById('enbuild-overview');
      if (overviewElement) {
        ReactDOM.unmountComponentAtNode(overviewElement);
        overviewElement.remove();
      }

      this.overviewContainer = null;
    }

    // Don't restore original content when switching back to default mode
    // Let Headlamp handle its own content management
    if (this.activeMode === 'default') {
      this.originalContent = null;
    }
  }

  showDefaultUI() {
    console.log('Switching to default UI mode');
    this.activeMode = 'default';
    this.cleanupOverview();

    const drawer = document.querySelector('.MuiDrawer-paper');
    if (drawer) {
      // Remove custom mode class to show default menu
      drawer.classList.remove('enbuild-active');

      // Restore original click handlers for default menu items
      this.restoreOriginalHandlers();

      // Update logo states
      document.querySelectorAll('.enbuild-logo').forEach(el => el.classList.remove('active'));
      document.querySelector('.enbuild-logo.home')?.classList.add('active');
    }

    // Navigate to dashboard or current page - let Headlamp handle it naturally
    // Don't force navigation, just let the user stay where they are
    console.log('Switched to default UI mode - Headlamp controls navigation');
  }

  showCustomUI() {
    console.log('Switching to custom UI mode');
    this.activeMode = 'custom';

    const drawer = document.querySelector('.MuiDrawer-paper');
    if (!drawer) return;

    // Store original handlers before switching
    this.storeOriginalHandlers();

    // Add custom mode class to hide default menu and show custom menu
    drawer.classList.add('enbuild-active');

    // Ensure custom menu exists
    this.createCustomMenu(drawer);

    // Update logo states
    document.querySelectorAll('.enbuild-logo').forEach(el => el.classList.remove('active'));
    document.querySelector('.enbuild-logo.custom')?.classList.add('active');

    // If we're not on a custom route, navigate to overview
    const customRoutes = [
      '/overview',
      '/pipelines',
      '/marketplace',
      '/components',
      '/deployment-flows',
      '/configuration',
    ];
    if (!customRoutes.includes(window.location.pathname)) {
      this.navigateTo('/overview');
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
      ReactDOM.render(item.icon, iconContainer);

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

    // Insert custom menu at the beginning of the drawer
    drawer.insertBefore(menu, drawer.firstChild);
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

        // Initialize with default UI mode
        this.showDefaultUI();
      }
    }, 1000);

    // Handle initial route
    if (window.location.pathname === '/overview') {
      setTimeout(() => {
        this.showCustomUI();
        this.renderOverview();
      }, 100);
    }
  }

  setupRouting() {
    // Store original popstate handlers
    const originalPopstateHandlers = [];

    window.addEventListener('popstate', e => {
      // Only handle routing when in custom mode
      if (this.activeMode !== 'custom') {
        return;
      }

      const path = window.location.pathname;
      const customRoutes = [
        '/overview',
        '/pipelines',
        '/marketplace',
        '/components',
        '/deployment-flows',
        '/configuration',
      ];

      // Only handle custom routes
      if (customRoutes.includes(path)) {
        e.preventDefault();
        e.stopPropagation();

        if (path === '/overview') {
          this.renderOverview();
        } else {
          this.cleanupOverview();
        }

        // Update menu selection for custom menu items
        document.querySelectorAll('.menu-item').forEach(item => {
          const text = item.querySelector('span:last-child')?.textContent;
          const menuItem = MENU_ITEMS.find(mi => mi.text === text);
          item.classList.toggle('active', menuItem?.path === path);
        });
      } else {
        // For non-custom routes, clean up any custom content and switch to default mode
        this.cleanupOverview();
        this.showDefaultUI();
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
