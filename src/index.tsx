import React, { useState, useEffect } from 'react';
import { registerPluginSettings, ConfigStore } from '@kinvolk/headlamp-plugin/lib';

import {
  Button,
  Menu,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Box,
} from '@mui/material';

const defaultPrimary = '#05A2C2';
const defaultSecondary = '';
const defaultFont = 'Inter sans-serif';

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
}

const injectThemeStyle = ({ primaryColor, secondaryColor, font }: ThemeOptions) => {
  const style = document.createElement('style');
  style.id = 'custom-theme-style';
  style.innerHTML = `
    :root {
      --primary-color: ${primaryColor || defaultPrimary};
      --secondary-color: ${secondaryColor || defaultSecondary};
      --font-family: '${font || defaultFont}',Inter sans-serif;
    }
    body {
      font-family: var(--font-family) !important;
    }
    .MuiGrid-root,
    .MuiPaper-root, .MuiBox-root, .MuiCard-root {
    //   background-color: #1e1e1e !important;
      color: var(--secondary-color) !important;
    }
    .MuiTypography-root {
      color: var(--secondary-color) !important;
    }
    .MuiTableCell-head {
      background-color: #222 !important;
      color: var(--secondary-color) !important;
    }
    .MuiButton-root {
      background-color: var(--primary-color) !important;
      color: var(--secondary-color) !important;
    }
    .MuiListItemButton-root.Mui-selected {
      background-color: transparent !important;
      color: var(--secondary-color) !important;
      font-weight: bold !important;
      border: 1px solid var(--primary-color) !important;
    }
    .MuiListItemButton-root.Mui-selected::before {
      background: var(--primary-color) !important;
    }
    .MuiListItemButton-root.Mui-selected svg {
      color: var(--primary-color) !important;
    }
  `;
  const existing = document.getElementById('custom-theme-style');
  if (existing) existing.remove();
  document.head.appendChild(style);
};

const store = new ConfigStore('enbuild-customiser-theme');

const ThemeCustomizer = () => {
  const config = store.get() || {};
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor || defaultPrimary);
  const [secondaryColor, setSecondaryColor] = useState(config.secondaryColor || defaultSecondary);
  const [font, setFont] = useState(config.font || defaultFont);

  const savePreferences = () => {
    const newConfig = {
      primaryColor,
      secondaryColor,
      font,
    };
    store.set(newConfig);
    injectThemeStyle({ primaryColor, secondaryColor, font });
  };

  const resetPreferences = () => {
    setPrimaryColor(defaultPrimary);
    setSecondaryColor(defaultSecondary);
    setFont(defaultFont);
    store.set({
      primaryColor: defaultPrimary,
      secondaryColor: defaultSecondary,
      font: defaultFont,
    });
    injectThemeStyle({
      primaryColor: defaultPrimary,
      secondaryColor: defaultSecondary,
      font: defaultFont,
    });
  };

  return (
    <Box width="50%" style={{ paddingTop: '8vh' }}>
      <Typography variant="h6" gutterBottom>
        UI Theme Customizer
      </Typography>

      <TextField
        type="color"
        label="Primary Color"
        value={primaryColor}
        onChange={e => setPrimaryColor(e.target.value)}
        fullWidth
        variant="outlined"
        margin="dense"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        type="color"
        label="Secondary Color"
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
          style={{ fontFamily: font }}
        >
          {fontOptions.map(f => (
            <MenuItem key={f} value={f} style={{ fontFamily: f }}>
              {f}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
