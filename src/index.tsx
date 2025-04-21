import React, { useState, useEffect } from 'react';
import { registerAppBarAction } from '@kinvolk/headlamp-plugin/lib';

const defaultPrimary = '#05A2C2';
const defaultSecondary = ' #ff9800';
const defaultFont = 'Inter sans-serif';

const fontOptions = [
  'Inter', 'Arial', 'Roboto', 'Courier New', 'Georgia',
  'Monospace', 'Verdana', 'Tahoma', 'Times New Roman', 'Trebuchet MS',
  'Lucida Console', 'Comic Sans MS', 'PT Sans', 'Open Sans', 'Lato'
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
  const [primaryColor, setPrimaryColor] = useState(localStorage.getItem('primaryColor') || defaultPrimary);
  const [secondaryColor, setSecondaryColor] = useState(localStorage.getItem('secondaryColor') || defaultSecondary);
  const [font, setFont] = useState(localStorage.getItem('font') || defaultFont);

  useEffect(() => {
    injectThemeStyle();
  }, [primaryColor, secondaryColor, font]);

  const savePreferences = () => {
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
    localStorage.setItem('font', font);
    injectThemeStyle();
    setIsOpen(false)
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--primary-color)',
          color: 'var(--primary-color)',
          borderRadius: '6px',
          padding: '6px 12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        🎨Customise Enbuild Theme
        <span
          style={{
            display: 'inline-block',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          ▼
        </span>
      </button>
  
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '2.5rem',
            right: 0,
            width: '270px',
            backgroundColor: '#f1f1f1',
            color: '#333',
            border: '1px solid var(--primary-color)',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 9999,
          }}
        >
          <h4 style={{ margin: '0 0 12px', fontSize: '1.1rem', color: '#111', }}>UI Theme Customizer</h4>
  
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.9rem', color: '#111', }}>
              Primary Color
            </label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              style={{
                width: '100%',
                height: '32px',
                border: '2px solid var(--primary-color)',
                borderRadius: '4px',
                padding: 0,
              }}
            />
          </div>
  
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.9rem', color: '#111', }}>
              Secondary Color
            </label>
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              style={{
                width: '100%',
                height: '32px',
                border: '2px solid var(--primary-color)',
                borderRadius: '4px',
                padding: 0,
              }}
            />
          </div>
  
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: '#111' }}>
              Font Style
            </label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid var(--primary-color)',
                fontFamily: font,
                background: '#fff',
                color: '#333',
              }}
            >
              {fontOptions.map((f) => (
                <option key={f} value={f} style={{ fontFamily: f }}>
                  {f}
                </option>
              ))}
            </select>
          </div>
  
          <button
            onClick={savePreferences}
            style={{
                width: '100%',
                backgroundColor: primaryColor,
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 0',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
  
};

injectThemeStyle();

// Register Dropdown Theme Customizer in AppBar
registerAppBarAction(<ThemeCustomizer />);