const STATE_COOKIE = 'chiyoji_decap_oauth_state';
const STATE_TTL_SECONDS = 10 * 60;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== 'GET') {
      return textResponse('Method not allowed', 405, {
        Allow: 'GET',
      });
    }

    if (url.pathname === '/') {
      return textResponse('chiyoji Decap CMS OAuth worker');
    }

    if (url.pathname === '/auth') {
      return startAuthorization(url, env);
    }

    if (url.pathname === '/callback') {
      return finishAuthorization(request, url, env);
    }

    return textResponse('Not found', 404);
  },
};

function startAuthorization(url, env) {
  if (!env.CLIENT_ID) {
    return textResponse('OAuth is not configured', 503);
  }

  const state = crypto.randomUUID();
  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', env.CLIENT_ID);
  authorizeUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
  authorizeUrl.searchParams.set('scope', 'public_repo');
  authorizeUrl.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl.toString(),
      'Set-Cookie': `${STATE_COOKIE}=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=${STATE_TTL_SECONDS}; Path=/`,
      ...securityHeaders(),
    },
  });
}

async function finishAuthorization(request, url, env) {
  if (!env.CLIENT_ID || !env.CLIENT_SECRET) {
    return textResponse('OAuth is not configured', 503);
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expectedState = readCookie(request.headers.get('Cookie'), STATE_COOKIE);

  if (!code || !state || !expectedState || !constantTimeEqual(state, expectedState)) {
    return textResponse('Invalid or expired OAuth request', 400, {
      'Set-Cookie': clearStateCookie(),
    });
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'chiyoji-decap-cms-oauth',
    },
    body: JSON.stringify({
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/callback`,
    }),
  });

  if (!tokenResponse.ok) {
    return textResponse('GitHub OAuth failed', 502, {
      'Set-Cookie': clearStateCookie(),
    });
  }

  const tokenResult = await tokenResponse.json();
  if (!tokenResult.access_token) {
    return textResponse('GitHub OAuth was not authorized', 403, {
      'Set-Cookie': clearStateCookie(),
    });
  }

  const siteOrigin = normalizeOrigin(env.SITE_ORIGIN);
  if (!siteOrigin) {
    return textResponse('Allowed site origin is not configured', 503, {
      'Set-Cookie': clearStateCookie(),
    });
  }

  const nonce = crypto.randomUUID().replaceAll('-', '');
  const payload = JSON.stringify({
    provider: 'github',
    token: tokenResult.access_token,
  }).replaceAll('<', '\\u003c');
  const allowedOrigin = JSON.stringify(siteOrigin);
  const page = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><title>GitHub sign-in complete</title></head>
  <body>
    <p>Completing GitHub sign-in…</p>
    <script nonce="${nonce}">
      (() => {
        const allowedOrigin = ${allowedOrigin};
        const authorization = 'authorization:github:success:' + ${JSON.stringify(payload)};
        const receiveMessage = event => {
          if (event.origin !== allowedOrigin || !window.opener) return;
          window.opener.postMessage(authorization, allowedOrigin);
        };
        window.addEventListener('message', receiveMessage, false);
        if (window.opener) window.opener.postMessage('authorizing:github', allowedOrigin);
      })();
    </script>
  </body>
</html>`;

  return new Response(page, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'none'; img-src 'none'; connect-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'`,
      'Set-Cookie': clearStateCookie(),
      ...securityHeaders(),
    },
  });
}

function normalizeOrigin(value) {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function readCookie(header, name) {
  if (!header) return null;

  for (const part of header.split(';')) {
    const [cookieName, ...cookieValue] = part.trim().split('=');
    if (cookieName === name) return cookieValue.join('=');
  }

  return null;
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function clearStateCookie() {
  return `${STATE_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/`;
}

function securityHeaders() {
  return {
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}

function textResponse(message, status = 200, extraHeaders = {}) {
  return new Response(message, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=UTF-8',
      ...securityHeaders(),
      ...extraHeaders,
    },
  });
}
