import React, { useState, useEffect } from 'react';
import {
  registerPluginSettings,
  ConfigStore,
  registerAppLogo,
  AppLogoProps,
  registerAppTheme,
} from '@kinvolk/headlamp-plugin/lib';
import {
  Box,
  Button,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from '@mui/material';

// Match the theme in the screenshot
const defaultPrimary = '#05A2C2';
const defaultSecondary = '#ffffff';
const defaultFont = 'Inter';
const defaultLogoURL = '';

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

const loadFont = (fontName: string) => {
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

const injectThemeStyle = ({ primaryColor, secondaryColor }: ThemeOptions) => {
  const style = document.createElement('style');
  style.id = 'custom-theme-style';

  style.innerHTML = `
    /* Button styling */
    .MuiButton-contained {
      background-color: ${primaryColor || defaultPrimary} !important;
      color: ${secondaryColor || defaultSecondary} !important;
    }

    .MuiButton-contained:hover {
      background-color: ${primaryColor || defaultPrimary}cc !important;
    }

    /* Sidebar (Drawer) background and text color */
    .MuiDrawer-paper {
      background-color: ${secondaryColor || defaultSecondary} !important;
      color: ${primaryColor || defaultPrimary} !important;
    }

    /* Unselected menu item text */
    .MuiDrawer-paper .MuiListItem-root {
      color: ${primaryColor || defaultPrimary} !important;
    }

    /* Selected Menu Item */
    .MuiDrawer-paper .MuiListItem-root.Mui-selected {
      background-color: ${primaryColor || defaultPrimary} !important;
      color: ${secondaryColor || defaultSecondary} !important;
    }

    .MuiDrawer-paper .MuiListItem-root.Mui-selected .MuiListItemText-primary {
      color: ${secondaryColor || defaultSecondary} !important;
    }

    /* Hovered menu item (same as selected) */
    .MuiDrawer-paper .MuiListItem-root:hover {
      background-color: ${primaryColor || defaultPrimary} !important;
      color: ${secondaryColor || defaultSecondary} !important;
    }

    .MuiDrawer-paper .MuiListItem-root:hover .MuiListItemText-primary {
      color: ${secondaryColor || defaultSecondary} !important;
    }

    /* Hovered submenu item */
    .MuiDrawer-paper .MuiListItem-root .MuiCollapse-root .MuiListItemText-primary:hover {
      background-color: ${primaryColor || defaultPrimary} !important;
      color: ${secondaryColor || defaultSecondary} !important;
    }

    /* Icons wrapper (ListItemIcon) */
    .MuiDrawer-paper .MuiListItemIcon-root {
      background-color: transparent !important;
      color: inherit !important;
    }

    /* Icons themselves (SvgIcon) */
    .MuiDrawer-paper .MuiListItemIcon-root .MuiSvgIcon-root {
      background-color: transparent !important;
      color: inherit !important;
    }

    /* Icons on hover (optional smoother hover) */
    .MuiDrawer-paper .MuiListItem-root:hover .MuiListItemIcon-root .MuiSvgIcon-root {
      color: ${secondaryColor || defaultSecondary} !important;
    }

    /* Navbar (AppBar) styling */
    .MuiAppBar-root {
      background-color: ${secondaryColor || defaultSecondary} !important;
      color: ${primaryColor || defaultPrimary} !important;
    }
  `;

  document.getElementById('custom-theme-style')?.remove();
  document.head.appendChild(style);
};

const store = new ConfigStore<ThemeOptions>('enbuild-customiser-theme');

export function SimpleLogo(props: AppLogoProps) {
  const { className } = props;
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
      }}
      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
        console.error('Error loading logo');
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}

// Apply the theme settings on initial load and when config changes
const applyThemeSettings = () => {
  const config = store.get() || {};
  const themeSettings = {
    primaryColor: config.primaryColor || defaultPrimary,
    secondaryColor: config.secondaryColor || defaultSecondary,
    font: config.font || defaultFont,
    logoURL: config.logoURL || defaultLogoURL,
  };

  // Apply theme styles
  injectThemeStyle(themeSettings);

  // Load custom font
  if (themeSettings.font) {
    loadFont(themeSettings.font);
  }

  // Register logo if URL is provided
  if (themeSettings.logoURL) {
    registerAppLogo(SimpleLogo);
  }

  // Register app theme with the sidebar styles
  registerAppTheme({
    name: 'enbuild-custom-theme',
    base: 'light',
    primary: themeSettings.primaryColor,
    secondary: themeSettings.secondaryColor,
    text: {
      primary: '#44444f',
    },
    background: {
      muted: '#f5f5f5',
    },
    sidebar: {
      background: themeSettings.secondaryColor,
      color: themeSettings.primaryColor,
      selectedBackground: themeSettings.primaryColor,
      selectedColor: themeSettings.secondaryColor,
      actionBackground: 'none',
    },
    navbar: {
      background: '#f0f0f0',
      color: '#292827',
    },
    buttonTextTransform: 'none',
    radius: 6,
  });
};

// Initial application of theme when plugin loads
applyThemeSettings();

const ThemeCustomizer = () => {
  const config = store.get() || {};
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor || defaultPrimary);
  const [secondaryColor, setSecondaryColor] = useState(config.secondaryColor || defaultSecondary);
  const [font, setFont] = useState(config.font || defaultFont);
  const [logoURL, setLogoURL] = useState(config.logoURL || defaultLogoURL);

  // Apply theme on initial load
  useEffect(() => {
    applyThemeSettings();
  }, []);

  const savePreferences = () => {
    const newConfig = { primaryColor, secondaryColor, font, logoURL };
    store.set(newConfig);

    // Apply updated theme
    injectThemeStyle(newConfig);
    if (font) loadFont(font);
    if (logoURL) registerAppLogo(SimpleLogo);

    // Update app theme registration
    registerAppTheme({
      name: 'enbuild-custom-theme',
      base: 'light',
      primary: primaryColor,
      secondary: secondaryColor,
      text: {
        primary: '#44444f',
      },
      background: {
        muted: '#f5f5f5',
      },
      sidebar: {
        background: secondaryColor,
        color: primaryColor,
        selectedBackground: primaryColor,
        selectedColor: secondaryColor,
        actionBackground: 'none',
      },
      navbar: {
        background: '#f0f0f0',
        color: '#292827',
      },
      buttonTextTransform: 'none',
      radius: 6,
    });
  };

  const resetPreferences = () => {
    const resetConfig = {
      primaryColor: defaultPrimary,
      secondaryColor: defaultSecondary,
      font: defaultFont,
      logoURL: defaultLogoURL,
    };
    setPrimaryColor(defaultPrimary);
    setSecondaryColor(defaultSecondary);
    setFont(defaultFont);
    setLogoURL(defaultLogoURL);
    store.set(resetConfig);

    // Apply reset theme
    injectThemeStyle(resetConfig);
    loadFont(defaultFont);

    // Update app theme registration with defaults
    registerAppTheme({
      name: 'enbuild-custom-theme',
      base: 'light',
      primary: defaultPrimary,
      secondary: defaultSecondary,
      text: {
        primary: '#44444f',
      },
      background: {
        muted: '#f5f5f5',
      },
      sidebar: {
        background: defaultSecondary,
        color: defaultPrimary,
        selectedBackground: defaultPrimary,
        selectedColor: defaultSecondary,
        actionBackground: 'none',
      },
      navbar: {
        background: '#f0f0f0',
        color: '#292827',
      },
      buttonTextTransform: 'none',
      radius: 6,
    });
  };

  return (
    <Box width="50%" style={{ paddingTop: '8vh' }}>
      <Typography variant="h6" gutterBottom>
        UI Theme Customizer
      </Typography>

      <TextField
        type="color"
        label="Primary Color (Selected Menu BG)"
        value={primaryColor}
        onChange={e => setPrimaryColor(e.target.value)}
        fullWidth
        variant="outlined"
        margin="dense"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        type="color"
        label="Secondary Color (Selected Menu Text)"
        value={secondaryColor}
        onChange={e => setSecondaryColor(e.target.value)}
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
          onChange={e => setFont(e.target.value)}
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
        helperText="Enter a valid image URL (PNG recommended)"
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

// Register the plugin settings
registerPluginSettings('enbuild-headlamp-theme', ThemeCustomizer, false);
