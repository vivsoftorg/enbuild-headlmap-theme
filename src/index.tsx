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
const defaultClusterUIPath = ''; // Empty string for direct cluster access
const defaultSecondLogoURL = '';
const defaultSecondLogoText = 'Second Logo';
const defaultSecondLogoPath = '/';
const specificClusterName = 'k3d-headlamp'; // Default cluster name

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
  k8sLogoIsLink?: boolean; // New option: Is K8s logo a link?
  secondLogoIsLink?: boolean; // New option: Is second logo a link?
  secondLogoNavigatesHome?: boolean; // New option: Does second logo navigate to Home?
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

// Improved function to get the active cluster
const getActiveCluster = (): string | null => {
  // First try to get from URL - match patterns like /c/{clusterName}/... or /cluster/{clusterName}/...
  const pathMatch = window.location.pathname.match(/\/(?:c|cluster)\/([^\/]+)/);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1];
  }

  // Try to find active cluster in localStorage
  try {
    const storageKeys = Object.keys(localStorage);
    for (const key of storageKeys) {
      if (key.includes('active-cluster')) {
        try {
          const activeCluster = JSON.parse(localStorage.getItem(key) || '');
          if (activeCluster && typeof activeCluster === 'string') {
            return activeCluster;
          }
        } catch (e) {
          console.error('Error parsing active cluster from localStorage:', e);
        }
      }
    }
  } catch (e) {
    console.error('Error accessing localStorage:', e);
  }

  // Return the specific cluster name as fallback
  return specificClusterName;
};

// Function to navigate to cluster overview
const navigateToClusterOverview = () => {
  const activeCluster = getActiveCluster();
  console.log('Navigating to cluster overview for:', activeCluster);

  if (activeCluster) {
    // Try different navigation strategies:

    // 1. First check if we're already in a cluster context
    if (
      window.location.pathname.includes(`/c/${activeCluster}/`) ||
      window.location.pathname.includes(`/cluster/${activeCluster}/`)
    ) {
      // If already in cluster context, navigate to the cluster's overview page
      window.location.href = `/c/${activeCluster}/overview`;
      return;
    }

    // 2. Try to find and click the cluster card
    const clusterCardSelector = `[data-testid="cluster-card-${activeCluster}"]`;
    const clusterCard = document.querySelector(clusterCardSelector);
    if (clusterCard) {
      console.log('Found cluster card, clicking it');
      (clusterCard as HTMLElement).click();
      return;
    }

    // 3. Direct URL navigation to the cluster page
    console.log('Navigating directly to cluster URL');
    window.location.href = `/c/${activeCluster}`;
  } else {
    // Fallback to clusters page
    console.log('No active cluster found, going to clusters page');
    window.location.href = '/clusters';
  }
};

// Function to check if drawer is collapsed and update classes
const checkDrawerCollapsed = (drawer: Element): void => {
  // Check width to determine if collapsed
  // Typically, collapsed drawer is around 60px wide
  const isCollapsed = drawer.clientWidth < 100;

  if (isCollapsed) {
    drawer.classList.add('collapsed');
  } else {
    drawer.classList.remove('collapsed');
  }
};

// Function to detect drawer collapse state and update CSS classes
const setupDrawerCollapseDetection = (drawer: Element): void => {
  // Initial check
  checkDrawerCollapsed(drawer);

  // Set up resize observer
  const resizeObserver = new ResizeObserver(() => {
    checkDrawerCollapsed(drawer);
  });

  resizeObserver.observe(drawer);

  // Also check on window resize
  window.addEventListener('resize', () => {
    checkDrawerCollapsed(drawer);
  });
};

// UPDATED: Function to inject logo styles and create the drawer logos
const injectDrawerLogos = (
  k8sLogoURL: string = defaultK8sLogoURL,
  clusterUIPath: string = defaultClusterUIPath,
  secondLogoURL: string = defaultSecondLogoURL,
  secondLogoText: string = defaultSecondLogoText,
  secondLogoPath: string = defaultSecondLogoPath,
  k8sLogoIsLink: boolean = false, // Default: false
  secondLogoIsLink: boolean = false // Default: false
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
    .logo-layout {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      width: 100%;
      transition: flex-direction 0.3s ease;
    }
    /* When drawer is collapsed, stack logos vertically */
    .MuiDrawer-paper.collapsed .logo-layout {
      flex-direction: column;
    }
    /* When drawer is expanded, show logos horizontally */
    .MuiDrawer-paper:not(.collapsed) .logo-layout {
      flex-direction: row;
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
    /* Hide text when drawer is collapsed */
    .MuiDrawer-paper.collapsed .logo-text {
      display: none;
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
  const drawer = document.querySelector('.MuiDrawer-paper');

  if (drawer) {
    // Create a container for all logos
    const logoContainer = document.createElement('div');
    logoContainer.className = 'drawer-logo-container';
    logoContainer.setAttribute('data-logo-container', 'true');

    // Create a layout container for the logos
    const logoLayout = document.createElement('div');
    logoLayout.className = 'logo-layout';
    logoContainer.appendChild(logoLayout);

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

    // Navigation logic for cluster overview
    k8sLogoDiv.addEventListener('click', () => {
      if (k8sLogoIsLink) {
        // Open in a new tab if it's a link
        window.open(clusterUIPath, '_blank');
      } else {
        // Navigate to the cluster overview
        navigateToClusterOverview();
      }
    });

    k8sLogoDiv.title = 'Go to Cluster Overview';
    logoLayout.appendChild(k8sLogoDiv);

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

      // Navigate to home when second logo is clicked
      secondLogoDiv.addEventListener('click', navigateToHomePage);

      secondLogoDiv.title = `Go to ${secondLogoText} (Home)`;
      logoLayout.appendChild(secondLogoDiv);
    }

    // Append to drawer - after the last list item
    drawer.appendChild(logoContainer);

    // Set up mutation observer to detect drawer collapse/expand
    setupDrawerCollapseDetection(drawer);

    console.log('Logos added to drawer with responsive layout');
  } else {
    console.error('Drawer element not found');
  }
};

// Updated navigateToHomePage function to specifically target the home icon seen in the screenshot
const navigateToHomePage = () => {
  console.log('Attempting to find and click the home icon');

  // Based on the screenshot, find the home icon specifically
  // First priority: Try to find by position in the sidebar (appears to be the first/top icon)
  const sidebarIcons = document.querySelectorAll('.MuiDrawer-paper svg, .MuiDrawer-paper img');

  // Try the first icon in the sidebar (likely the home icon based on screenshot)
  if (sidebarIcons.length > 0) {
    const firstIcon = sidebarIcons[0];
    console.log('Found first icon in sidebar, attempting to click its container');

    // Navigate up to find the clickable container
    let clickableElement = firstIcon as HTMLElement;
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
      console.log('Clicked the presumed home icon container');
      return true;
    }
  }

  // Second try: Look specifically for a house/home shaped icon
  // This uses more specific attribute and element targeting based on the screenshot
  const homeIconSelectors = [
    // Target the specific home icon element - using its position in the DOM
    '.MuiDrawer-paper > div:first-child svg',
    '.MuiDrawer-paper > ul > li:first-child',
    '.MuiDrawer-paper button:first-of-type',

    // Try finding by the house/home icon shape
    'svg[viewBox="0 0 24 24"]:has(path[d*="m3 9 9-7 9 7"])',
    'svg:has(path[d*="home"])',
    'svg:has(path[d*="house"])',

    // Try finding by the element's location in viewport (top of sidebar)
    '.MuiDrawer-paper > *:first-child',

    // CSS selector for elements that visually look like a house icon - specifically for this app
    'div[style*="house.svg"]',
    'img[src*="house"], img[src*="home"]',
    'svg path[d*="M12"]',
  ];

  for (const selector of homeIconSelectors) {
    try {
      const potentialHomeIcon = document.querySelector(selector);
      if (potentialHomeIcon) {
        console.log(`Found potential home icon with selector: ${selector}`);

        // Find clickable parent
        let clickable = potentialHomeIcon as HTMLElement;
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
          console.log('Clicking the home icon container');
          clickable.click();
          return true;
        }
      }
    } catch (error) {
      console.error(`Error with selector ${selector}:`, error);
    }
  }

  // Last resort - brute force approach: click on any element that might be the home icon
  // based on its visual appearance or position in the DOM
  console.log('Attempting brute force approach to find home icon');

  // Get all SVGs in the sidebar
  const allSidebarSVGs = document.querySelectorAll('.MuiDrawer-paper svg');
  for (let i = 0; i < allSidebarSVGs.length; i++) {
    const svg = allSidebarSVGs[i] as SVGSVGElement;

    // Check if this SVG is at the top of the sidebar (likely the home icon)
    const rect = svg.getBoundingClientRect();
    if (rect.top < window.innerHeight / 3) {
      // In the top third of the viewport
      console.log('Found an SVG near the top of the sidebar, trying to click it');

      // Find the clickable parent
      let clickableParent = svg.parentElement;
      while (
        clickableParent &&
        !clickableParent.classList.contains('MuiListItem-root') &&
        !clickableParent.onclick
      ) {
        clickableParent = clickableParent.parentElement;
        if (!clickableParent) break;
      }

      if (clickableParent) {
        console.log('Clicking a potential home icon');
        (clickableParent as HTMLElement).click();
        return true;
      } else {
        // Try clicking the SVG itself
        try {
          (svg as any).click();
          console.log('Clicked the SVG directly');
          return true;
        } catch (e) {
          console.error('Could not click the SVG:', e);
        }
      }
    }
  }

  console.log('Failed to find and click the home icon');
  return false;
};

// Function to facilitate navigation to home page
const setupHomeNavigation = () => {
  // If there's a "Second Logo" that should navigate to home
  const secondLogoDiv = document.querySelector('.drawer-logo.second-logo');
  if (secondLogoDiv) {
    secondLogoDiv.addEventListener('click', navigateToHomePage);
    console.log('Set up second logo to navigate to home');
  }

  // For testing purposes
  console.log('Home navigation setup complete');
};

// Call the setup function whenever appropriate
// For example, add this to your addDrawerLogos function:
// setupHomeNavigation();

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
    config.secondLogoPath || defaultSecondLogoPath,
    config.k8sLogoIsLink, // Pass the new option
    config.secondLogoIsLink
  );
  return true;
};

// Improved logo loading with multiple retry strategies
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

  // Add navigation for navigation events using popstate
  window.addEventListener('popstate', () => {
    if (!document.querySelector('.drawer-logo-container')) {
      addDrawerLogos();
    }
  });
});

// Add a route change listener to ensure logos persist across route changes
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
  const [k8sLogoIsLink, setK8sLogoIsLink] = useState(config.k8sLogoIsLink || false); // New state
  const [secondLogoIsLink, setSecondLogoIsLink] = useState(config.secondLogoIsLink || false); // New state

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
      k8sLogoIsLink, // Save the new option
      secondLogoIsLink, // Save the new option
    };
    store.set(newConfig);
    injectThemeStyle(newConfig);
    if (font) loadFont(font);
    if (logoURL) registerAppLogo(SimpleLogo);
    injectDrawerLogos(
      k8sLogoURL,
      clusterUIPath,
      secondLogoURL,
      secondLogoText,
      secondLogoPath,
      newConfig.k8sLogoIsLink, // Pass it to injectDrawerLogos
      newConfig.secondLogoIsLink
    );
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
      k8sLogoIsLink: false, // Reset to default
      secondLogoIsLink: false, // Reset to default
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
    setK8sLogoIsLink(false);
    setSecondLogoIsLink(false);
    store.set(resetConfig);
    injectThemeStyle(resetConfig);
    loadFont(defaultFont);
    registerAppLogo(SimpleLogo);
    injectDrawerLogos(
      defaultK8sLogoURL,
      defaultClusterUIPath,
      defaultSecondLogoURL,
      defaultSecondLogoText,
      defaultSecondLogoPath,
      false, // Pass default values
      false
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
      <FormControl fullWidth margin="dense">
        <InputLabel id="k8s-logo-link-label">Kubernetes Logo is a Link</InputLabel>
        <Select
          labelId="k8s-logo-link-label"
          value={k8sLogoIsLink}
          onChange={e => setK8sLogoIsLink(e.target.value)}
          label="Kubernetes Logo is a Link"
        >
          <MenuItem value={false}>No</MenuItem>
          <MenuItem value={true}>Yes</MenuItem>
        </Select>
      </FormControl>

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
