import {
  AppLogoProps,
  ConfigStore,
  registerAppLogo,
  registerPluginSettings,
} from '@kinvolk/headlamp-plugin/lib';
// Import MUI icons - we'll use Storage for Kubernetes
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
import React, { useEffect, useState } from 'react';

// Default configuration values
const defaults = {
  primary: '#05A2C2',
  secondary: '#ffffff',
  font: 'Inter',
  logoURL: 'https://enbuild-docs.vivplatform.io/images/emma/enbuild-logo.png',
  clusterUIPath: '',
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
  clusterUIPath?: string;
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
    .MuiDrawer-paper > .MuiListItem-root .MuiListItemText-primary {
      color: ${secondaryColor} !important;
    }
    .MuiDrawer-paper > .MuiListItem-root:hover,
    .MuiDrawer-paper > .MuiListItem-root.Mui-selected {
      background-color: ${secondaryColor} !important;
      color: ${primaryColor} !important;
    }
    .MuiDrawer-paper > .MuiListItem-root:hover .MuiListItemText-primary,
    .MuiDrawer-paper > .MuiListItem-root.Mui-selected .MuiListItemText-primary {
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
  `;
  document.head.appendChild(style);
};

// Navigation and Cluster Management
const getActiveCluster = () => {
  // Try URL pattern first
  const pathMatch = window.location.pathname.match(/\/(?:c|cluster)\/([^\/]+)/);
  if (pathMatch && pathMatch[1]) return pathMatch[1];

  // Try localStorage
  try {
    const storageKeys = Object.keys(localStorage);
    for (const key of storageKeys) {
      if (key.includes('active-cluster')) {
        const activeCluster = JSON.parse(localStorage.getItem(key) || '');
        if (activeCluster && typeof activeCluster === 'string') return activeCluster;
      }
    }
  } catch (e) {
    console.error('Error accessing localStorage:', e);
  }

  return 'k3d-headlamp';
};

const navigateToClusterOverview = () => {
  const activeCluster = getActiveCluster();
  console.log('Navigating to cluster overview for:', activeCluster);

  // Already in cluster context
  if (
    window.location.pathname.includes(`/c/${activeCluster}/`) ||
    window.location.pathname.includes(`/cluster/${activeCluster}/`)
  ) {
    window.location.href = `/c/${activeCluster}/overview`;
    return;
  }

  // Try to find and click the cluster card
  const clusterCard = document.querySelector(`[data-testid="cluster-card-${activeCluster}"]`);
  if (clusterCard) {
    (clusterCard as HTMLElement).click();
    return;
  }

  // Direct URL navigation
  window.location.href = `/c/${activeCluster}`;
};

const navigateToHomePage = () => {
  // Try different approaches to find the home icon/button
  const homeSelectors = [
    '.MuiDrawer-paper > div:first-child svg',
    '.MuiDrawer-paper > ul > li:first-child',
    '.MuiDrawer-paper button:first-of-type',
    '.MuiDrawer-paper > *:first-child',
    'div[style*="house.svg"]',
    'img[src*="house"], img[src*="home"]',
  ];

  // First try the sidebar icons
  const sidebarIcons = document.querySelectorAll('.MuiDrawer-paper svg, .MuiDrawer-paper img');
  if (sidebarIcons.length > 0) {
    let clickableElement = sidebarIcons[0] as HTMLElement;
    while (
      clickableElement &&
      !clickableElement.classList.contains('MuiListItem-root') &&
      !clickableElement.classList.contains('MuiListItemButton-root') &&
      !clickableElement.onclick
    ) {
      clickableElement = clickableElement.parentElement as HTMLElement;
      if (!clickableElement) break;
    }

    if (clickableElement) {
      clickableElement.click();
      return true;
    }
  }

  // Try other selectors
  for (const selector of homeSelectors) {
    try {
      const element = document.querySelector(selector);
      if (element) {
        let clickable = element as HTMLElement;
        let attempts = 0;
        while (clickable && attempts < 5) {
          if (
            clickable.onclick ||
            clickable.tagName === 'BUTTON' ||
            clickable.tagName === 'A' ||
            clickable.classList.contains('MuiListItem-root') ||
            clickable.classList.contains('MuiListItemButton-root')
          ) {
            break;
          }
          clickable = clickable.parentElement as HTMLElement;
          attempts++;
        }

        if (clickable) {
          clickable.click();
          return true;
        }
      }
    } catch (error) {
      console.error(`Error with selector ${selector}:`, error);
    }
  }

  return false;
};

// Drawer and Logo Management
const checkDrawerCollapsed = (drawer: Element) => {
  const isCollapsed = drawer.clientWidth < 100;
  drawer.classList[isCollapsed ? 'add' : 'remove']('collapsed');
};

const setupDrawerCollapseDetection = (drawer: Element) => {
  checkDrawerCollapsed(drawer);

  const resizeObserver = new ResizeObserver(() => checkDrawerCollapsed(drawer));
  resizeObserver.observe(drawer);

  window.addEventListener('resize', () => checkDrawerCollapsed(drawer));
};

const injectDrawerLogos = (clusterUIPath = defaults.clusterUIPath) => {
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
      margin-top: 16px;
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
    return;
  }

  // Create container
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
  k8sLogoText.textContent = 'Cluster Overview';
  k8sLogoDiv.appendChild(k8sLogoText);

  k8sLogoDiv.addEventListener('click', navigateToClusterOverview);
  k8sLogoDiv.title = 'Go to Cluster Overview';
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

  homeLogoDiv.addEventListener('click', navigateToHomePage);
  homeLogoDiv.title = 'Go to Home';
  logoLayout.appendChild(homeLogoDiv);

  drawer.appendChild(logoContainer);
  setupDrawerCollapseDetection(drawer);

  return true;
};

// Initialize logos with retries
const initializeLogos = () => {
  // Immediate attempt
  if (addDrawerLogos()) return;

  // Watch for DOM changes
  const observer = new MutationObserver((mutations, obs) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length && document.querySelector('.MuiDrawer-paper')) {
        if (addDrawerLogos()) {
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

    if (addDrawerLogos()) {
      clearInterval(retryInterval);
    }

    attempts++;
  }, 1000);

  // Try when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!document.querySelector('.drawer-logo-container')) {
        addDrawerLogos();
      }
    });
  }
};

// Helper to add logos to drawer
const addDrawerLogos = () => {
  const config = store.get() || {};
  const drawer = document.querySelector('.MuiDrawer-paper');

  if (!drawer) return false;

  injectDrawerLogos(config.clusterUIPath || defaults.clusterUIPath);

  return true;
};

// Initialize logos and set up event listeners
initializeLogos();

window.addEventListener('load', () => {
  if (!document.querySelector('.drawer-logo-container')) {
    addDrawerLogos();
  }

  window.addEventListener('popstate', () => {
    if (!document.querySelector('.drawer-logo-container')) {
      addDrawerLogos();
    }
  });
});

// Observe route changes
const routeObserver = new MutationObserver(() => {
  if (
    !document.querySelector('.drawer-logo-container') &&
    document.querySelector('.MuiDrawer-paper')
  ) {
    addDrawerLogos();
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
  const [clusterUIPath, setClusterUIPath] = useState(
    config.clusterUIPath || defaults.clusterUIPath
  );

  // Ensure logos are present when settings opened
  useEffect(() => {
    if (!document.querySelector('.drawer-logo-container')) {
      addDrawerLogos();
    }
  }, []);

  const savePreferences = () => {
    const newConfig: ThemeOptions = {
      primaryColor,
      secondaryColor,
      font,
      logoURL,
      clusterUIPath,
    };

    store.set(newConfig);
    injectThemeStyle(newConfig);
    if (font) loadFont(font);
    if (logoURL) registerAppLogo(SimpleLogo);

    injectDrawerLogos(clusterUIPath);
  };

  const resetPreferences = () => {
    const resetConfig: ThemeOptions = {
      primaryColor: defaults.primary,
      secondaryColor: defaults.secondary,
      font: defaults.font,
      logoURL: defaults.logoURL,
      clusterUIPath: defaults.clusterUIPath,
    };

    // Update state
    setPrimaryColor(defaults.primary);
    setSecondaryColor(defaults.secondary);
    setFont(defaults.font);
    setLogoURL(defaults.logoURL);
    setClusterUIPath(defaults.clusterUIPath);

    // Apply changes
    store.set(resetConfig);
    injectThemeStyle(resetConfig);
    loadFont(defaults.font);
    registerAppLogo(SimpleLogo);

    injectDrawerLogos(defaults.clusterUIPath);
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
        label="EnBuild Logo URL"
        value={logoURL}
        onChange={e => setLogoURL(e.target.value)}
        fullWidth
        variant="outlined"
        margin="dense"
        InputLabelProps={{ shrink: true }}
        helperText="Enter a valid image URL for the EnBuild logo (PNG recommended)"
      />

      <TextField
        label="Cluster UI Path"
        value={clusterUIPath}
        onChange={e => setClusterUIPath(e.target.value)}
        fullWidth
        variant="outlined"
        margin="dense"
        InputLabelProps={{ shrink: true }}
        helperText="Path prefix for cluster UI pages (leave empty for direct cluster access or enter full URL)"
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
