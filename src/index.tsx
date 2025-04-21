import React, { useState, useEffect } from 'react';
import { registerAppBarAction, registerPluginSettings } from '@kinvolk/headlamp-plugin/lib';

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

const injectThemeStyle = () => {
  const style = document.createElement('style');
  style.id = 'custom-theme-style';
  style.innerHTML = `
    :root {
      --primary-color: ${localStorage.getItem('primaryColor') || defaultPrimary};
      --secondary-color: ${localStorage.getItem('secondaryColor') || defaultSecondary};
      --font-family: '${localStorage.getItem('font') || defaultFont}',Inter sans-serif;
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

const ThemeCustomizer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(
    localStorage.getItem('primaryColor') || defaultPrimary
  );
  const [secondaryColor, setSecondaryColor] = useState(
    localStorage.getItem('secondaryColor') || defaultSecondary
  );
  const [font, setFont] = useState(localStorage.getItem('font') || defaultFont);

  useEffect(() => {
    injectThemeStyle();
  }, [primaryColor, secondaryColor, font]);

  const savePreferences = () => {
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
    localStorage.setItem('font', font);
    injectThemeStyle();
    setIsOpen(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={e => setIsOpen(e.currentTarget)}
        style={{
          borderColor: 'var(--primary-color)',
          color: 'var(--primary-color)',
          textTransform: 'none',
        }}
      >
        🎨 Customise Enbuild Theme ▼
      </Button>

      <Menu
        anchorEl={isOpen}
        open={Boolean(isOpen)}
        onClose={() => setIsOpen(null)}
        PaperProps={{
          style: {
            width: 300,
            padding: '16px',
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          UI Theme Customizer
        </Typography>

        <MenuItem disableRipple>
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
        </MenuItem>

        <MenuItem disableRipple>
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
        </MenuItem>

        <MenuItem disableRipple>
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
        </MenuItem>

        <Box mt={2} px={1}>
          <Button
            onClick={savePreferences}
            variant="contained"
            fullWidth
            style={{
              backgroundColor: primaryColor,
              color: '#fff',
              fontWeight: 'bold',
            }}
          >
            Save
          </Button>
        </Box>
      </Menu>
    </div>
  );
};

injectThemeStyle();

// Register Dropdown Theme Customizer in AppBar
registerAppBarAction(<ThemeCustomizer />);
