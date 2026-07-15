import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './src/theme';

// Apply exactly the same theme while Gatsby creates the initial HTML.
// Without this wrapper, the page is briefly rendered with MUI's light-theme
// defaults (black text) until the browser-side JavaScript finishes loading.
export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {element}
  </ThemeProvider>
);

export const onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: 'ja' });
  setHeadComponents([
    <style
      key="initial-dark-theme"
      id="initial-dark-theme"
      dangerouslySetInnerHTML={{
        __html: 'html,body,#___gatsby{background:#121212!important;color:#fff;color-scheme:dark}',
      }}
    />,
  ]);
};
