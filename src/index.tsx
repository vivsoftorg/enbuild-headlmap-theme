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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

// Default configuration values
const defaults = {
  primary: '#05A2C2',
  secondary: '#ffffff',
  font: 'Inter',
  logoURL: 'https://enbuild-docs.vivplatform.io/images/emma/enbuild-logo.png',
};

const fontOptions = [
  'Inter',
  'Arial',
  'Roboto',
  'Courier New',
  'Georgia',
  'Monospace',
  'Verdana',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Lucida Console',
  'Comic Sans MS',
  'PT Sans',
  'Open Sans',
  'Lato',
];

interface ThemeOptions {
  primaryColor?: string;
  secondaryColor?: string;
  font?: string;
  logoURL?: string;
}

// Initialize the config store
const store = new ConfigStore<ThemeOptions>('enbuild-customiser-theme');

// Helper Functions
const loadFont = (fontName = defaults.font) => {
  const formattedFont = fontName.replace(/ /g, '+');
  const fontLinkId = 'custom-font-loader';
  const styleId = 'custom-font-style';

  document.getElementById(fontLinkId)?.remove();
  document.getElementById(styleId)?.remove();

  if (!['Times New Roman', 'Arial', 'Courier New', 'Georgia'].includes(fontName)) {
    const link = document.createElement('link');
    link.id = fontLinkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${formattedFont}&display=swap`;
    document.head.appendChild(link);
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `body, * { font-family: "${fontName}", sans-serif !important; }`;
  document.head.appendChild(style);
};

const injectThemeStyle = (options: ThemeOptions) => {
  const primaryColor = options.primaryColor || defaults.primary;
  const secondaryColor = options.secondaryColor || defaults.secondary;

  const styleId = 'custom-theme-style';
  document.getElementById(styleId)?.remove();

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    /* Buttons */
    .MuiButton-contained {
      background-color: ${primaryColor} !important;
      color: ${secondaryColor} !important;
    }
    .MuiButton-contained:hover {
      background-color: ${primaryColor}cc !important;
    }
    
    /* Drawer and navigation */
    .MuiDrawer-paper {
      background-color: ${primaryColor} !important;
    }
    .MuiDrawer-paper > .MuiListItem-root, 
    .MuiDrawer-paper > .MuiListItem-root .MuiListItemText-primary,
    .MuiDrawer-paper .custom-menu-list .MuiListItem-root,
    .MuiDrawer-paper .custom-menu-list .MuiListItemText-primary {
      color: ${secondaryColor} !important;
    }
    .MuiDrawer-paper > .MuiListItem-root:hover,
    .MuiDrawer-paper > .MuiListItem-root.Mui-selected,
    .MuiDrawer-paper .custom-menu-list .MuiListItem-root:hover,
    .MuiDrawer-paper .custom-menu-list .MuiListItem-root.Mui-selected {
      background-color: ${secondaryColor} !important;
      color: ${primaryColor} !important;
    }
    .MuiDrawer-paper > .MuiListItem-root:hover .MuiListItemText-primary,
    .MuiDrawer-paper > .MuiListItem-root.Mui-selected .MuiListItemText-primary,
    .MuiDrawer-paper .custom-menu-list .MuiListItem-root:hover .MuiListItemText-primary,
    .MuiDrawer-paper .custom-menu-list .MuiListItem-root.Mui-selected .MuiListItemText-primary {
      color: ${primaryColor} !important;
    }
    
    /* Collapsed menu items */
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root {
      background-color: transparent !important;
      color: ${secondaryColor} !important;
      transition: color 0.3s, background-color 0.3s !important;
    }
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root:hover,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root.Mui-selected {
      background-color: ${secondaryColor} !important;
      color: ${primaryColor} !important;
    }
    
    /* Icons */
    .MuiDrawer-paper .MuiListItemIcon,
    .MuiDrawer-paper .MuiSvgIcon-root {
      color: ${secondaryColor} !important;
    }
    .MuiDrawer-paper > .MuiListItem-root:hover .MuiListItemIcon,
    .MuiDrawer-paper > .MuiListItem-root.Mui-selected .MuiListItemIcon,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root:hover .MuiListItemIcon,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root.Mui-selected .MuiListItemIcon {
      color: ${primaryColor} !important;
    }
    
    /* Header */
    .MuiAppBar-root {
      background-color: ${primaryColor} !important;
      color: ${secondaryColor} !important;
    }
    .MuiAppBar-root *,
    .MuiAppBar-root input,
    .MuiAppBar-root input::placeholder,
    .MuiAppBar-root .MuiSvgIcon-root,
    .MuiAppBar-root .MuiIconButton-root,
    .MuiAppBar-root button,
    .MuiAppBar-root a {
      color: ${secondaryColor} !important;
    }
    .MuiAppBar-root input::placeholder {
      color: ${secondaryColor}99 !important;
    }
    
    /* Search field */
    .MuiAppBar-root .MuiInputBase-root,
    .MuiAppBar-root .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline,
    .MuiAppBar-root .MuiInput-underline:before,
    .MuiAppBar-root .MuiInput-underline:after,
    .MuiAppBar-root .MuiInput-underline:hover:not(.Mui-disabled):before,
    .MuiAppBar-root .MuiFilledInput-underline:before,
    .MuiAppBar-root .MuiFilledInput-underline:after,
    .MuiAppBar-root input[type="text"],
    .MuiAppBar-root input[type="search"],
    .MuiAppBar-root .MuiInput-root::before,
    .MuiAppBar-root .MuiInput-root::after {
      border-color: ${secondaryColor} !important;
      caret-color: ${secondaryColor} !important;
    }

    /* Custom Menu Styles */
    .custom-menu-list {
      width: 100%;
      padding-top: 8px !important;
      padding-bottom: 8px !important;
    }
    
    .custom-menu-list .MuiListItem-root {
      padding: 8px 16px;
      cursor: pointer;
      border-radius: 4px;
      margin: 2px 8px;
      transition: background-color 0.3s ease;
    }
    
    .custom-menu-list .MuiListItem-root:hover {
      background-color: ${secondaryColor} !important;
    }
    
    .custom-menu-list .MuiListItem-root:hover .MuiListItemText-primary {
      color: ${primaryColor} !important;
    }
    
    .drawer-logo-container {
      position: sticky !important;
      bottom: 0 !important;
      background-color: ${primaryColor} !important;
      border-top: 1px solid ${secondaryColor}33 !important;
    }
  `;
  document.head.appendChild(style);
};

// Navigation functions
const navigateTo = path => {
  if (window.location.pathname !== path) {
    window.location.href = path;
  }
};

const navigateToHomePage = (drawerElement: HTMLElement | null) => {
  // Remove custom menu when navigating to home
  if (drawerElement) {
    const existingMenu = drawerElement.querySelector('.custom-menu-list');
    if (existingMenu) {
      existingMenu.remove();
    }
  }
  navigateTo('/dashboard');
};

// Menu data
const defaultMenuItems = [
  { text: 'Dashboard', path: '/dashboard' },
  { text: 'Nodes', path: '/nodes' },
  { text: 'Pods', path: '/pods' },
  { text: 'Services', path: '/services' },
];

const k8sMenuItems = [
  { text: 'K8s Dashboard', path: '/k8s-dashboard' },
  { text: 'Nodes', path: '/k8s-nodes' },
  { text: 'Pods', path: '/k8s-pods' },
  { text: 'Services', path: '/k8s-services' },
];

// Menu state management
const createMenuManager = () => {
  let activeMenuType = 'default'; // Tracks which menu is currently active

  return {
    // Switch to default menu
    showDefaultMenu: (drawerElement: HTMLElement | null) => {
      if (activeMenuType === 'default') return; // Already showing default menu
      activeMenuType = 'default';
      if (drawerElement) {
        // Check if drawerElement exists
        createMenuList(defaultMenuItems, drawerElement);
      }
    },

    // Switch to k8s menu
    showK8sMenu: (drawerElement: HTMLElement | null) => {
      if (activeMenuType === 'k8s') return; // Already showing k8s menu
      activeMenuType = 'k8s';
      if (drawerElement) {
        createMenuList(k8sMenuItems, drawerElement);
      }
    },

    // Get current menu type
    getActiveMenuType: () => activeMenuType,
  };
};

// Create a single instance of the menu manager
const menuManager = createMenuManager();

// Helper to create and insert menu in drawer
const createMenuList = (items: { text: string; path: string }[], drawerElement: HTMLElement) => {
  // Remove existing custom menu if any
  const existingMenu = drawerElement.querySelector('.custom-menu-list');
  if (existingMenu) {
    existingMenu.remove();
  }

  // Create new menu
  const menuList = document.createElement('ul');
  menuList.className = 'MuiList-root custom-menu-list';

  items.forEach(item => {
    const listItem = document.createElement('li');
    listItem.className = 'MuiListItem-root';
    listItem.style.display = 'flex';
    listItem.style.alignItems = 'center';

    listItem.innerHTML = `<div class="MuiListItemText-root">
      <span class="MuiListItemText-primary">${item.text}</span>
    </div>`;

    listItem.addEventListener('click', () => navigateTo(item.path));

    menuList.appendChild(listItem);
  });

  // Insert at top of drawer, before any logo containers
  const logoContainer = drawerElement.querySelector('.drawer-logo-container');
  if (logoContainer) {
    drawerElement.insertBefore(menuList, logoContainer);
  } else {
    drawerElement.appendChild(menuList);
  }

  return menuList;
};

// Drawer and Logo Management
const checkDrawerCollapsed = (drawer: HTMLElement) => {
  const isCollapsed = drawer.clientWidth < 100;
  drawer.classList[isCollapsed ? 'add' : 'remove']('collapsed');
};

const setupDrawerCollapseDetection = (drawer: HTMLElement) => {
  checkDrawerCollapsed(drawer);

  const resizeObserver = new ResizeObserver(() => checkDrawerCollapsed(drawer));
  resizeObserver.observe(drawer);

  window.addEventListener('resize', () => checkDrawerCollapsed(drawer));
};

// Core function to add drawer icons
const injectDrawerIcons = () => {
  // Remove existing logos
  document.querySelectorAll('.drawer-logo-container').forEach(c => c.remove());

  // Add logo styles
  const styleId = 'drawer-logos-style';
  document.getElementById(styleId)?.remove();

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    .drawer-logo-container {
      width: 100%;
      padding: 16px;
      margin-top: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1200;
    }
    .logo-layout {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      width: 100%;
      transition: flex-direction 0.3s ease;
    }
    .MuiDrawer-paper.collapsed .logo-layout { flex-direction: column; }
    .MuiDrawer-paper:not(.collapsed) .logo-layout { flex-direction: row; }
    
    .drawer-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      flex: 1;
    }
    .drawer-logo .mui-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      border-radius: 4px;
      padding: 4px;
    }
    .drawer-logo .mui-icon svg {
      width: 32px;
      height: 32px;
      color: ${defaults.primary} !important;
    }
    .drawer-logo .logo-text {
      margin-top: 8px;
      color: ${defaults.secondary};
      font-size: 12px;
      text-align: center;
    }
    .MuiDrawer-paper.collapsed .logo-text { display: none; }
    
    .drawer-logo:hover {
      opacity: 0.8;
      transition: all 0.2s ease;
    }
    .drawer-logo:hover .mui-icon {
      transform: scale(1.05);
      box-shadow: 0 0 5px rgba(255,255,255,0.3);
    }
  `;
  document.head.appendChild(style);

  // Add logos to drawer
  const drawer = document.querySelector('.MuiDrawer-paper');
  if (!drawer) {
    console.error('Drawer element not found');
    return false;
  }

  // First add default menu items to the drawer - ensure we start with default menu
  menuManager.showDefaultMenu(drawer);

  // Create logo container
  const logoContainer = document.createElement('div');
  logoContainer.className = 'drawer-logo-container';
  logoContainer.setAttribute('data-logo-container', 'true');

  const logoLayout = document.createElement('div');
  logoLayout.className = 'logo-layout';
  logoContainer.appendChild(logoLayout);

  // K8s logo with MUI Storage icon
  const k8sLogoDiv = document.createElement('div');
  k8sLogoDiv.className = 'drawer-logo kubernetes-logo';

  // Create the MUI icon container
  const k8sIconContainer = document.createElement('div');
  k8sIconContainer.className = 'mui-icon';
  k8sLogoDiv.appendChild(k8sIconContainer);

  // Use document.createElementNS for SVG
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '32');
  svg.setAttribute('height', '32');

  // Create the Storage icon path
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute(
    'd',
    'M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z'
  );
  path.setAttribute('fill', defaults.primary);
  svg.appendChild(path);

  k8sIconContainer.appendChild(svg);

  const k8sLogoText = document.createElement('div');
  k8sLogoText.className = 'logo-text';
  k8sLogoText.textContent = 'K8s UI';
  k8sLogoDiv.appendChild(k8sLogoText);

  // Add click handler to switch to K8s menu
  k8sLogoDiv.addEventListener('click', () => {
    menuManager.showK8sMenu(drawer);
  });

  k8sLogoDiv.title = 'Kubernetes UI';
  logoLayout.appendChild(k8sLogoDiv);

  // Home icon
  const homeLogoDiv = document.createElement('div');
  homeLogoDiv.className = 'drawer-logo home-logo';

  // Create the MUI icon container for Home
  const homeIconContainer = document.createElement('div');
  homeIconContainer.className = 'mui-icon';
  homeLogoDiv.appendChild(homeIconContainer);

  // Create Home icon SVG
  const homeSvg = document.createElementNS(svgNS, 'svg');
  homeSvg.setAttribute('viewBox', '0 0 24 24');
  homeSvg.setAttribute('width', '32');
  homeSvg.setAttribute('height', '32');

  // Create the Home icon path
  const homePath = document.createElementNS(svgNS, 'path');
  homePath.setAttribute('d', 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z');
  homePath.setAttribute('fill', defaults.primary);
  homeSvg.appendChild(homePath);

  homeIconContainer.appendChild(homeSvg);

  const homeLogoText = document.createElement('div');
  homeLogoText.className = 'logo-text';
  homeLogoText.textContent = 'Home';
  homeLogoDiv.appendChild(homeLogoText);

  // Add the click event to navigate to home and restore default menu
  homeLogoDiv.addEventListener('click', () => {
    const drawerElement = document.querySelector('.MuiDrawer-paper') as HTMLElement;
    menuManager.showDefaultMenu(drawerElement);
    navigateToHomePage(drawerElement);
  });
  homeLogoDiv.title = 'Go to Home';
  logoLayout.appendChild(homeLogoDiv);

  drawer.appendChild(logoContainer);
  setupDrawerCollapseDetection(drawer);

  return true;
};

// Initialize drawer icons with retries
const initializeDrawerIcons = () => {
  // Immediate attempt
  if (injectDrawerIcons()) return;

  // Watch for DOM changes
  const observer = new MutationObserver((mutations, obs) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length && document.querySelector('.MuiDrawer-paper')) {
        if (injectDrawerIcons()) {
          obs.disconnect();
          return;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Fallback with retries
  let attempts = 0;
  const maxAttempts = 15;
  const retryInterval = setInterval(() => {
    if (document.querySelector('.drawer-logo-container')) {
      clearInterval(retryInterval);
      return;
    }

    if (attempts >= maxAttempts) {
      console.log('Maximum attempts reached');
      clearInterval(retryInterval);
      return;
    }

    if (injectDrawerIcons()) {
      clearInterval(retryInterval);
    }

    attempts++;
  }, 1000);

  // Try when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!document.querySelector('.drawer-logo-container')) {
        injectDrawerIcons();
      }
    });
  }
};

// Initialize icons and set up event listeners
initializeDrawerIcons();

window.addEventListener('load', () => {
  if (!document.querySelector('.drawer-logo-container')) {
    injectDrawerIcons();
  }

  window.addEventListener('popstate', () => {
    if (!document.querySelector('.drawer-logo-container')) {
      injectDrawerIcons();
    }
  });
});

// Observe route changes
const routeObserver = new MutationObserver(() => {
  if (
    !document.querySelector('.drawer-logo-container') &&
    document.querySelector('.MuiDrawer-paper')
  ) {
    injectDrawerIcons();
  }
});

routeObserver.observe(document.body, { childList: true, subtree: true });

// Apply initial theme settings
const initialConfig = store.get() || {};
injectThemeStyle(initialConfig);
if (initialConfig.font) loadFont(initialConfig.font);

// Logo component for header
export function SimpleLogo(props: AppLogoProps) {
  const { className = '' } = props;
  const useConf = store.useConfig();
  const config = useConf();

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
        left: '250px',
        zIndex: 10,
      }}
      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
        console.error('Error loading logo: ', e.currentTarget.src);
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}

if (initialConfig.logoURL) registerAppLogo(SimpleLogo);

// Settings Component
const ThemeCustomizer = () => {
  const config = store.get() || {};
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor || defaults.primary);
  const [secondaryColor, setSecondaryColor] = useState(config.secondaryColor || defaults.secondary);
  const [font, setFont] = useState(config.font || defaults.font);
  const [logoURL, setLogoURL] = useState(config.logoURL || defaults.logoURL);

  // Ensure icons are present when settings opened
  useEffect(() => {
    if (!document.querySelector('.drawer-logo-container')) {
      injectDrawerIcons();
    }
  }, []);

  const savePreferences = () => {
    const newConfig: ThemeOptions = {
      primaryColor,
      secondaryColor,
      font,
      logoURL,
    };

    store.set(newConfig);
    injectThemeStyle(newConfig);
    if (font) loadFont(font);
    if (logoURL) registerAppLogo(SimpleLogo);

    injectDrawerIcons();
  };

  const resetPreferences = () => {
    const resetConfig: ThemeOptions = {
      primaryColor: defaults.primary,
      secondaryColor: defaults.secondary,
      font: defaults.font,
      logoURL: defaults.logoURL,
    };

    // Update state
    setPrimaryColor(defaults.primary);
    setSecondaryColor(defaults.secondary);
    setFont(defaults.font);
    setLogoURL(defaults.logoURL);

    // Apply changes
    store.set(resetConfig);
    injectThemeStyle(resetConfig);
    loadFont(defaults.font);
    registerAppLogo(SimpleLogo);

    injectDrawerIcons();
  };

  return (
    <Box width="50%" style={{ paddingTop: '8vh' }}>
      <Box mb={2}>
        <Typography variant="h6" align="center">
          UI Theme Customizer
        </Typography>
      </Box>

      <TextField
        type="color"
        label="Primary Color (Drawer Background, Header)"
        value={primaryColor}
        onChange={e => setPrimaryColor(e.target.value || defaults.primary)}
        fullWidth
        variant="outlined"
        margin="dense"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        type="color"
        label="Secondary Color (Text/Icon in Header & Drawer)"
        value={secondaryColor}
        onChange={e => setSecondaryColor(e.target.value || defaults.secondary)}
        fullWidth
        variant="outlined"
        margin="dense"
        InputLabelProps={{ shrink: true }}
      />

      <FormControl fullWidth margin="dense">
        <InputLabel id="font-select-label">Font Style</InputLabel>
        <Select
          labelId="font-select-label"
          value={font}
          onChange={e => setFont(e.target.value || defaults.font)}
          label="Font Style"
        >
          {fontOptions.map(f => (
            <MenuItem key={f} value={f} style={{ fontFamily: f }}>
              {f}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Logo URL"
        value={logoURL}
        onChange={e => setLogoURL(e.target.value)}
        fullWidth
        variant="outlined"
        margin="dense"
        InputLabelProps={{ shrink: true }}
        helperText="Enter a valid image URL for the logo (PNG recommended)"
      />
      <Box mt={2} display="flex" justifyContent="space-between" gap={2}>
        <Button onClick={savePreferences} variant="contained">
          Save
        </Button>
        <Button onClick={resetPreferences} variant="outlined">
          Reset
        </Button>
      </Box>
    </Box>
  );
};

registerPluginSettings('enbuild-headlamp-theme', ThemeCustomizer, false);

// React Component for Menu Items
function MenuItemComponent({ path, text }) {
  const handleClick = () => {
    window.location.href = path;
  };

  return (
    <ListItem
      button
      onClick={handleClick}
      sx={{ borderRadius: '4px', margin: '2px 8px', padding: '8px 16px' }}
    >
      <ListItemText primary={text} />
    </ListItem>
  );
}

// Add event listeners for navbar icons
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const drawer = document.querySelector('.MuiDrawer-paper');
    if (drawer) {
      // Handle K8s UI click - use delegation for dynamic elements
      document.addEventListener('click', event => {
        const target = event.target as HTMLElement;
        const k8sLogoElement = target.closest('.kubernetes-logo');
        if (k8sLogoElement) {
          menuManager.showK8sMenu(drawer);
        }
      });

      // Handle Home icon click
      document.addEventListener('click', event => {
        const target = event.target as HTMLElement;
        const homeLogoElement = target.closest('.home-logo');
        if (homeLogoElement) {
          const drawerElement = document.querySelector('.MuiDrawer-paper') as HTMLElement;
          menuManager.showDefaultMenu(drawerElement);
          navigateToHomePage(drawerElement);
        }
      });
    }
  }, 500);
});
