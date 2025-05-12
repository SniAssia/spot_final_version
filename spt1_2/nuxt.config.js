export default {
  ssr: false, // Ensure SSR is enabled
  target: 'static',
  modules: ['@nuxtjs/axios', '@nuxtjs/auth-next', '@nuxt/postcss8', '@nuxtjs/toast'],

  axios: {
    baseURL: 'https://api.spotify.com/v1', // API Spotify
  },
  css: [
    // Inclure Tailwind CSS
    '@/assets/css/tailwind.css',
  ],
  build: {
    postcss: {
      plugins: {
        'postcss-import': {},
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },

  head: {
    // ... autres options ...
    link: [
      // ... autres liens ...
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      },
    ],
  },
  devServer: {
    host: '127.0.0.1',
    port: 3000
  },

  auth: {
    strategies: {
      spotify: {
        scheme: 'oauth2',
        endpoints: {
          authorization: 'https://accounts.spotify.com/authorize',
          token: 'https://accounts.spotify.com/api/token',
          userInfo: 'https://api.spotify.com/v1/me',
        },
        clientId: 'b67242166614459ba1709a33bf52b76c',
        clientSecret: '9e2c86e4be864dee9073a94cba0595bc',
        scope: [
          'user-read-private',
          'user-read-email',
          'playlist-read-private',
          'playlist-modify-public',
          'playlist-modify-private',
          'user-library-read',
          'user-library-modify',
          'user-read-playback-state',
          'user-modify-playback-state',
          'streaming',
          'user-read-currently-playing',
          'user-read-recently-played',
          'user-top-read',
          'user-follow-read'
        ],
        grantType: 'authorization_code',
        responseType: 'code',
        redirectUri: 'https://spot-final-version.vercel.app/callback',
      },
    },
  },

  toast: {
    position: 'top-right',
    duration: 3000,
    keepOnHover: true,
  },
};
