<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#2d0036] to-[#1a0022]">
    <div class="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-black/80 border border-pink-900">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-pink-300 mb-2 drop-shadow">Connexion à Spotify</h1>
        <p class="text-pink-200">Connectez-vous avec votre compte Spotify</p>
      </div>
      <div class="space-y-6">
        <button
          @click="redirectToSpotify"
          class="w-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold py-3 px-8 rounded-full transition duration-200 flex items-center justify-center shadow-lg hover:shadow-pink-500/40 focus:outline-none focus:ring-4 focus:ring-pink-400"
        >
          <i class="material-icons mr-2 text-pink-100">music_note</i>
          Se connecter avec Spotify
        </button>
        <div class="mt-8 text-center">
          <p class="text-pink-200">
            Vous n'avez pas de compte ?
            <a
              href="https://www.spotify.com/fr/signup"
              target="_blank"
              class="text-pink-400 hover:text-pink-300 font-medium underline underline-offset-2"
            >
              Créer un compte Spotify
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    redirectToSpotify() {
      const clientId = '637ca364d801495da5109a9936b99211';
      const redirectUri = 'https://d614-41-137-204-12.ngrok-free.app/callback'; // Ensure this matches the redirect URI in the Spotify dashboard
      console.log('Client ID:', clientId);
      console.log('Redirect URI:', redirectUri);
      
      const scopes = [
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
      ];
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=${encodeURIComponent(scopes.join(' '))}`;
      console.log('Auth URL:', authUrl);
      window.location.href = authUrl;
    }
  }
};
</script>

<style scoped>
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
</style>
  
