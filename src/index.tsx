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
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  LayoutList,
  Store,
  Cpu,
  GitBranchPlus,
  Settings,
  Rocket,
} from 'lucide-react';

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
    .MuiButton-contained { background-color: ${primaryColor} !important; color: ${secondaryColor} !important; }
    .MuiButton-contained:hover { background-color: ${primaryColor}cc !important; }
    
    /* Drawer and navigation */
    .MuiDrawer-paper { background-color: ${primaryColor} !important; }
    .MuiDrawer-paper > .MuiListItem-root, 
    .MuiDrawer-paper > .MuiListItem-root .MuiListItemText-primary,
    .MuiDrawer-paper .custom-menu-list .MuiListItem-root,
    .MuiDrawer-paper .custom-menu-list .MuiListItemText-primary { color: ${secondaryColor} !important; }
    .MuiDrawer-paper > .MuiListItem-root:hover,
    .MuiDrawer-paper > .MuiListItem-root.Mui-selected,
    .MuiDrawer-paper .custom-menu-list .MuiListItem-root:hover,
    .MuiDrawer-paper .custom-menu-list .MuiListItem-root.Mui-selected { 
      background-color: ${secondaryColor} !important; color: ${primaryColor} !important; 
    }
    .MuiDrawer-paper > .MuiListItem-root:hover .MuiListItemText-primary,
    .MuiDrawer-paper > .MuiListItem-root.Mui-selected .MuiListItemText-primary,
    .MuiDrawer-paper .custom-menu-list .MuiListItem-root:hover .MuiListItemText-primary,
    .MuiDrawer-paper .custom-menu-list .MuiListItem-root.Mui-selected .MuiListItemText-primary { color: ${primaryColor} !important; }
    
    /* Collapsed menu items */
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root {
      background-color: transparent !important; color: ${secondaryColor} !important;
      transition: color 0.3s, background-color 0.3s !important;
    }
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root:hover,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root.Mui-selected {
      background-color: ${secondaryColor} !important; color: ${primaryColor} !important;
    }
    
    /* Icons */
    .MuiDrawer-paper .MuiListItemIcon, .MuiDrawer-paper .MuiSvgIcon-root { color: ${secondaryColor} !important; }
    .MuiDrawer-paper > .MuiListItem-root:hover .MuiListItemIcon,
    .MuiDrawer-paper > .MuiListItem-root.Mui-selected .MuiListItemIcon,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root:hover .MuiListItemIcon,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root.Mui-selected .MuiListItemIcon { color: ${primaryColor} !important; }
    
    /* Header */
    .MuiAppBar-root { background-color: ${primaryColor} !important; color: ${secondaryColor} !important; }
    .MuiAppBar-root *, .MuiAppBar-root input, .MuiAppBar-root input::placeholder,
    .MuiAppBar-root .MuiSvgIcon-root, .MuiAppBar-root .MuiIconButton-root,
    .MuiAppBar-root button, .MuiAppBar-root a { color: ${secondaryColor} !important; }
    .MuiAppBar-root input::placeholder { color: ${secondaryColor}99 !important; }
    
    /* Search field */
    .MuiAppBar-root .MuiInputBase-root, .MuiAppBar-root .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline,
    .MuiAppBar-root .MuiInput-underline:before, .MuiAppBar-root .MuiInput-underline:after,
    .MuiAppBar-root .MuiInput-underline:hover:not(.Mui-disabled):before,
    .MuiAppBar-root .MuiFilledInput-underline:before, .MuiAppBar-root .MuiFilledInput-underline:after,
    .MuiAppBar-root input[type="text"], .MuiAppBar-root input[type="search"],
    .MuiAppBar-root .MuiInput-root::before, .MuiAppBar-root .MuiInput-root::after {
      border-color: ${secondaryColor} !important; caret-color: ${secondaryColor} !important;
    }

    /* Custom Menu Styles */
    .custom-menu-list {
      width: 100%; padding-top: 8px !important; padding-bottom: 8px !important;
    }
    .custom-menu-list .MuiListItem-root {
      padding: 8px 16px; cursor: pointer; border-radius: 4px; margin: 2px 8px;
      transition: background-color 0.3s ease;
    }
    .custom-menu-list .MuiListItem-root:hover { background-color: ${secondaryColor} !important; }
    .custom-menu-list .MuiListItem-root:hover .MuiListItemText-primary { color: ${primaryColor} !important; }
    
    .drawer-logo-container {
      position: sticky !important; bottom: 0 !important; background-color: ${primaryColor} !important;
      border-top: 1px solid ${secondaryColor}33 !important;
    }
    
    /* Hide default navigation when custom menu is active */
    .MuiDrawer-paper.custom-menu-active .default-nav-item {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
};

// Navigation functions
const navigateTo = path =>
  window.location.pathname !== path ? (window.location.href = path) : null;
const navigateToHomePage = (drawerElement: HTMLElement | null) => {
  if (drawerElement) {
    // Restore default navigation menu
    drawerElement.classList.remove('custom-menu-active');
    // Remove the custom menu if it exists
    drawerElement.querySelector('.custom-menu-list')?.remove();
  }
  navigateTo('/dashboard');
};

// Menu data
const k8sMenuItems = [
  { text: 'Overview', path: '/overview', icon: <LayoutDashboard size={20} /> },
  { text: 'Pipelines', path: '/pipelines', icon: <LayoutList size={20} /> },
  { text: 'Marketplace', path: '/marketplace', icon: <Store size={20} /> },
  { text: 'Components', path: '/components', icon: <Cpu size={20} /> },
  { text: 'Deployment Flows', path: '/deployment-flows', icon: <GitBranchPlus size={20} /> },
  { text: 'Configuration', path: '/configuration', icon: <Settings size={20} /> },
];

// Menu state management
const createMenuManager = () => {
  let activeMenuType = 'default';
  return {
    showDefaultMenu: (drawerElement: HTMLElement | null) => {
      if (activeMenuType === 'default') return;
      activeMenuType = 'default';

      if (drawerElement) {
        // Show default navigation items
        drawerElement.classList.remove('custom-menu-active');
        // Remove the custom menu if it exists
        drawerElement.querySelector('.custom-menu-list')?.remove();
      }
    },
    showK8sMenu: (drawerElement: HTMLElement | null) => {
      if (activeMenuType === 'k8s') {
        // If k8s menu is already active, remove it and set to default
        this.showDefaultMenu(drawerElement);
        return;
      }
      activeMenuType = 'k8s';
      if (drawerElement) {
        // Mark drawer as having custom menu active to hide default items
        drawerElement.classList.add('custom-menu-active');
        createMenuList(k8sMenuItems, drawerElement);
      }
    },
    toggleK8sMenu: (drawerElement: HTMLElement | null) => {
      if (activeMenuType === 'k8s') {
        // If k8s menu is active, remove it and set to default
        activeMenuType = 'default';
        if (drawerElement) {
          // Show default navigation items
          drawerElement.classList.remove('custom-menu-active');
          // Remove the custom menu
          drawerElement.querySelector('.custom-menu-list')?.remove();
        }
      } else {
        // If default menu is active, show k8s menu
        activeMenuType = 'k8s';
        if (drawerElement) {
          // Hide default navigation items
          drawerElement.classList.add('custom-menu-active');
          createMenuList(k8sMenuItems, drawerElement);
        }
      }
    },
    getActiveMenuType: () => activeMenuType,
  };
};
const menuManager = createMenuManager();

// Helper to create and insert menu in drawer
const createMenuList = (
  items: { text: string; path: string; icon?: React.ReactNode }[],
  drawerElement: HTMLElement
) => {
  const existingMenu = drawerElement.querySelector('.custom-menu-list');
  if (existingMenu) existingMenu.remove();

  const menuList = document.createElement('ul');
  menuList.className = 'MuiList-root custom-menu-list';

  items.forEach(item => {
    const listItem = document.createElement('li');
    listItem.className = 'MuiListItem-root';
    listItem.style.display = 'flex';
    listItem.style.alignItems = 'center';

    // Add icon if available
    if (item.icon) {
      const iconElement = document.createElement('span');
      iconElement.style.marginRight = '12px';
      iconElement.className = 'menu-item-icon';

      const tempDiv = document.createElement('div');
      // Use ReactDOM to render the React icon element
      ReactDOM.render(item.icon, tempDiv);
      // Append the rendered icon to our container
      iconElement.appendChild(tempDiv.firstChild!);
      listItem.appendChild(iconElement);
    }

    const textSpan = document.createElement('span');
    textSpan.className = 'MuiListItemText-primary';
    textSpan.textContent = item.text;
    const textDiv = document.createElement('div');
    textDiv.className = 'MuiListItemText-root';
    textDiv.appendChild(textSpan);
    listItem.appendChild(textDiv);

    listItem.addEventListener('click', () => navigateTo(item.path));
    menuList.appendChild(listItem);
  });

  // Insert the menu at the beginning of the drawer
  // Find the first child of the drawer (after which we'll insert our menu)
  const firstChild = drawerElement.firstChild;
  if (firstChild) {
    drawerElement.insertBefore(menuList, firstChild);
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

// Mark default navigation items
const markDefaultNavItems = (drawer: HTMLElement) => {
  const defaultNavItems = drawer.querySelectorAll('.MuiListItem-root:not(.custom-menu-item)');
  defaultNavItems.forEach(item => {
    if (!item.classList.contains('custom-menu-item') && !item.classList.contains('drawer-logo')) {
      item.classList.add('default-nav-item');
    }
  });
};

// Core function to add drawer icons
const injectDrawerIcons = () => {
  document.querySelectorAll('.drawer-logo-container').forEach(c => c.remove());
  const styleId = 'drawer-logos-style';
  document.getElementById(styleId)?.remove();

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    .drawer-logo-container {
      width: 100%; padding: 16px; margin-top: auto; display: flex; flex-direction: column;
      align-items: center; justify-content: center; z-index: 1200;
    }
    .logo-layout {
      display: flex; justify-content: center; align-items: center; gap: 16px;
      width: 100%; transition: flex-direction 0.3s ease;
    }
    .MuiDrawer-paper.collapsed .logo-layout { flex-direction: column; }
    .MuiDrawer-paper:not(.collapsed) .logo-layout { flex-direction: row; }
    
    .drawer-logo {
      display: flex; flex-direction: column; align-items: center; cursor: pointer; flex: 1;
    }
    .drawer-logo .mui-icon {
      width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
      background-color: white; border-radius: 4px; padding: 4px;
    }
    .drawer-logo .mui-icon svg {
      width: 32px; height: 32px; color: ${defaults.primary} !important;
    }
    .drawer-logo .logo-text {
      margin-top: 8px; color: ${defaults.secondary}; font-size: 12px; text-align: center;
    }
    .MuiDrawer-paper.collapsed .logo-text { display: none; }
    
    .drawer-logo:hover {
      opacity: 0.8; transition: all 0.2s ease;
    }
    .drawer-logo:hover .mui-icon {
      transform: scale(1.05); box-shadow: 0 0 5px rgba(255,255,255,0.3);
    }

    /* Indicator for active menu */
    .drawer-logo.active .mui-icon {
      box-shadow: 0 0 8px rgba(255,255,255,0.5);
      border: 2px solid ${defaults.secondary};
    }

    /* Menu item icons */
    .menu-item-icon {
      display: flex;
      align-items: center;
      margin-right: 12px;
      color: ${defaults.secondary};
    }
    .MuiListItem-root:hover .menu-item-icon svg,
    .MuiListItem-root.Mui-selected .menu-item-icon svg {
      color: ${defaults.primary} !important;
    }
  `;
  document.head.appendChild(style);

  const drawer = document.querySelector('.MuiDrawer-paper');
  if (!drawer) {
    console.error('Drawer element not found');
    return false;
  }

  // Mark default navigation items for potential hiding
  markDefaultNavItems(drawer as HTMLElement);

  menuManager.showDefaultMenu(drawer as HTMLElement);

  const logoContainer = document.createElement('div');
  logoContainer.className = 'drawer-logo-container';
  logoContainer.setAttribute('data-logo-container', 'true');

  const logoLayout = document.createElement('div');
  logoLayout.className = 'logo-layout';
  logoContainer.appendChild(logoLayout);

  // K8s logo with MUI Storage icon
  const k8sLogoDiv = document.createElement('div');
  k8sLogoDiv.className = 'drawer-logo kubernetes-logo';

  const k8sIconContainer = document.createElement('div');
  k8sIconContainer.className = 'mui-icon';
  k8sLogoDiv.appendChild(k8sIconContainer);

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '32');
  svg.setAttribute('height', '32');

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
  k8sLogoText.textContent = 'New UI';
  k8sLogoDiv.appendChild(k8sLogoText);

  // Modified to toggle the K8s menu
  k8sLogoDiv.addEventListener('click', () => {
    const drawerElement = document.querySelector('.MuiDrawer-paper') as HTMLElement;
    menuManager.toggleK8sMenu(drawerElement);

    // Toggle active class on the k8s logo
    if (menuManager.getActiveMenuType() === 'k8s') {
      k8sLogoDiv.classList.add('active');
    } else {
      k8sLogoDiv.classList.remove('active');
    }
  });

  k8sLogoDiv.title = 'Toggle Kubernetes UI Menu';
  logoLayout.appendChild(k8sLogoDiv);

  // Home icon
  const homeLogoDiv = document.createElement('div');
  homeLogoDiv.className = 'drawer-logo home-logo';

  const homeIconContainer = document.createElement('div');
  homeIconContainer.className = 'mui-icon';
  homeLogoDiv.appendChild(homeIconContainer);

  const homeSvg = document.createElementNS(svgNS, 'svg');
  homeSvg.setAttribute('viewBox', '0 0 24 24');
  homeSvg.setAttribute('width', '32');
  homeSvg.setAttribute('height', '32');

  const homePath = document.createElementNS(svgNS, 'path');
  homePath.setAttribute('d', 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z');
  homePath.setAttribute('fill', defaults.primary);
  homeSvg.appendChild(homePath);
  homeIconContainer.appendChild(homeSvg);

  const homeLogoText = document.createElement('div');
  homeLogoText.className = 'logo-text';
  homeLogoText.textContent = 'Home';
  homeLogoDiv.appendChild(homeLogoText);

  homeLogoDiv.addEventListener('click', () => {
    const drawerElement = document.querySelector('.MuiDrawer-paper') as HTMLElement;
    menuManager.showDefaultMenu(drawerElement);
    // Remove active class from k8s logo when home is clicked
    document.querySelector('.kubernetes-logo')?.classList.remove('active');
    navigateToHomePage(drawerElement);
  });
  homeLogoDiv.title = 'Go to Home';
  logoLayout.appendChild(homeLogoDiv);

  drawer.appendChild(logoContainer);
  setupDrawerCollapseDetection(drawer as HTMLElement);
  return true;
};

// Add event listeners for navbar icons
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const drawer = document.querySelector('.MuiDrawer-paper');
    if (drawer) {
      document.addEventListener('click', event => {
        const target = event.target as HTMLElement;
        if (target.closest('.kubernetes-logo')) {
          const drawerElement = document.querySelector('.MuiDrawer-paper') as HTMLElement;
          menuManager.toggleK8sMenu(drawerElement);

          // Toggle active class on the k8s logo
          const k8sLogo = document.querySelector('.kubernetes-logo');
          if (menuManager.getActiveMenuType() === 'k8s') {
            k8sLogo?.classList.add('active');
          } else {
            k8sLogo?.classList.remove('active');
          }
        }
      });
    }
  }, 500);
});

// Initialize drawer icons with retries
const initializeDrawerIcons = () => {
  if (injectDrawerIcons()) return;

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
    if (injectDrawerIcons()) clearInterval(retryInterval);
    attempts++;
  }, 1000);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!document.querySelector('.drawer-logo-container')) injectDrawerIcons();
    });
  }
};

// Initialize icons and set up event listeners
initializeDrawerIcons();

window.addEventListener('load', () => {
  if (!document.querySelector('.drawer-logo-container')) injectDrawerIcons();
  window.addEventListener('popstate', () => {
    if (!document.querySelector('.drawer-logo-container')) injectDrawerIcons();
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

  useEffect(() => {
    if (!document.querySelector('.drawer-logo-container')) injectDrawerIcons();
  }, []);

  const savePreferences = () => {
    const newConfig: ThemeOptions = { primaryColor, secondaryColor, font, logoURL };
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
    setPrimaryColor(defaults.primary);
    setSecondaryColor(defaults.secondary);
    setFont(defaults.font);
    setLogoURL(defaults.logoURL);
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
function MenuItemComponent({ path, text, icon }) {
  return (
    <ListItem
      button
      onClick={() => (window.location.href = path)}
      sx={{ borderRadius: '4px', margin: '2px 8px', padding: '8px 16px' }}
    >
      {icon && <span className="menu-item-icon">{icon}</span>}
      <ListItemText primary={text} />
    </ListItem>
  );
}

// Add event listeners for navbar icons
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const drawer = document.querySelector('.MuiDrawer-paper');
    if (drawer) {
      document.addEventListener('click', event => {
        const target = event.target as HTMLElement;
        if (target.closest('.kubernetes-logo')) {
          const drawerElement = document.querySelector('.MuiDrawer-paper') as HTMLElement;
          menuManager.toggleK8sMenu(drawerElement);

          // Toggle active class on the k8s logo
          const k8sLogo = document.querySelector('.kubernetes-logo');
          if (menuManager.getActiveMenuType() === 'k8s') {
            k8sLogo?.classList.add('active');
          } else {
            k8sLogo?.classList.remove('active');
          }
        }
      });
    }
  }, 500);
});
