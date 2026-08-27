import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { withPrefix } from 'gatsby';
import theme from './src/theme';

const BUILD_ID = process.env.GATSBY_SITE_BUILD_ID;
const REFRESH_PARAM = '__site_version';
const REFRESH_SESSION_KEY = 'chiyoji-site:last-refreshed-build';
const CACHE_CLEANUP_KEY = 'chiyoji-site:cache-cleanup-build';
let versionCheckPromise = null;

const removeRefreshParam = () => {
  const url = new URL(window.location.href);
  if (url.searchParams.get(REFRESH_PARAM) === BUILD_ID) {
    url.searchParams.delete(REFRESH_PARAM);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }
};

const refreshWhenSiteChanged = async () => {
  if (process.env.NODE_ENV !== 'production' || !BUILD_ID || versionCheckPromise) {
    return versionCheckPromise;
  }

  versionCheckPromise = fetch(`${withPrefix('/site-version.json')}?t=${Date.now()}`, {
    cache: 'no-store',
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Version check failed: ${response.status}`);
      }
      return response.json();
    })
    .then(({ buildId }) => {
      if (!buildId || buildId === BUILD_ID) {
        removeRefreshParam();
        return;
      }

      if (window.sessionStorage.getItem(REFRESH_SESSION_KEY) === buildId) {
        return;
      }

      window.sessionStorage.setItem(REFRESH_SESSION_KEY, buildId);
      const url = new URL(window.location.href);
      url.searchParams.set(REFRESH_PARAM, buildId);
      window.location.replace(url.toString());
    })
    .catch(() => {
      // A failed background check must not prevent the current page from working.
    })
    .finally(() => {
      versionCheckPromise = null;
    });

  return versionCheckPromise;
};

const clearLegacySiteCaches = async () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  if (window.localStorage.getItem(CACHE_CLEANUP_KEY) === BUILD_ID) {
    return;
  }

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.unregister()));
  }

  if ('caches' in window) {
    const cacheNames = await window.caches.keys();
    await Promise.all(cacheNames.map(cacheName => window.caches.delete(cacheName)));
  }

  window.localStorage.setItem(CACHE_CLEANUP_KEY, BUILD_ID);
};

export const onClientEntry = () => {
  window.setTimeout(() => {
    clearLegacySiteCaches().finally(refreshWhenSiteChanged);
  }, 800);

  window.addEventListener('focus', refreshWhenSiteChanged);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      refreshWhenSiteChanged();
    }
  });
};

export const onRouteUpdate = () => {
  refreshWhenSiteChanged();
};

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {element}
  </ThemeProvider>
);
