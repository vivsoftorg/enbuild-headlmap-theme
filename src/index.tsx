// Enhanced menu management for EnBuild UI
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

// Config & Types
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

const store = new ConfigStore('enbuild-customiser-theme');

const k8sMenuItems = [
  { text: 'Overview', path: '/overview', icon: <LayoutDashboard size={20} /> },
  { text: 'Pipelines', path: '/pipelines', icon: <LayoutList size={20} /> },
  { text: 'Marketplace', path: '/marketplace', icon: <Store size={20} /> },
  { text: 'Components', path: '/components', icon: <Cpu size={20} /> },
  { text: 'Deployment Flows', path: '/deployment-flows', icon: <GitBranchPlus size={20} /> },
  { text: 'Configuration', path: '/configuration', icon: <Settings size={20} /> },
];

// Helper Functions
const loadFont = (fontName = defaults.font) => {
  const formattedFont = fontName.replace(/ /g, '+');
  ['custom-font-loader', 'custom-font-style'].forEach(id => document.getElementById(id)?.remove());

  if (!['Times New Roman', 'Arial', 'Courier New', 'Georgia'].includes(fontName)) {
    const link = document.createElement('link');
    Object.assign(link, {
      id: 'custom-font-loader',
      rel: 'stylesheet',
      href: `https://fonts.googleapis.com/css2?family=${formattedFont}&display=swap`,
    });
    document.head.appendChild(link);
  }

  const style = document.createElement('style');
  style.id = 'custom-font-style';
  style.innerHTML = `body, * { font-family: "${fontName}", sans-serif !important; }`;
  document.head.appendChild(style);
};

const injectThemeStyle = options => {
  const { primaryColor = defaults.primary, secondaryColor = defaults.secondary } = options;
  document.getElementById('custom-theme-style')?.remove();

  const style = document.createElement('style');
  style.id = 'custom-theme-style';
  style.innerHTML = `
    /* Button Styles */
    .MuiButton-contained { 
      background-color: ${primaryColor} !important; 
      color: ${secondaryColor} !important; 
    }
    .MuiButton-contained:hover { 
      background-color: ${primaryColor}cc !important; 
    }

    /* Drawer Base Styles */
    .MuiDrawer-paper { 
      background-color: ${primaryColor} !important; 
    }

    /* All List Items - Base Text Color */
    .MuiDrawer-paper .MuiListItem-root,
    .MuiDrawer-paper .MuiListItemButton-root,
    .MuiDrawer-paper .MuiListItemText-primary {
      color: ${secondaryColor} !important;
    }

    /* All List Item Icons - Base Color */
    .MuiDrawer-paper .MuiListItemIcon,
    .MuiDrawer-paper .MuiSvgIcon-root,
    .MuiDrawer-paper .menu-item-icon svg {
      color: ${secondaryColor} !important;
    }

    /* MAIN MENU ITEMS ONLY - Background on Hover/Selected */
    .MuiDrawer-paper > .MuiList-root > .MuiListItem-root:hover,
    .MuiDrawer-paper > .MuiList-root > .MuiListItem-root.Mui-selected,
    .MuiDrawer-paper > .MuiList-root > .MuiListItemButton-root:hover,
    .MuiDrawer-paper > .MuiList-root > .MuiListItemButton-root.Mui-selected {
      background-color: ${secondaryColor} !important;
    }

    /* MAIN MENU - Text/Icon Color on Hover/Selected */
    .MuiDrawer-paper > .MuiList-root > .MuiListItem-root:hover .MuiListItemText-primary,
    .MuiDrawer-paper > .MuiList-root > .MuiListItem-root.Mui-selected .MuiListItemText-primary,
    .MuiDrawer-paper > .MuiList-root > .MuiListItemButton-root:hover .MuiListItemText-primary,
    .MuiDrawer-paper > .MuiList-root > .MuiListItemButton-root.Mui-selected .MuiListItemText-primary,
    .MuiDrawer-paper > .MuiList-root > .MuiListItem-root:hover .MuiListItemIcon,
    .MuiDrawer-paper > .MuiList-root > .MuiListItem-root.Mui-selected .MuiListItemIcon,
    .MuiDrawer-paper > .MuiList-root > .MuiListItemButton-root:hover .MuiListItemIcon,
    .MuiDrawer-paper > .MuiList-root > .MuiListItemButton-root.Mui-selected .MuiListItemIcon,
    .MuiDrawer-paper > .MuiList-root > .MuiListItem-root:hover .MuiSvgIcon-root,
    .MuiDrawer-paper > .MuiList-root > .MuiListItem-root.Mui-selected .MuiSvgIcon-root,
    .MuiDrawer-paper > .MuiList-root > .MuiListItemButton-root:hover .MuiSvgIcon-root,
    .MuiDrawer-paper > .MuiList-root > .MuiListItemButton-root.Mui-selected .MuiSvgIcon-root,
    .MuiDrawer-paper > .MuiList-root > .MuiListItem-root:hover .menu-item-icon svg,
    .MuiDrawer-paper > .MuiList-root > .MuiListItem-root.Mui-selected .menu-item-icon svg,
    .MuiDrawer-paper > .MuiList-root > .MuiListItemButton-root:hover .menu-item-icon svg,
    .MuiDrawer-paper > .MuiList-root > .MuiListItemButton-root.Mui-selected .menu-item-icon svg {
      color: ${primaryColor} !important;
    }

    /* SUBMENU ITEMS - Universal selector to override all possible submenu elements */
    .MuiDrawer-paper .MuiCollapse-root *,
    .MuiDrawer-paper .MuiList-root .MuiList-root *,
    .MuiDrawer-paper [class*="indent"] *,
    .MuiDrawer-paper [style*="padding-left: 32px"],
    .MuiDrawer-paper [style*="padding-left: 48px"],
    .MuiDrawer-paper [style*="padding-left: 64px"],
    .MuiDrawer-paper .MuiCollapse-root .MuiListItem-root,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItem-root,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItemButton-root {
      background-color: transparent !important;
      background: none !important;
    }

    /* SUBMENU ITEMS - Hover/Selected Background with Secondary Color */
    .MuiDrawer-paper .MuiCollapse-root .MuiListItem-root:hover,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root:hover,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItem-root.Mui-selected,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root.Mui-selected,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItem-root:hover,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItemButton-root:hover,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItem-root.Mui-selected,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItemButton-root.Mui-selected,
    .MuiDrawer-paper [style*="padding-left: 32px"]:hover,
    .MuiDrawer-paper [style*="padding-left: 48px"]:hover,
    .MuiDrawer-paper [style*="padding-left: 64px"]:hover {
      background-color: ${secondaryColor} !important;
      background: ${secondaryColor} !important;
    }

    /* SUBMENU ITEMS - Text/Icon Color Change on Hover/Selected */
    .MuiDrawer-paper .MuiCollapse-root .MuiListItem-root:hover .MuiListItemText-primary,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root:hover .MuiListItemText-primary,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItem-root.Mui-selected .MuiListItemText-primary,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root.Mui-selected .MuiListItemText-primary,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItem-root:hover .MuiListItemText-primary,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItemButton-root:hover .MuiListItemText-primary,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItem-root.Mui-selected .MuiListItemText-primary,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItemButton-root.Mui-selected .MuiListItemText-primary,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItem-root:hover .MuiListItemIcon,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root:hover .MuiListItemIcon,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItem-root.Mui-selected .MuiListItemIcon,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root.Mui-selected .MuiListItemIcon,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItem-root:hover .MuiListItemIcon,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItemButton-root:hover .MuiListItemIcon,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItem-root.Mui-selected .MuiListItemIcon,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItemButton-root.Mui-selected .MuiListItemIcon,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItem-root:hover .MuiSvgIcon-root,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root:hover .MuiSvgIcon-root,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItem-root.Mui-selected .MuiSvgIcon-root,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root.Mui-selected .MuiSvgIcon-root,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItem-root:hover .MuiSvgIcon-root,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItemButton-root:hover .MuiSvgIcon-root,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItem-root.Mui-selected .MuiSvgIcon-root,
    .MuiDrawer-paper .MuiList-root .MuiList-root .MuiListItemButton-root.Mui-selected .MuiSvgIcon-root {
      color: ${primaryColor} !important;
    }

    /* AppBar Styles */
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

    /* Custom Menu List Styles */
    .custom-menu-list { 
      width: 100%; 
      padding: 8px 0 !important; 
      margin-top: 60px; 
    }
    .custom-menu-list .MuiListItem-root { 
      padding: 8px 16px; 
      cursor: pointer; 
      border-radius: 4px; 
      margin: 2px 8px; 
      transition: background-color 0.3s ease; 
    }

    /* Drawer Logo Container */
    .drawer-logo-container { 
      position: sticky !important; 
      bottom: 0 !important; 
      background-color: ${primaryColor} !important; 
      border-top: 1px solid ${secondaryColor}33 !important; 
      width: 100%; 
      padding: 16px; 
      margin-top: auto; 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      z-index: 1200; 
    }

    /* Menu Visibility Controls */
    .MuiDrawer-paper.custom-menu-active .default-nav-item { 
      display: none !important; 
    }
    .MuiDrawer-paper.exclusive-menu-mode .default-nav-item, 
    .MuiDrawer-paper.exclusive-menu-mode > *:not(.custom-menu-list):not(.drawer-logo-container) { 
      display: none !important; 
    }

    /* Logo Layout */
    .logo-layout { 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      gap: 16px; 
      width: 100%; 
      transition: flex-direction 0.3s ease; 
    }
    .MuiDrawer-paper.collapsed .logo-layout { 
      flex-direction: column; 
    }
    .MuiDrawer-paper:not(.collapsed) .logo-layout { 
      flex-direction: row; 
    }

    /* Drawer Logo Styles */
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
      color: ${primaryColor} !important; 
    }
    .drawer-logo .logo-text { 
      margin-top: 8px; 
      color: ${secondaryColor}; 
      font-size: 12px; 
      text-align: center; 
    }
    .MuiDrawer-paper.collapsed .logo-text { 
      display: none; 
    }
    .drawer-logo:hover { 
      opacity: 0.8; 
      transition: all 0.2s ease; 
    }
    .drawer-logo:hover .mui-icon { 
      transform: scale(1.05); 
      box-shadow: 0 0 5px rgba(255,255,255,0.3); 
    }
    .drawer-logo.active .mui-icon { 
      box-shadow: 0 0 8px rgba(255,255,255,0.5); 
      border: 2px solid ${secondaryColor}; 
    }
    .menu-item-icon { 
      display: flex; 
      align-items: center; 
      margin-right: 12px; 
      color: ${secondaryColor}; 
    }
  `;
  document.head.appendChild(style);
};

// App Manager
const appManager = (() => {
  let activeMenuType = 'default';
  let exclusiveMode = false;
  let currentOverviewContainer = null;
  let originalContent = null;

  const cleanupOverviewPage = () => {
    if (currentOverviewContainer && originalContent) {
      // Restore original content
      const contentContainer = findContentContainer();
      if (contentContainer) {
        contentContainer.innerHTML = '';
        contentContainer.appendChild(originalContent);
      }
      currentOverviewContainer = null;
      originalContent = null;
    }
  };

  const findContentContainer = () => {
    // Find the main content container more reliably
    return (
      document.querySelector('main[role="main"]') ||
      document.querySelector('#content-container') ||
      document.querySelector('[data-testid="main-content"]') ||
      document.querySelector('.MuiContainer-root') ||
      document.querySelector('#root > div > div:last-child') ||
      document.querySelector('main') ||
      document.body.querySelector('div[class*="content"]')
    );
  };

  const renderOverviewPage = () => {
    setTimeout(() => {
      const container = findContentContainer();

      if (!container) {
        console.error('Could not find content container for overview page');
        return;
      }

      // Store original content only if we haven't already
      if (!originalContent) {
        originalContent = container.cloneNode(true);
      }

      // Clear container and create overview wrapper
      container.innerHTML = '';

      const overviewDiv = document.createElement('div');
      Object.assign(overviewDiv, {
        id: 'overview-page',
        style: `
          width: 100%; 
          height: 100%; 
          min-height: 100vh;
          background-color: #f8f9fa; 
          overflow-y: auto;
          padding: 0;
          margin: 0;
        `,
      });

      currentOverviewContainer = overviewDiv;
      container.appendChild(overviewDiv);

      // Render the overview component
      ReactDOM.render(<OverviewDemo />, overviewDiv);
    }, 100);
  };

  const navigateTo = path => {
    // Don't navigate if already on the same path
    if (window.location.pathname === path) return;

    // Use proper browser navigation
    if (path === '/overview') {
      window.history.pushState({ page: 'overview' }, 'Overview', path);
      renderOverviewPage();
    } else {
      // For other paths, clean up overview and let default routing handle it
      cleanupOverviewPage();
      window.history.pushState({ page: 'default' }, '', path);

      // Trigger navigation event for other parts of the app
      window.dispatchEvent(new CustomEvent('app-navigation', { detail: { path } }));

      // For dashboard, ensure we're showing default content
      if (path === '/dashboard') {
        // Force a page refresh to ensure clean state
        setTimeout(() => {
          if (window.location.pathname === '/dashboard') {
            window.location.reload();
          }
        }, 100);
      }
    }

    // Dispatch popstate for other listeners
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const createMenuList = (items, drawer) => {
    drawer.querySelector('.custom-menu-list')?.remove();
    const menuList = document.createElement('ul');
    menuList.className = 'MuiList-root custom-menu-list';

    items.forEach(item => {
      const listItem = document.createElement('li');
      Object.assign(listItem, {
        className: `MuiListItem-root ${
          window.location.pathname === item.path ? 'Mui-selected' : ''
        }`,
        style: 'display: flex; align-items: center;',
      });

      if (item.icon) {
        const iconElement = document.createElement('span');
        iconElement.className = 'menu-item-icon';
        ReactDOM.render(item.icon, iconElement);
        listItem.appendChild(iconElement);
      }

      const textDiv = document.createElement('div');
      textDiv.className = 'MuiListItemText-root';
      textDiv.innerHTML = `<span class="MuiListItemText-primary">${item.text}</span>`;
      listItem.appendChild(textDiv);

      listItem.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        // Update menu selection
        drawer
          .querySelectorAll('.custom-menu-list .MuiListItem-root')
          .forEach(li => li.classList.remove('Mui-selected'));
        listItem.classList.add('Mui-selected');

        // Navigate to the path
        navigateTo(item.path);
      });
      menuList.appendChild(listItem);
    });
    drawer.insertBefore(menuList, drawer.firstChild);
  };

  const createLogoElement = (className, iconPath, text, title, onClick) => {
    const logoDiv = document.createElement('div');
    Object.assign(logoDiv, {
      className: `drawer-logo ${className}`,
      title,
      innerHTML: `
        <div class="mui-icon">
          <svg viewBox="0 0 24 24" width="32" height="32">
            <path d="${iconPath}" fill="${defaults.primary}"/>
          </svg>
        </div>
        <div class="logo-text">${text}</div>
      `,
    });
    logoDiv.addEventListener('click', onClick);
    return logoDiv;
  };

  const setupDrawer = drawer => {
    drawer.querySelectorAll('.MuiListItem-root:not(.custom-menu-item)').forEach(item => {
      if (!item.classList.contains('custom-menu-item') && !item.classList.contains('drawer-logo')) {
        item.classList.add('default-nav-item');
      }
    });

    const checkCollapsed = () =>
      drawer.classList[drawer.clientWidth < 100 ? 'add' : 'remove']('collapsed');
    checkCollapsed();
    new ResizeObserver(checkCollapsed).observe(drawer);

    if (
      !drawer.classList.contains('custom-menu-active') &&
      !drawer.classList.contains('exclusive-menu-mode')
    ) {
      showDefaultMenu(drawer);
    }
  };

  const showDefaultMenu = drawer => {
    if (!drawer) return;
    activeMenuType = 'default';
    exclusiveMode = false;
    drawer.classList.remove('custom-menu-active', 'exclusive-menu-mode');
    drawer.querySelector('.custom-menu-list')?.remove();
    cleanupOverviewPage();
    document
      .querySelectorAll('.new-ui-logo, .kubernetes-logo')
      .forEach(el => el.classList.remove('active'));
  };

  const toggleK8sMenu = drawer => {
    if (!drawer) return;
    const isK8sActive = activeMenuType === 'k8s';
    activeMenuType = isK8sActive ? 'default' : 'k8s';
    exclusiveMode = false;
    drawer.classList.remove('exclusive-menu-mode');

    if (isK8sActive) {
      drawer.classList.remove('custom-menu-active');
      drawer.querySelector('.custom-menu-list')?.remove();
      cleanupOverviewPage();
    } else {
      drawer.classList.add('custom-menu-active');
      createMenuList(k8sMenuItems, drawer);
    }
    document.querySelector('.kubernetes-logo')?.classList[isK8sActive ? 'remove' : 'add']('active');
    document.querySelector('.new-ui-logo')?.classList.remove('active');
  };

  const activateExclusiveNewUI = drawer => {
    if (!drawer) return;
    activeMenuType = 'k8s';
    exclusiveMode = true;
    drawer.classList.add('custom-menu-active', 'exclusive-menu-mode');
    createMenuList(k8sMenuItems, drawer);
    document.querySelector('.kubernetes-logo')?.classList.remove('active');
    document.querySelector('.new-ui-logo')?.classList.add('active');
  };

  const injectDrawerIcons = () => {
    document.querySelectorAll('.drawer-logo-container').forEach(c => c.remove());
    const drawer = document.querySelector('.MuiDrawer-paper');
    if (!drawer) return false;

    setupDrawer(drawer);

    const logoContainer = document.createElement('div');
    logoContainer.className = 'drawer-logo-container';
    const logoLayout = document.createElement('div');
    logoLayout.className = 'logo-layout';
    logoContainer.appendChild(logoLayout);

    logoLayout.append(
      createLogoElement(
        'new-ui-logo',
        'M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z',
        'Enbuild',
        'Show Only Custom UI',
        () => activateExclusiveNewUI(drawer)
      ),
      createLogoElement(
        'home-logo',
        'M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z',
        'Home',
        'Return to Default UI',
        () => {
          showDefaultMenu(drawer);
          navigateTo('/dashboard');
        }
      )
    );
    drawer.appendChild(logoContainer);

    (exclusiveMode
      ? document.querySelector('.new-ui-logo')
      : document.querySelector('.kubernetes-logo')
    )?.classList.add('active');
    return true;
  };

  const setupRouteListener = () => {
    // Handle browser back/forward navigation
    window.addEventListener('popstate', event => {
      const drawer = document.querySelector('.MuiDrawer-paper');
      if (!drawer) return;

      const currentPath = window.location.pathname;

      // Update menu selection based on current path
      drawer.querySelectorAll('.custom-menu-list .MuiListItem-root').forEach(item => {
        const textElement = item.querySelector('.MuiListItemText-primary');
        if (!textElement) return;

        const menuItem = k8sMenuItems.find(mi => mi.text === textElement.textContent);
        item.classList[menuItem && menuItem.path === currentPath ? 'add' : 'remove'](
          'Mui-selected'
        );
      });

      // Handle overview page specifically
      if (currentPath === '/overview') {
        renderOverviewPage();
      } else {
        cleanupOverviewPage();
      }
    });
  };

  const init = () => {
    if (injectDrawerIcons()) setupRouteListener();

    const observer = new MutationObserver((_, obs) => {
      if (document.querySelector('.MuiDrawer-paper') && injectDrawerIcons()) {
        setupRouteListener();
        obs.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const initHandler = () => {
      if (!document.querySelector('.drawer-logo-container')) {
        injectDrawerIcons();
        setupRouteListener();
      }
      // Check if we should render overview on page load
      if (window.location.pathname === '/overview') {
        renderOverviewPage();
      }
    };

    ['DOMContentLoaded', 'load'].forEach(event => window.addEventListener(event, initHandler));

    // Handle custom navigation events
    window.addEventListener('app-navigation', event => {
      const path = event.detail?.path;
      if (path === '/overview') {
        renderOverviewPage();
      } else {
        cleanupOverviewPage();
      }
    });

    // Handle logo clicks
    document.addEventListener('click', event => {
      const target = event.target;
      const drawer = document.querySelector('.MuiDrawer-paper');
      if (!drawer) return;

      if (target.closest('[title="Show Only Custom UI"]') || target.closest('.new-ui-logo')) {
        event.preventDefault();
        activateExclusiveNewUI(drawer);
      } else if (target.closest('.home-logo')) {
        event.preventDefault();
        showDefaultMenu(drawer);
        navigateTo('/dashboard');
      }
    });

    // Retry mechanism for drawer injection
    let attempts = 0;
    const retryInterval = setInterval(() => {
      if (
        document.querySelector('.drawer-logo-container') ||
        attempts >= 15 ||
        injectDrawerIcons()
      ) {
        clearInterval(retryInterval);
        if (window.location.pathname === '/overview') {
          renderOverviewPage();
        }
      }
      attempts++;
    }, 1000);
  };

  return {
    init,
    injectDrawerIcons,
    showDefaultMenu,
    toggleK8sMenu,
    activateExclusiveNewUI,
    navigateTo,
    renderOverviewPage,
    cleanupOverviewPage,
    getActiveMenuType: () => activeMenuType,
    isExclusiveMode: () => exclusiveMode,
  };
})();

// Logo component for header
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
        console.error('Error loading logo: ', e.currentTarget.src);
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}

// Settings Component
const ThemeCustomizer = () => {
  const config = store.get() || {};
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor || defaults.primary);
  const [secondaryColor, setSecondaryColor] = useState(config.secondaryColor || defaults.secondary);
  const [font, setFont] = useState(config.font || defaults.font);
  const [logoURL, setLogoURL] = useState(config.logoURL || defaults.logoURL);

  useEffect(() => {
    if (!document.querySelector('.drawer-logo-container')) appManager.injectDrawerIcons();
  }, []);

  const applySettings = settings => {
    store.set(settings);
    injectThemeStyle(settings);
    settings.font && loadFont(settings.font);
    settings.logoURL && registerAppLogo(SimpleLogo);
    appManager.injectDrawerIcons();
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
        <Button
          onClick={() => applySettings({ primaryColor, secondaryColor, font, logoURL })}
          variant="contained"
        >
          Save
        </Button>
        <Button
          onClick={() => {
            setPrimaryColor(defaults.primary);
            setSecondaryColor(defaults.secondary);
            setFont(defaults.font);
            setLogoURL(defaults.logoURL);
            applySettings({ ...defaults });
          }}
          variant="outlined"
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

// Initialize application
(() => {
  const initialConfig = store.get() || {};
  injectThemeStyle(initialConfig);
  initialConfig.font && loadFont(initialConfig.font);
  initialConfig.logoURL && registerAppLogo(SimpleLogo);

  appManager.init();
  registerPluginSettings('enbuild-headlamp-theme', ThemeCustomizer, false);

  if (window.location.pathname === '/overview') {
    setTimeout(() => appManager.renderOverviewPage(), 100);
  }
})();
