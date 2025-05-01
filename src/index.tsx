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
import React, { useState } from 'react';

const defaultPrimary = '#05A2C2';
const defaultSecondary = '#ffffff';
const defaultFont = 'Inter';
const defaultLogoURL = 'https://enbuild-docs.vivplatform.io/images/emma/enbuild-logo.png';

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
    .MuiSvgIcon-root {
      color: black !important;
    }
    .MuiDrawer-paper > .MuiListItem-root:hover .MuiListItemIcon,
    .MuiDrawer-paper > .MuiListItem-root.Mui-selected .MuiListItemIcon,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root:hover .MuiListItemIcon,
    .MuiDrawer-paper .MuiCollapse-root .MuiListItemButton-root.Mui-selected .MuiListItemIcon {
      color: black !important;
    }
  `;

  document.getElementById('custom-theme-style')?.remove();
  document.head.appendChild(style);
};

const store = new ConfigStore<ThemeOptions>('enbuild-customiser-theme');

const initialConfig = store.get() || {};
injectThemeStyle(initialConfig);
if (initialConfig.font) loadFont(initialConfig.font);
if (initialConfig.logoURL) registerAppLogo(SimpleLogo);

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

const ThemeCustomizer = () => {
  const config = store.get() || {};
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor || defaultPrimary);
  const [secondaryColor, setSecondaryColor] = useState(config.secondaryColor || defaultSecondary);
  const [font, setFont] = useState(config.font || defaultFont);
  const [logoURL, setLogoURL] = useState(config.logoURL || defaultLogoURL);

  const savePreferences = () => {
    const newConfig: ThemeOptions = { primaryColor, secondaryColor, font, logoURL };
    store.set(newConfig);
    injectThemeStyle(newConfig);
    if (font) loadFont(font);
    if (logoURL) registerAppLogo(SimpleLogo);
  };

  const resetPreferences = () => {
    const resetConfig: ThemeOptions = {
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
    injectThemeStyle(resetConfig);
    loadFont(defaultFont);
    registerAppLogo(SimpleLogo);
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
        label="Primary Color (Drawer Background)"
        value={primaryColor}
        onChange={e => setPrimaryColor(e.target.value || defaultPrimary)}
        fullWidth
        variant="outlined"
        margin="dense"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        type="color"
        label="Secondary Color (Text/Icon)"
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

registerPluginSettings('enbuild-headlamp-theme', ThemeCustomizer, false);
