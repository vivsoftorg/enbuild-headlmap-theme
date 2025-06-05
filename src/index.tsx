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
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Cpu, GitBranchPlus, LayoutDashboard, LayoutList, Settings, Store } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import OverviewDemo from './pages/overview/overview';

// Placeholder components for other custom routes
const PipelinesPage = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h4">Pipelines Page</Typography>
    <Typography variant="body1" mt={2}>
      Content for Pipelines goes here.
    </Typography>
  </Box>
);
const MarketplacePage = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h4">Marketplace Page</Typography>
    <Typography variant="body1" mt={2}>
      Content for Marketplace goes here.
    </Typography>
  </Box>
);
const ComponentsPage = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h4">Components Page</Typography>
    <Typography variant="body1" mt={2}>
      Content for Components goes here.
    </Typography>
  </Box>
);
const DeploymentFlowsPage = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h4">Deployment Flows Page</Typography>
    <Typography variant="body1" mt={2}>
      Content for Deployment Flows goes here.
    </Typography>
  </Box>
);

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
      
      /* Header - ALL elements should be secondary color */
      .MuiAppBar-root,
      .MuiAppBar-root *,
      .MuiAppBar-root .MuiTypography-root,
      .MuiAppBar-root .MuiButtonBase-root,
      .MuiAppBar-root .MuiIconButton-root,
      .MuiAppBar-root .MuiSvgIcon-root,
      .MuiAppBar-root .MuiInputBase-root,
      .MuiAppBar-root .MuiInputBase-input,
      .MuiAppBar-root .MuiFormControl-root,
      .MuiAppBar-root .MuiTextField-root,
      .MuiAppBar-root .MuiOutlinedInput-root,
      .MuiAppBar-root .MuiOutlinedInput-notchedOutline,
      .MuiAppBar-root .MuiAutocomplete-root,
      .MuiAppBar-root .MuiChip-root {
          color: ${secondaryColor} !important;
          border-color: ${secondaryColor} !important;
      }
      
      /* Search bar specific styling */
      .MuiAppBar-root .MuiTextField-root .MuiOutlinedInput-root {
          color: ${secondaryColor} !important;
      }
      .MuiAppBar-root .MuiTextField-root .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
          border-color: ${secondaryColor} !important;
      }
      .MuiAppBar-root .MuiTextField-root .MuiInputLabel-root {
          color: ${secondaryColor} !important;
      }

      /* Drawer Navigation (Default Headlamp menus) */
      .MuiDrawer-paper .MuiListItem-root,
      .MuiDrawer-paper .MuiListItemText-primary,
      .MuiDrawer-paper .MuiListItemIcon-root { color: ${secondaryColor} !important; }
      
      /* Default Headlamp menu hover states - prevent global hover */
      .MuiDrawer-paper:not(.enbuild-active) .MuiListItem-root:hover,
      .MuiDrawer-paper:not(.enbuild-active) .MuiListItem-root.Mui-selected {
        background-color: ${secondaryColor} !important;
      }
      .MuiDrawer-paper:not(.enbuild-active) .MuiListItem-root:hover *,
      .MuiDrawer-paper:not(.enbuild-active) .MuiListItem-root.Mui-selected * { 
        color: ${primaryColor} !important; 
      }
      
      /* Custom Menu Container */
      .enbuild-menu-container { 
        padding: 8px 0; 
        margin-top: 60px; 
        display: none; /* Hidden by default */
      }
      
      /* Individual Custom Menu Items - specific targeting to prevent global hover */
      .enbuild-menu-item {
        padding: 8px 16px !important; 
        margin: 2px 8px !important; 
        border-radius: 4px !important;
        cursor: pointer !important; 
        transition: all 0.3s ease !important; 
        display: flex !important; 
        align-items: center !important;
        color: ${secondaryColor} !important;
        background-color: transparent !important;
      }
      
      /* Custom menu item children */
      .enbuild-menu-item .MuiListItemIcon-root,
      .enbuild-menu-item .MuiListItemText-primary {
          color: ${secondaryColor} !important;
      }
      
      /* Custom menu item hover - ONLY for enbuild items */
      .enbuild-menu-item:hover {
        background-color: ${secondaryColor} !important;
      }
      .enbuild-menu-item:hover .MuiListItemIcon-root,
      .enbuild-menu-item:hover .MuiListItemText-primary {
        color: ${primaryColor} !important;
      }

      /* Custom menu active state */
      .enbuild-menu-item.active {
        background-color: ${secondaryColor} !important;
      }
      .enbuild-menu-item.active .MuiListItemIcon-root,
      .enbuild-menu-item.active .MuiListItemText-primary {
        color: ${primaryColor} !important;
      }
      
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
      
      /* Show/Hide menus based on mode */
      .MuiDrawer-paper.enbuild-active .MuiListItem-root:not(.enbuild-menu-item) { 
        display: none !important; 
      }
      .MuiDrawer-paper.enbuild-active .enbuild-menu-container { 
        display: block !important; 
      }
    `,
  });
  document.head.appendChild(style);
};

// ========================= NAVIGATION MANAGER =========================
class NavigationManager {
  constructor() {
    this.activeMode = 'default';
    this.customPageContainer = null;
    this.customMenuContainer = null;
  }

  getContentContainer() {
    return (
      document.querySelector('main[role="main"]') ||
      document.querySelector('.MuiContainer-root') ||
      document.querySelector('main') ||
      document.body.querySelector('div[class*="content"]')
    );
  }

  renderCustomPage(path) {
    const container = this.getContentContainer();
    if (!container) {
      console.warn('Content container not found for rendering custom page.');
      return;
    }

    // Clear Headlamp's default content
    container.innerHTML = '';

    const customPageDiv = Object.assign(document.createElement('div'), {
      id: 'enbuild-custom-page',
      style: 'width: 100%; height: 100vh; background: #f8f9fa; overflow-y: auto;',
    });

    this.customPageContainer = customPageDiv;
    container.appendChild(customPageDiv);

    let ComponentToRender;
    switch (path) {
      case '/overview':
        ComponentToRender = OverviewDemo;
        break;
      case '/pipelines':
        ComponentToRender = PipelinesPage;
        break;
      case '/marketplace':
        ComponentToRender = MarketplacePage;
        break;
      case '/components':
        ComponentToRender = ComponentsPage;
        break;
      case '/deployment-flows':
        ComponentToRender = DeploymentFlowsPage;
        break;
      case '/configuration':
        ComponentToRender = ConfigurationPage;
        break;
      default:
        console.warn(`No component defined for custom path: ${path}`);
        this.cleanupCustomContent();
        return;
    }
    ReactDOM.render(<ComponentToRender />, customPageDiv);
  }

  cleanupCustomContent() {
    if (this.customPageContainer) {
      const customElement = document.getElementById('enbuild-custom-page');
      if (customElement) {
        ReactDOM.unmountComponentAtNode(customElement);
        customElement.remove();
      }
      this.customPageContainer = null;
    }
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
      if (this.activeMode !== 'custom') {
        this.showCustomUI(false);
      }

      this.renderCustomPage(path);
      window.history.pushState({ page: path }, '', path);

      // Update menu active state
      this.updateCustomMenuActiveState(path);
    } else {
      this.cleanupCustomContent();
      this.showDefaultUI(false);
      window.history.pushState({ page: path }, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  updateCustomMenuActiveState(currentPath) {
    if (this.customMenuContainer) {
      // Re-render the menu with updated active state
      ReactDOM.render(
        <CustomMenu
          menuItems={MENU_ITEMS}
          currentPath={currentPath}
          navigateTo={this.navigateTo.bind(this)}
        />,
        this.customMenuContainer
      );
    }
  }

  showDefaultUI(navigateHome = true) {
    console.log('Switching to default UI mode');
    this.activeMode = 'default';
    this.cleanupCustomContent();

    const drawer = document.querySelector('.MuiDrawer-paper');
    if (drawer) {
      drawer.classList.remove('enbuild-active');

      // Clean up custom menu
      if (this.customMenuContainer) {
        ReactDOM.unmountComponentAtNode(this.customMenuContainer);
        this.customMenuContainer.remove();
        this.customMenuContainer = null;
      }

      document.querySelectorAll('.enbuild-logo').forEach(el => el.classList.remove('active'));
      document.querySelector('.enbuild-logo.home')?.classList.add('active');

      if (navigateHome) {
        // Navigate to home but don't reload - let Headlamp handle it
        if (window.location.pathname !== '/') {
          window.history.pushState({}, '', '/');
          // Trigger a refresh of the main content area to show Headlamp's default content
          this.refreshDefaultContent();
        }
      }
    }
    console.log('Switched to default UI mode - Headlamp controls navigation');
  }

  refreshDefaultContent() {
    // Force a re-render of the default Headlamp content
    const event = new Event('headlamp-refresh');
    window.dispatchEvent(event);

    // Also try to trigger a route change event that Headlamp might be listening for
    setTimeout(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, 100);
  }

  showCustomUI(navigateOverview = true) {
    console.log('Switching to custom UI mode');
    this.activeMode = 'custom';

    const drawer = document.querySelector('.MuiDrawer-paper');
    if (!drawer) {
      console.warn('Drawer not found');
      return;
    }

    // Create and render custom menu
    this.renderCustomMenu(drawer);

    drawer.classList.add('enbuild-active');

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

    if (navigateOverview) {
      const targetPath = customRoutes.includes(window.location.pathname)
        ? window.location.pathname
        : '/overview';

      this.renderCustomPage(targetPath);

      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page: targetPath }, '', targetPath);
      }

      this.updateCustomMenuActiveState(targetPath);
    }
  }

  renderCustomMenu(drawer) {
    if (!drawer) {
      console.warn('Drawer not provided for custom menu rendering');
      return;
    }

    // Remove existing custom menu if present
    if (this.customMenuContainer) {
      ReactDOM.unmountComponentAtNode(this.customMenuContainer);
      this.customMenuContainer.remove();
    }

    // Create new menu container
    const menuContainerDiv = Object.assign(document.createElement('div'), {
      className: 'enbuild-menu-container',
    });

    this.customMenuContainer = menuContainerDiv;

    // Insert at the top of the drawer content
    const scrollContainer = drawer.querySelector('.MuiDrawer-paper > div:first-child') || drawer;
    scrollContainer.insertBefore(menuContainerDiv, scrollContainer.firstChild);

    // Render the React component
    ReactDOM.render(
      <CustomMenu
        menuItems={MENU_ITEMS}
        currentPath={window.location.pathname}
        navigateTo={this.navigateTo.bind(this)}
      />,
      this.customMenuContainer
    );
  }

  setupDrawer() {
    const drawer = document.querySelector('.MuiDrawer-paper');
    if (!drawer || drawer.querySelector('.enbuild-logo-container')) return false;

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

    logoContainer.querySelector('.custom').addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      console.log('EnBuild logo clicked - switching to custom UI');
      this.showCustomUI(true); // Navigate to overview by default
    });

    logoContainer.querySelector('.home').addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Home logo clicked - switching to default UI');
      this.showDefaultUI(true);
    });

    drawer.appendChild(logoContainer);
    return true;
  }

  init() {
    const setupDrawerInterval = setInterval(() => {
      if (this.setupDrawer()) {
        clearInterval(setupDrawerInterval);
        this.setupRouting();

        const customRoutes = [
          '/overview',
          '/pipelines',
          '/marketplace',
          '/components',
          '/deployment-flows',
          '/configuration',
        ];

        if (customRoutes.includes(window.location.pathname)) {
          this.showCustomUI(false);
          this.renderCustomPage(window.location.pathname);
        } else {
          this.showDefaultUI(false);
        }
      }
    }, 500);
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
        if (this.activeMode !== 'custom') {
          this.showCustomUI(false);
        }

        this.renderCustomPage(path);
        this.updateCustomMenuActiveState(path);
      } else {
        this.cleanupCustomContent();
        this.showDefaultUI(false);
      }
    });
  }
}

// ========================= REACT COMPONENT FOR CUSTOM MENU =========================
const CustomMenu = ({ menuItems, currentPath, navigateTo }) => {
  return (
    <Box className="enbuild-menu-container">
      {menuItems.map(item => (
        <ListItem
          key={item.path}
          className={`enbuild-menu-item ${currentPath === item.path ? 'active' : ''}`}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            navigateTo(item.path);
          }}
          sx={{
            padding: '8px 16px !important',
            margin: '2px 8px !important',
            borderRadius: '4px !important',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 'auto',
              mr: '12px',
              display: 'flex',
              alignItems: 'center',
              color: 'inherit',
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            sx={{
              '& .MuiListItemText-primary': {
                color: 'inherit',
              },
            }}
          />
        </ListItem>
      ))}
    </Box>
  );
};

// ========================= COMPONENTS =========================
export function SimpleLogo(props) {
  const { className = '' } = props;
  const config = store.useConfig()(); // This hook ensures re-render when config changes

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

// Configuration Page Component - Just shows heading like other pages
const ConfigurationPage = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h4">Configuration Page</Typography>
    <Typography variant="body1" mt={2}>
      Content for Configuration goes here.
    </Typography>
  </Box>
);

// Theme Customizer - Only for Headlamp settings
const ThemeCustomizer = () => {
  const initialConfig = store.get() || {}; // Get initial config for state
  const [settings, setSettings] = useState({
    primaryColor: initialConfig.primaryColor || DEFAULTS.primary,
    secondaryColor: initialConfig.secondaryColor || DEFAULTS.secondary,
    font: initialConfig.font || DEFAULTS.font,
    logoURL: initialConfig.logoURL || DEFAULTS.logoURL,
  });

  // Use a ref to store the current navigation manager instance
  const navRef = useRef(null);
  useEffect(() => {
    // Make sure the global nav instance is available to ThemeCustomizer
    navRef.current = window.enbuildNavigationManager; // Assuming you attach it to window in your init
  }, []);

  // This useEffect will run whenever `settings` change.
  // It ensures the global theme and logo are updated.
  useEffect(() => {
    store.set(settings); // Persist changes to the store
    injectTheme(settings);
    loadFont(settings.font);

    // Register the logo. Calling this again should force Headlamp to update
    // if it's responsive to re-registrations.
    registerAppLogo(SimpleLogo);

    // If the custom menu is active, ensure its state is updated
    if (navRef.current && navRef.current.activeMode === 'custom') {
      navRef.current.updateCustomMenuActiveState(window.location.pathname);
    }
  }, [settings]); // Depend on settings so it re-runs when settings state updates

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value || DEFAULTS[key] }));
  };

  const resetSettings = () => {
    setSettings({ ...DEFAULTS });
    // The useEffect will handle applying these DEFAULTS as settings state changes
  };

  return (
    <Box width="50%" style={{ paddingTop: '8vh', margin: '0 auto' }}>
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
        <Button onClick={() => store.set(settings)} variant="contained">
          {' '}
          {/* Explicitly save on Apply */}
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
window.enbuildNavigationManager = nav; // Make it globally accessible for ThemeCustomizer

// Initialize
(() => {
  const config = store.get() || {};
  injectTheme(config);
  config.font && loadFont(config.font);
  registerAppLogo(SimpleLogo); // Initial registration

  nav.init();
  registerPluginSettings('enbuild-theme', ThemeCustomizer, false);
})();
