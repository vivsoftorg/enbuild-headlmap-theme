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
import React, { useState, useEffect } from 'react';

const defaultPrimary = '#05A2C2';
const defaultSecondary = '#ffffff';
const defaultFont = 'Inter';
const defaultLogoURL = 'https://enbuild-docs.vivplatform.io/images/emma/enbuild-logo.png';
const defaultK8sLogoURL =
  'https://raw.githubusercontent.com/cncf/artwork/master/projects/kubernetes/icon/color/kubernetes-icon-color.png';
const defaultClusterUIPath = '/c';
const defaultSecondLogoURL = '';
const defaultSecondLogoText = 'Second Logo';
const defaultSecondLogoPath = '/';

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
  k8sLogoURL?: string;
  clusterUIPath?: string;
  secondLogoURL?: string;
  secondLogoText?: string;
  secondLogoPath?: string;
}

const loadFont = (fontName: string = defaultFont): void => {
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
  style.innerHTML = `
    body, * {
      font-family: "${fontName}", sans-serif !important;
    }
  `;
  document.head.appendChild(style);
};

const injectThemeStyle = ({
  primaryColor = defaultPrimary,
  secondaryColor = defaultSecondary,
}: ThemeOptions): void => {
  const style = document.createElement('style');
  style.id = 'custom-theme-style';

  style.innerHTML = `
    .MuiButton-contained {
      background-color: ${primaryColor} !important;
      color: ${secondaryColor} !important;
    }
    .MuiButton-contained:hover {
      background-color: ${primaryColor}cc !important;
    }
    .MuiDrawer-paper {
      background-color: ${primaryColor} !important;
    }
    .MuiDrawer-paper > .MuiListItem-root {
      color: ${secondaryColor} !important;
    }
    .MuiDrawer-paper > .MuiListItem-root .MuiListItemText-primary {
      color: ${secondaryColor} !important;
    }
    .MuiDrawer-paper > .MuiListItem-root:hover {
      background-color: ${secondaryColor} !important;
      color: ${primaryColor} !important;
    }
    .MuiDrawer-paper > .MuiListItem-root:hover .MuiListItemText-primary {
      color: ${primaryColor} !important;
    }
    .MuiDrawer-paper > .MuiListItem-root.Mui-selected {
      background-color: ${secondaryColor} !important;
      color: ${primaryColor} !important;
    }
    .MuiDrawer-paper > .MuiListItem-root.Mui-selected .MuiListItemText-primary {
      color: ${primaryColor} !important;
    }
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root {
      background-color: transparent !important;
      color: ${secondaryColor} !important;
      transition: color 0.3s, background-color 0.3s !important;
    }
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root:not(:hover) {
      background-color: transparent !important;
      color: ${secondaryColor} !important;
    }
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root:hover {
      background-color: ${secondaryColor} !important;
      color: ${primaryColor} !important;
    }
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root.Mui-selected {
      background-color: ${secondaryColor} !important;
      color: ${primaryColor} !important;
    }
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
    
    /* Updated Header Styling - More comprehensive selectors */
    .MuiAppBar-root {
      background-color: ${primaryColor} !important;
      color: ${secondaryColor} !important;
    }
    
    /* Target ALL text elements in the header */
    .MuiAppBar-root *,
    .MuiAppBar-root .MuiTypography-root,
    .MuiAppBar-root span,
    .MuiAppBar-root div,
    .MuiAppBar-root p,
    .MuiAppBar-root h1,
    .MuiAppBar-root h2,
    .MuiAppBar-root h3,
    .MuiAppBar-root h4,
    .MuiAppBar-root h5,
    .MuiAppBar-root h6 {
      color: ${secondaryColor} !important;
    }
    
    /* Specifically target search input text */
    .MuiAppBar-root input,
    .MuiAppBar-root .MuiInputBase-input {
      color: ${secondaryColor} !important;
    }
    
    /* Target search placeholder text */
    .MuiAppBar-root input::placeholder {
      color: ${secondaryColor}99 !important;
    }
    
    /* Target the greeting/"Hello" text */
    .MuiAppBar-root [class*="userMenu"],
    .MuiAppBar-root [class*="settings"],
    .MuiToolbar-root > div:last-child {
      color: ${secondaryColor} !important;
    }
    
    /* Ensure all icons in header use secondary color */
    .MuiAppBar-root .MuiSvgIcon-root,
    .MuiAppBar-root .MuiIcon-root,
    .MuiAppBar-root .MuiIconButton-root,
    .MuiAppBar-root button,
    .MuiAppBar-root a {
      color: ${secondaryColor} !important;
    }
    
    /* Header search field styling */
    .MuiAppBar-root .MuiInputBase-root {
      border-color: ${secondaryColor}99 !important;
    }
    
    /* Search icon in header */
    .MuiAppBar-root .MuiInputAdornment-root .MuiSvgIcon-root {
      color: ${secondaryColor} !important;
    }
    
    /* Any buttons in header */
    .MuiAppBar-root .MuiButton-root {
      color: ${secondaryColor} !important;
    }

    /* ADDED: Fix for search bar border/underline color */
    .MuiAppBar-root .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline,
    .MuiAppBar-root .MuiInput-underline:before,
    .MuiAppBar-root .MuiInput-underline:after,
    .MuiAppBar-root .MuiInput-underline:hover:not(.Mui-disabled):before,
    .MuiAppBar-root .MuiFilledInput-underline:before,
    .MuiAppBar-root .MuiFilledInput-underline:after {
      border-color: ${secondaryColor} !important;
    }
    
    /* ADDED: Style the search input field border directly */
    .MuiAppBar-root input[type="text"],
    .MuiAppBar-root input[type="search"] {
      border-color: ${secondaryColor} !important;
      caret-color: ${secondaryColor} !important;
    }
    
    /* ADDED: Target the searchbar specifically with more precise selectors */
    .MuiAppBar-root .MuiToolbar-root .MuiInputBase-root,
    .MuiAppBar-root .MuiToolbar-root input,
    .MuiAppBar-root .MuiToolbar-root .MuiFormControl-root,
    .MuiAppBar-root .MuiToolbar-root .MuiTextField-root {
      border-color: ${secondaryColor} !important;
    }
    
    /* ADDED: Handle border-bottom for non-outlined inputs */
    .MuiAppBar-root .MuiInput-root::before,
    .MuiAppBar-root .MuiInput-root::after {
      border-bottom-color: ${secondaryColor} !important;
    }
  `;

  document.getElementById('custom-theme-style')?.remove();
  document.head.appendChild(style);
};

// Function to inject logo styles and create the drawer logos
const injectDrawerLogos = (
  k8sLogoURL: string = defaultK8sLogoURL,
  clusterUIPath: string = defaultClusterUIPath,
  secondLogoURL: string = defaultSecondLogoURL,
  secondLogoText: string = defaultSecondLogoText,
  secondLogoPath: string = defaultSecondLogoPath
): void => {
  // Remove all previous logo containers completely
  const existingContainers = document.querySelectorAll('.drawer-logo-container');
  existingContainers.forEach(container => container.remove());

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
    .logo-row {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      width: 100%;
    }
    .drawer-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      flex: 1;
    }
    .drawer-logo img {
      width: 40px;
      height: 40px;
      object-fit: contain;
      background-color: white;
      border-radius: 4px;
      padding: 4px;
    }
    .drawer-logo .logo-text {
      margin-top: 8px;
      color: ${defaultSecondary};
      font-size: 12px;
      text-align: center;
    }
    .drawer-logo:hover {
      opacity: 0.8;
      transition: all 0.2s ease;
    }
    .drawer-logo:hover img {
      transform: scale(1.05);
      box-shadow: 0 0 5px rgba(255,255,255,0.3);
    }
  `;
  document.head.appendChild(style);

  // Create the logo elements and append them to the drawer
  // Find the drawer
  const drawer = document.querySelector('.MuiDrawer-paper');

  if (drawer) {
    // Create a container for all logos
    const logoContainer = document.createElement('div');
    logoContainer.className = 'drawer-logo-container';
    logoContainer.setAttribute('data-logo-container', 'true'); // Add data attribute for easier identification

    // Create a row for the logos
    const logoRow = document.createElement('div');
    logoRow.className = 'logo-row';
    logoContainer.appendChild(logoRow);

    // Create the Kubernetes logo
    const k8sLogoDiv = document.createElement('div');
    k8sLogoDiv.className = 'drawer-logo kubernetes-logo';

    const k8sLogoImg = document.createElement('img');
    k8sLogoImg.src = k8sLogoURL;
    k8sLogoImg.alt = 'Kubernetes';
    k8sLogoDiv.appendChild(k8sLogoImg);

    const k8sLogoText = document.createElement('div');
    k8sLogoText.className = 'logo-text';
    k8sLogoText.textContent = 'Cluster Overview';
    k8sLogoDiv.appendChild(k8sLogoText);

    k8sLogoDiv.addEventListener('click', () => {
      window.location.href = clusterUIPath;
    });

    k8sLogoDiv.title = 'Go to Cluster Overview';
    logoRow.appendChild(k8sLogoDiv);

    // Create the second logo if URL is provided
    if (secondLogoURL) {
      const secondLogoDiv = document.createElement('div');
      secondLogoDiv.className = 'drawer-logo second-logo';

      const secondLogoImg = document.createElement('img');
      secondLogoImg.src = secondLogoURL;
      secondLogoImg.alt = secondLogoText;
      secondLogoDiv.appendChild(secondLogoImg);

      const secondLogoTextDiv = document.createElement('div');
      secondLogoTextDiv.className = 'logo-text';
      secondLogoTextDiv.textContent = secondLogoText;
      secondLogoDiv.appendChild(secondLogoTextDiv);

      secondLogoDiv.addEventListener('click', () => {
        window.location.href = secondLogoPath;
      });

      secondLogoDiv.title = `Go to ${secondLogoText}`;
      logoRow.appendChild(secondLogoDiv);
    }

    // Append to drawer - after the last list item
    drawer.appendChild(logoContainer);

    console.log('Logos added to drawer:', logoContainer);
  } else {
    console.error('Drawer element not found');
  }
};

const store = new ConfigStore<ThemeOptions>('enbuild-customiser-theme');

// Apply initial theme settings
const initialConfig = store.get() || {};
injectThemeStyle(initialConfig);
if (initialConfig.font) loadFont(initialConfig.font);
if (initialConfig.logoURL) registerAppLogo(SimpleLogo);

// Function to add logos to drawer
const addDrawerLogos = () => {
  const config = store.get() || {};

  // Get drawer element
  const drawerPaper = document.querySelector('.MuiDrawer-paper');
  if (!drawerPaper) {
    console.log('Drawer not found yet, will retry');
    return false;
  }

  injectDrawerLogos(
    config.k8sLogoURL || defaultK8sLogoURL,
    config.clusterUIPath || defaultClusterUIPath,
    config.secondLogoURL || defaultSecondLogoURL,
    config.secondLogoText || defaultSecondLogoText,
    config.secondLogoPath || defaultSecondLogoPath
  );
  return true;
};

// Improved logo loading with multiple retry strategies
// This ensures logos are added immediately when the app loads
const initializeLogos = () => {
  // First try - immediate attempt
  const immediate = addDrawerLogos();

  if (immediate) {
    console.log('Logos added immediately');
    return;
  }

  // Set up a mutation observer to detect when the drawer is added to the DOM
  const observer = new MutationObserver((mutations, obs) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        const drawerPaper = document.querySelector('.MuiDrawer-paper');
        if (drawerPaper) {
          const success = addDrawerLogos();
          if (success) {
            console.log('Logos added via mutation observer');
            obs.disconnect();
            return;
          }
        }
      }
    }
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });

  // Fallback: Set up interval-based retries with exponential backoff
  let attempts = 0;
  const maxAttempts = 15;
  const retryInterval = setInterval(() => {
    if (document.querySelector('.drawer-logo-container')) {
      clearInterval(retryInterval);
      return;
    }

    if (attempts >= maxAttempts) {
      console.log('Maximum attempts reached, stopping logo insertion attempts');
      clearInterval(retryInterval);
      return;
    }

    const result = addDrawerLogos();
    if (result) {
      console.log('Logos successfully added on attempt', attempts + 1);
      clearInterval(retryInterval);
    }

    attempts++;
  }, 1000);

  // Also try when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!document.querySelector('.drawer-logo-container')) {
        addDrawerLogos();
      }
    });
  }
};

// Initialize logos as soon as possible
initializeLogos();

// Also initialize on window load to catch any late rendering
window.addEventListener('load', () => {
  if (!document.querySelector('.drawer-logo-container')) {
    addDrawerLogos();
  }
});

// Add a route change listener to ensure logos persist across route changes
// This uses a MutationObserver to detect DOM changes that might indicate navigation
const routeObserver = new MutationObserver(mutations => {
  // Check if we should add logos
  const shouldAddLogos =
    !document.querySelector('.drawer-logo-container') && document.querySelector('.MuiDrawer-paper');

  if (shouldAddLogos) {
    addDrawerLogos();
  }
});

// Start route observer
routeObserver.observe(document.body, { childList: true, subtree: true });

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
        // Add these styles to position the logo
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

const ThemeCustomizer = () => {
  const config = store.get() || {};
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor || defaultPrimary);
  const [secondaryColor, setSecondaryColor] = useState(config.secondaryColor || defaultSecondary);
  const [font, setFont] = useState(config.font || defaultFont);
  const [logoURL, setLogoURL] = useState(config.logoURL || defaultLogoURL);
  const [k8sLogoURL, setK8sLogoURL] = useState(config.k8sLogoURL || defaultK8sLogoURL);
  const [clusterUIPath, setClusterUIPath] = useState(config.clusterUIPath || defaultClusterUIPath);
  const [secondLogoURL, setSecondLogoURL] = useState(config.secondLogoURL || defaultSecondLogoURL);
  const [secondLogoText, setSecondLogoText] = useState(
    config.secondLogoText || defaultSecondLogoText
  );
  const [secondLogoPath, setSecondLogoPath] = useState(
    config.secondLogoPath || defaultSecondLogoPath
  );

  // Apply logos on component mount
  useEffect(() => {
    // Ensure logos are present when the settings component is opened
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
      k8sLogoURL,
      clusterUIPath,
      secondLogoURL,
      secondLogoText,
      secondLogoPath,
    };
    store.set(newConfig);
    injectThemeStyle(newConfig);
    if (font) loadFont(font);
    if (logoURL) registerAppLogo(SimpleLogo);
    injectDrawerLogos(k8sLogoURL, clusterUIPath, secondLogoURL, secondLogoText, secondLogoPath);
  };

  const resetPreferences = () => {
    const resetConfig: ThemeOptions = {
      primaryColor: defaultPrimary,
      secondaryColor: defaultSecondary,
      font: defaultFont,
      logoURL: defaultLogoURL,
      k8sLogoURL: defaultK8sLogoURL,
      clusterUIPath: defaultClusterUIPath,
      secondLogoURL: defaultSecondLogoURL,
      secondLogoText: defaultSecondLogoText,
      secondLogoPath: defaultSecondLogoPath,
    };
    setPrimaryColor(defaultPrimary);
    setSecondaryColor(defaultSecondary);
    setFont(defaultFont);
    setLogoURL(defaultLogoURL);
    setK8sLogoURL(defaultK8sLogoURL);
    setClusterUIPath(defaultClusterUIPath);
    setSecondLogoURL(defaultSecondLogoURL);
    setSecondLogoText(defaultSecondLogoText);
    setSecondLogoPath(defaultSecondLogoPath);
    store.set(resetConfig);
    injectThemeStyle(resetConfig);
    loadFont(defaultFont);
    registerAppLogo(SimpleLogo);
    injectDrawerLogos(
      defaultK8sLogoURL,
      defaultClusterUIPath,
      defaultSecondLogoURL,
      defaultSecondLogoText,
      defaultSecondLogoPath
    );
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
        onChange={e => setPrimaryColor(e.target.value || defaultPrimary)}
        fullWidth
        variant="outlined"
        margin="dense"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        type="color"
        label="Secondary Color (Text/Icon in Header & Drawer)"
        value={secondaryColor}
        onChange={e => setSecondaryColor(e.target.value || defaultSecondary)}
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
          onChange={e => setFont(e.target.value || defaultFont)}
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
        label="Kubernetes Logo URL"
        value={k8sLogoURL}
        onChange={e => setK8sLogoURL(e.target.value)}
        fullWidth
        variant="outlined"
        margin="dense"
        InputLabelProps={{ shrink: true }}
        helperText="Enter a valid image URL for the Kubernetes logo (PNG recommended)"
      />

      <TextField
        label="Cluster UI Path"
        value={clusterUIPath}
        onChange={e => setClusterUIPath(e.target.value)}
        fullWidth
        variant="outlined"
        margin="dense"
        InputLabelProps={{ shrink: true }}
        helperText="Enter the path to navigate to when clicking the Kubernetes logo"
      />

      <Typography variant="subtitle1" mt={3} mb={1}>
        Second Logo Settings
      </Typography>

      <TextField
        label="Second Logo URL"
        value={secondLogoURL}
        onChange={e => setSecondLogoURL(e.target.value)}
        fullWidth
        variant="outlined"
        margin="dense"
        InputLabelProps={{ shrink: true }}
        helperText="Enter a valid image URL for the second logo (PNG recommended)"
      />

      <TextField
        label="Second Logo Text"
        value={secondLogoText}
        onChange={e => setSecondLogoText(e.target.value)}
        fullWidth
        variant="outlined"
        margin="dense"
        InputLabelProps={{ shrink: true }}
        helperText="The text to display below the second logo"
      />

      <TextField
        label="Second Logo Path"
        value={secondLogoPath}
        onChange={e => setSecondLogoPath(e.target.value)}
        fullWidth
        variant="outlined"
        margin="dense"
        InputLabelProps={{ shrink: true }}
        helperText="Enter the path to navigate to when clicking the second logo"
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
