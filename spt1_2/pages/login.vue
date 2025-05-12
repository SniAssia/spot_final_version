<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#003d59] to-[#001e2b]">
    <div class="w-full max-w-md p-10 rounded-3xl shadow-2xl bg-black/90 border border-teal-900">
      <div class="text-center mb-10">
        <h1 class="text-5xl font-extrabold text-teal-300 mb-3 drop-shadow-lg">Connexion à Spotify</h1>
        <p class="text-teal-200 text-lg">Connectez-vous avec votre compte Spotify</p>
      </div>
      <div class="space-y-8">
        <!-- Connexion avec Spotify -->
        <button
          @click="redirectToSpotify"
          class="w-full bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500 hover:from-teal-400 hover:to-teal-400 text-white font-bold py-4 px-10 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-400"
        >
          <i class="material-icons mr-3 text-teal-100">music_note</i>
          Se connecter avec Spotify
        </button>
        
        <!-- Lien pour créer un compte Spotify -->
        <div class="mt-8 text-center">
          <p class="text-teal-200">
            Vous n'avez pas de compte ?
            <a
              href="https://www.spotify.com/fr/signup"
              target="_blank"
              class="text-teal-400 hover:text-teal-300 font-medium underline underline-offset-2"
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
      const clientId = 'b67242166614459ba1709a33bf52b76c';
      const redirectUri = 'https://spot-final-version.vercel.app/callback'; // Assurez-vous que cela correspond à l'URI de redirection dans le tableau de bord Spotify
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
  font-size: 30px; /* Augmenté pour un effet plus marqué */
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

button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(0, 128, 128, 0.3);
}
</style>
