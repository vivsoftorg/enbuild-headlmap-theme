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

// New placeholder component for the /configuration route in the custom menu
const ConfigurationPagePlaceholder = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h4">Configuration Overview</Typography>
    <Typography variant="body1" mt={2}>
      Access full theme settings via Plugin Settings.
    </Typography>
  </Box>
);

// ========================= CONSTANTS & CONFIG =========================
const DEFAULTS = {
  primaryColor: '#05A2C2', // Changed to match state property names
  secondaryColor: '#ffffff', // Changed to match state property names
  font: 'Inter',
  logoURL: 'https://enbuild-docs.vivplatform.io/images/emma/enbuild-logo.png',
};

const FONTS = ['Inter', 'Arial', 'Roboto', 'Courier New', 'Georgia', 'Monospace', 'Verdana'];

// Re-added 'Configuration' to MENU_ITEMS
const MENU_ITEMS = [
  { text: 'Overview', path: '/overview', icon: <LayoutDashboard size={20} /> },
  { text: 'Pipelines', path: '/pipelines', icon: <LayoutList size={20} /> },
  { text: 'Marketplace', path: '/marketplace', icon: <Store size={20} /> },
  { text: 'Components', path: '/components', icon: <Cpu size={20} /> },
  { text: 'Deployment Flows', path: '/deployment-flows', icon: <GitBranchPlus size={20} /> },
  { text: 'Configuration', path: '/configuration', icon: <Settings size={20} /> }, // Added back
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

const injectTheme = ({
  primaryColor = DEFAULTS.primaryColor,
  secondaryColor = DEFAULTS.secondaryColor,
}) => {
  document.getElementById('enbuild-theme')?.remove();

  const style = Object.assign(document.createElement('style'), {
    id: 'enbuild-theme',
    innerHTML: `
      /* Core Theme */
      .MuiDrawer-paper { background-color: ${primaryColor} !important; }
      .MuiAppBar-root { background-color: ${primaryColor} !important; }
      .MuiButton-contained { background-color: ${primaryColor} !important; color: ${secondaryColor} !important; }

      /* Header Text, Icons, and Inputs - Ensure they are secondary color */
      .MuiAppBar-root,
      .MuiAppBar-root *, /* Catch all elements within AppBar that might not be explicitly covered */
      .MuiAppBar-root .MuiTypography-root,
      .MuiAppBar-root .MuiButtonBase-root,
      .MuiAppBar-root input[type="search"],
      .MuiAppBar-root input::placeholder,
      .MuiAppBar-root .MuiInputBase-input {
          color: ${secondaryColor} !important;
      }
      /* Ensure SVG icons within AppBar also get the secondary color */
      .MuiAppBar-root svg,
      .MuiAppBar-root svg path {
          fill: ${secondaryColor} !important;
          color: ${secondaryColor} !important; /* Fallback for direct color properties */
      }
      /* Specific targeting for search bar text */
      .MuiAppBar-root .MuiInputBase-root {
          color: ${secondaryColor} !important;
      }
      /* Ensure search input background remains transparent or default */
      .MuiAppBar-root input[type="search"] {
          background-color: transparent !important;
      }

      /* Search bar outline and focus styles */
      .MuiAppBar-root .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline,
      .MuiAppBar-root .MuiInput-underline:before {
        border-color: ${secondaryColor} !important;
      }
      .MuiAppBar-root .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline,
      .MuiAppBar-root .MuiInput-underline:hover:not(.Mui-disabled):before {
        border-color: ${secondaryColor} !important;
      }
      .MuiAppBar-root .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline,
      .MuiAppBar-root .MuiInput-underline:after {
        border-color: ${secondaryColor} !important;
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
      .enbuild-menu-container { padding: 8px 0; margin-top: 60px; }
      .enbuild-menu-item {
        padding: 8px 16px; margin: 2px 8px; border-radius: 4px;
        cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center;
        color: ${secondaryColor} !important; /* Ensure unselected/unhovered text is secondary */
      }
      .enbuild-menu-item *, /* Target icons and text inside menu-item */
      .enbuild-menu-item .MuiListItemIcon-root,
      .enbuild-menu-item .MuiListItemText-primary {
          color: ${secondaryColor} !important; /* Explicitly set color for child elements */
      }
      .enbuild-menu-item:hover { background-color: ${secondaryColor} !important; }
      .enbuild-menu-item:hover *,
      .enbuild-menu-item:hover .MuiListItemIcon-root,
      .enbuild-menu-item:hover .MuiListItemText-primary { color: ${primaryColor} !important; }

      .enbuild-menu-item.active { background-color: ${secondaryColor} !important; }
      .enbuild-menu-item.active *,
      .enbuild-menu-item.active .MuiListItemIcon-root,
      .enbuild-menu-item.active .MuiListItemText-primary { color: ${primaryColor} !important; }

      /* Logo Container */
      .enbuild-logo-container {
        position: sticky; bottom: 0; background-color: ${primaryColor};
        border-top: 1px solid ${secondaryColor}33; padding: 16px;
        display: flex;
        justify-content: center;
        /* Changed to column for labels below logos */
        flex-direction: row; /* Changed to row for initial flex-direction */
        gap: 16px; 
      }
      .enbuild-logo {
        display: flex; 
        flex-direction: column; /* Changed to column */
        align-items: center; /* Center items horizontally in a column */
        cursor: pointer; transition: all 0.2s ease;
      }
      .enbuild-logo:hover { opacity: 0.8; transform: scale(1.05); }
      .enbuild-logo .icon {
        width: 40px; height: 40px; background: white; border-radius: 4px;
        display: flex; align-items: center; justify-content: center; padding: 4px;
      }
      .enbuild-logo .text { 
        margin-top: 4px; /* Add margin to separate text from icon */
        margin-left: 0; /* Remove left margin */
        color: ${secondaryColor}; font-size: 12px; 
      }
      .enbuild-logo.active .icon { box-shadow: 0 0 8px rgba(255,255,255,0.5); }

      /* When drawer collapses (narrow width), adjust layout */
      .MuiDrawer-paper[style*="width: 56px"] .enbuild-logo-container,
      .MuiDrawer-paper[style*="width: 48px"] .enbuild-logo-container,
      .MuiDrawer-paper.MuiDrawer-paperAnchorLeft:not(.MuiDrawer-docked):not([style*="width:"]) .enbuild-logo-container {
          flex-direction: row !important; /* Keep as row when collapsed for horizontal arrangement of the two logos */
          align-items: center !important;
          gap: 10px !important; 
          flex-wrap: wrap; /* Allow wrapping if space is too small */
      }

      .MuiDrawer-paper[style*="width: 56px"] .enbuild-logo,
      .MuiDrawer-paper[style*="width: 48px"] .enbuild-logo,
      .MuiDrawer-paper.MuiDrawer-paperAnchorLeft:not(.MuiDrawer-docked):not([style*="width:"]) .enbuild-logo {
          flex-direction: column !important; /* Ensure column direction even when collapsed for icon above text */
          align-items: center !important;
          justify-content: center !important; /* Center content within each logo item */
          margin: 0 !important; /* Remove any conflicting margins */
      }

      .MuiDrawer-paper[style*="width: 56px"] .enbuild-logo .text,
      .MuiDrawer-paper[style*="width: 48px"] .enbuild-logo .text,
      .MuiDrawer-paper.MuiDrawer-paperAnchorLeft:not(.MuiDrawer-docked):not([style*="width:"]) .enbuild-logo .text {
          margin-top: 4px !important; /* Keep top margin for stacked text */
          margin-left: 0 !important; /* Remove horizontal margin */
          font-size: 10px; /* Smaller font size for collapsed state */
          white-space: nowrap; /* Prevent text wrapping */
      }

      /* Hide/Show menus based on mode */
      .enbuild-menu-container { display: none; }
      /* Ensure that the default Headlamp menu items are hidden when enbuild-active is present */
      .MuiDrawer-paper.enbuild-active .MuiListItem-root:not(.enbuild-menu-item):not(.MuiListItemButton-root) {
        display: none !important;
      }
      .MuiDrawer-paper.enbuild-active .enbuild-menu-container {
        display: block !important;
      }

      /* Styles for the ThemeCustomizer component itself when rendered by Headlamp's plugin settings */
      .headlamp-plugin-settings #enbuild-custom-page,
      .headlamp-plugin-settings .MuiBox-root[width="50%"] {
        position: relative;
        z-index: 1;
        background-color: var(--lh-background-color, #f8f9fa);
        min-height: 100vh;
        padding: 24px;
        box-sizing: border-box;
      }
      .headlamp-plugin-settings .MuiInputLabel-root,
      .headlamp-plugin-settings .MuiInputBase-input,
      .headlamp-plugin-settings .MuiSelect-select,
      .headlamp-plugin-settings .MuiFormHelperText-root {
          color: var(--lh-text-primary-color, rgba(0, 0, 0, 0.87)) !important;
      }
      .headlamp-plugin-settings .MuiOutlinedInput-notchedOutline,
      .headlamp-plugin-settings .MuiInput-underline:before {
          border-color: var(--lh-text-primary-color, rgba(0, 0, 0, 0.23)) !important;
      }
      .headlamp-plugin-settings .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline,
      .headlamp-plugin-settings .MuiInput-underline:hover:not(.Mui-disabled):before {
          border-color: var(--lh-accent-color, ${DEFAULTS.primaryColor}) !important;
      }
      .headlamp-plugin-settings .Mui-focused .MuiOutlinedInput-notchedOutline,
      .headlamp-plugin-settings .MuiInput-underline:after {
          border-color: var(--lh-accent-color, ${DEFAULTS.primaryColor}) !important;
      }
      .MuiInputBase-input[type="color"] {
        padding: 0 !important;
        height: 40px !important;
        width: 100% !important;
        box-sizing: border-box;
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
    this.customMenuContainerRef = React.createRef();
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
      case '/configuration': // Route to the placeholder for the custom menu
        ComponentToRender = ConfigurationPagePlaceholder;
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
      '/configuration', // Included here for routing logic
    ];

    if (customRoutes.includes(path)) {
      if (this.activeMode !== 'custom') {
        this.showCustomUI(false);
      }

      if (window.location.pathname === path) {
        this.renderCustomPage(path);
        this.renderCustomMenu();
        return;
      }

      this.renderCustomPage(path);
      window.history.pushState({ page: path }, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      this.cleanupCustomContent();
      this.showDefaultUI(false);
      window.history.pushState({ page: path }, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  showDefaultUI(navigateHome = true) {
    console.log('Switching to default UI mode');
    this.activeMode = 'default';
    this.cleanupCustomContent();

    const drawer = document.querySelector('.MuiDrawer-paper');
    if (drawer) {
      drawer.classList.remove('enbuild-active');

      if (this.customMenuContainerRef.current) {
        ReactDOM.unmountComponentAtNode(this.customMenuContainerRef.current);
        this.customMenuContainerRef.current.remove();
        this.customMenuContainerRef.current = null;
      }

      document.querySelectorAll('.enbuild-logo').forEach(el => el.classList.remove('active'));
      document.querySelector('.enbuild-logo.home')?.classList.add('active');

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
      '/configuration', // Included here for UI state management
    ];

    if (navigateOverview) {
      if (!customRoutes.includes(window.location.pathname)) {
        this.navigateTo('/overview');
      } else {
        this.renderCustomPage(window.location.pathname);
      }
    }
  }

  renderCustomMenu(drawer = document.querySelector('.MuiDrawer-paper')) {
    if (!drawer) return;

    if (
      !this.customMenuContainerRef.current ||
      !drawer.contains(this.customMenuContainerRef.current)
    ) {
      const menuContainerDiv = Object.assign(document.createElement('div'), {
        className: 'enbuild-menu-container',
      });
      this.customMenuContainerRef.current = menuContainerDiv;

      const scrollContainer = drawer.querySelector('.MuiDrawer-paper > div:first-child');
      if (scrollContainer) {
        scrollContainer.prepend(menuContainerDiv);
      } else {
        drawer.prepend(menuContainerDiv);
      }
    }

    ReactDOM.render(
      <CustomMenu
        menuItems={MENU_ITEMS}
        currentPath={window.location.pathname}
        navigateTo={this.navigateTo.bind(this)}
      />,
      this.customMenuContainerRef.current
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
              <path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="${DEFAULTS.primaryColor}"/>
            </svg>
          </div>
          <div class="text">EnBuild</div>
        </div>
        <div class="enbuild-logo home active" title="Default UI">
          <div class="icon">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" fill="${DEFAULTS.primaryColor}"/>
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
          '/configuration', // Included here for initial routing check
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
        '/configuration', // Included here for popstate handling
      ];

      if (customRoutes.includes(path)) {
        if (this.activeMode !== 'custom') {
          this.showCustomUI(false);
        }

        e.preventDefault();
        e.stopPropagation();

        this.renderCustomPage(path);
        this.renderCustomMenu();
      } else {
        this.cleanupCustomContent();
        this.showDefaultUI(false);
      }
    });
  }
}

// ========================= NEW REACT COMPONENT FOR CUSTOM MENU =========================
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
        >
          <ListItemIcon
            sx={{ minWidth: 'auto', mr: '12px', display: 'flex', alignItems: 'center' }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </Box>
  );
};

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
  const [settings, setSettings] = useState(() => ({
    primaryColor: config.primaryColor || DEFAULTS.primaryColor,
    secondaryColor: config.secondaryColor || DEFAULTS.secondaryColor,
    font: config.font || DEFAULTS.font,
    logoURL: config.logoURL || DEFAULTS.logoURL,
  }));

  const updateSetting = (key, value) => {
    // Ensure that if value is empty/null for color inputs, it defaults to the appropriate DEFAULTS color
    // For color inputs, an empty string or invalid value can sometimes default to black.
    // So, we'll make sure it's always a valid hex color.
    let newValue = value;
    if (key === 'primaryColor' && (!value || !/^#([0-9A-F]{3}){1,2}$/i.test(value))) {
      newValue = DEFAULTS.primaryColor;
    } else if (key === 'secondaryColor' && (!value || !/^#([0-9A-F]{3}){1,2}$/i.test(value))) {
      newValue = DEFAULTS.secondaryColor;
    } else if (!value && DEFAULTS.hasOwnProperty(key)) {
      // For other fields like logoURL if they can be empty
      newValue = DEFAULTS[key];
    }
    setSettings(prev => ({ ...prev, [key]: newValue }));
  };

  const applySettings = () => {
    store.set(settings);
    injectTheme(settings);
    loadFont(settings.font);
    registerAppLogo(SimpleLogo);
  };

  const resetSettings = () => {
    const newDefaults = { ...DEFAULTS }; // Create a fresh copy
    setSettings(newDefaults); // Update component state
    store.set(newDefaults); // Update persistent store
    injectTheme(newDefaults); // Apply to the main UI
    loadFont(newDefaults.font);
    registerAppLogo(SimpleLogo);
  };

  useEffect(() => {
    applySettings();
  }, []);

  return (
    <Box width="50%" style={{ paddingTop: '8vh', margin: '0 auto' }}>
      <Typography variant="h6" align="center" mb={2}>
        UI Theme Customizer
      </Typography>

      <TextField
        type="color"
        label="Primary Color (Drawer Background, Header)"
        value={settings.primaryColor}
        onChange={e => updateSetting('primaryColor', e.target.value)}
        fullWidth
        margin="dense"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        type="color"
        label="Secondary Color (Text/Icon in Header & Drawer)"
        value={settings.secondaryColor}
        onChange={e => updateSetting('secondaryColor', e.target.value)}
        fullWidth
        margin="dense"
        InputLabelProps={{ shrink: true }}
      />

      <FormControl fullWidth margin="dense">
        <InputLabel>Font Style</InputLabel>
        <Select
          value={settings.font}
          onChange={e => updateSetting('font', e.target.value)}
          label="Font Style"
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
        helperText="Enter a valid image URL (PNG recommended)"
      />

      <Box mt={2} display="flex" gap={2}>
        <Button onClick={applySettings} variant="contained" sx={{ flexGrow: 1 }}>
          SAVE
        </Button>
        <Button onClick={resetSettings} variant="outlined" sx={{ flexGrow: 1 }}>
          RESET
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
  // Register the ThemeCustomizer as the plugin's settings component
  registerPluginSettings('enbuild-headlamp-theme', ThemeCustomizer, false);
})();
