import Middleware from './middleware'
import { Auth, authMiddleware, ExpiredAuthSessionError } from '~auth/runtime'

// Active schemes
import { Oauth2Scheme } from '~auth/runtime'

Middleware.auth = authMiddleware

export default function (ctx, inject) {
  // Options
  const options = {
  "resetOnError": false,
  "ignoreExceptions": false,
  "scopeKey": "scope",
  "rewriteRedirects": true,
  "fullPathRedirect": false,
  "watchLoggedIn": true,
  "redirect": {
    "login": "/login",
    "logout": "/",
    "home": "/",
    "callback": "/login"
  },
  "vuex": {
    "namespace": "auth"
  },
  "cookie": {
    "prefix": "auth.",
    "options": {
      "path": "/"
    }
  },
  "localStorage": {
    "prefix": "auth."
  },
  "defaultStrategy": "spotify"
}

  // Create a new Auth instance
  const $auth = new Auth(ctx, options)

  // Register strategies
  // spotify
  $auth.registerStrategy('spotify', new Oauth2Scheme($auth, {
  "endpoints": {
    "authorization": "https://accounts.spotify.com/authorize",
    "token": "https://accounts.spotify.com/api/token",
    "userInfo": "https://api.spotify.com/v1/me"
  },
  "clientId": "637ca364d801495da5109a9936b99211",
  "clientSecret": "46eeab5d0eda4810955feeb0a159b537",
  "scope": [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-library-read",
    "user-library-modify",
    "user-read-playback-state",
    "user-modify-playback-state",
    "streaming",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-top-read",
    "user-follow-read"
  ],
  "grantType": "authorization_code",
  "responseType": "code",
  "redirectUri": "https://d614-41-137-204-12.ngrok-free.app/callback",
  "name": "spotify"
}))

  // Inject it to nuxt context as $auth
  inject('auth', $auth)
  ctx.$auth = $auth

  // Initialize auth
  return $auth.init().catch(error => {
    if (process.client) {
      // Don't console log expired auth session errors. This error is common, and expected to happen.
      // The error happens whenever the user does an ssr request (reload/initial navigation) with an expired refresh
      // token. We don't want to log this as an error.
      if (error instanceof ExpiredAuthSessionError) {
        return
      }

      console.error('[ERROR] [AUTH]', error)
    }
  })
}
