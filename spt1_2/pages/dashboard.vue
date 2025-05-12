<template>
  <div class="flex h-screen bg-gray-900 text-white">
    <!-- Barre latérale -->
    <Sidebar />

    <!-- Contenu principal -->
    <main class="flex-1 overflow-y-auto">
      <!-- Header -->
      <header class="p-4 bg-gray-900">
        <!-- Barre de recherche -->
        <div class="flex items-center">
          <input
            v-model="query"
            @keyup.enter="search"
            placeholder="Rechercher des artistes, titres ou podcasts"
            class="w-full p-2 bg-gray-800 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </header>

      <!-- Résultats de recherche -->
      <section class="p-4">
        <h2 v-if="results && results.length > 0" class="text-2xl font-bold mb-4">Résultats de recherche</h2>
        
        <!-- Si aucun résultat trouvé -->
        <div v-if="results && results.length === 0" class="text-center text-gray-400 mt-8">
          Aucun résultat trouvé pour "{{ query }}".
        </div>
        
        <!-- Affichage des résultats -->
        <div v-if="results && results.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="item in results"
            :key="item.id"
            class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700"
          >
            <img
              :src="item.album.images[0]?.url || require('~/assets/default-album.png')"
              :alt="`Pochette de l'album ${item.album.name}`"
              class="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 class="text-lg font-semibold mb-1">{{ item.name }}</h3>
            <p class="text-gray-400 mb-2">{{ item.artists[0]?.name }}</p>
            <button
              @click="playTrack(item.uri)"
              class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Lire
            </button>
          </div>
        </div>
        <div v-else-if="loading" class="text-center mt-8">
          <svg class="animate-spin h-8 w-8 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p class="mt-4">Recherche en cours...</p>
        </div>
      </section>

      <!-- Lecteur en bas de page -->
      <footer v-if="currentTrack" class="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex items-center">
        <img
          :src="currentTrack.albumCover || require('~/assets/default-album.png')"
          :alt="`Pochette de l'album ${currentTrack.albumName}`"
          class="w-16 h-16 object-cover mr-4"
        />
        <div class="flex-1">
          <p class="text-white font-semibold">{{ currentTrack.name }}</p>
          <p class="text-gray-400">{{ currentTrack.artist }}</p>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="pausePlayback" class="text-white hover:text-green-500">
            <span class="material-icons text-3xl">pause_circle_filled</span>
          </button>
        </div>
      </footer>
    </main>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import Sidebar from '~/components/Sidebar.vue';

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      player: null,
      deviceId: null,
      currentTrack: null,
      query: '',
      results: null,
      loading: false,
    };
  },
  mounted() {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      console.error('Token non disponible. Veuillez vous reconnecter.');
      return;
    }

    if (window.Spotify) {
      this.initializePlayer(token);
    } else {
      window.onSpotifyWebPlaybackSDKReady = () => {
        this.initializePlayer(token);
      };
    }
  },
  methods: {
    ...mapMutations(['setDeviceId']),
    initializePlayer(token) {
      console.log('Initialisation du lecteur Spotify.');

      this.player = new Spotify.Player({
        name: 'Spotify Clone Player',
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      this.player.addListener('ready', ({ device_id }) => {
        console.log('Lecteur prêt avec Device ID :', device_id);
        this.deviceId = device_id;
        this.setDeviceId(device_id);
      });

      this.player.addListener('player_state_changed', (state) => {
        if (state) {
          const track = state.track_window.current_track;
          this.currentTrack = {
            name: track.name,
            artist: track.artists[0]?.name,
            albumCover: track.album.images[0]?.url,
            albumName: track.album.name,
          };
          console.log('Morceau en cours :', this.currentTrack);
        }
      });

      this.player.connect().then((success) => {
        if (success) {
          console.log('Lecteur Spotify connecté.');
        } else {
          console.error('Échec de la connexion au lecteur Spotify.');
        }
      });
    },

    async search() {
      this.loading = true;
      console.log('Recherche en cours pour:', this.query); // Log de la recherche en cours

      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
          console.error('Token non disponible. Veuillez vous reconnecter.');
          return;
        }

        const response = await this.$axios.$get(
          'https://api.spotify.com/v1/search',
          {
            params: { q: this.query, type: 'track' },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Ajoutez un log pour vérifier la structure de la réponse
        console.log('Réponse de la recherche:', response);

        this.results = response.tracks?.items || [];
        console.log('Résultats:', this.results); // Vérification des résultats
      } catch (error) {
        console.error('Erreur lors de la recherche :', error.response?.data || error.message);
      } finally {
        this.loading = false;
      }
    },

    async playTrack(uri) {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!this.deviceId) {
          console.error('Device ID non disponible. Le lecteur n’est pas prêt.');
          return;
        }

        console.log('Lecture de la piste:', uri);
        await this.$axios.$put(
          `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
          {
            uris: [uri],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log(`Lecture démarrée pour ${uri}`);
      } catch (error) {
        console.error('Erreur lors du démarrage de la lecture :', error.response?.data || error.message);
      }
    },

    async pausePlayback() {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!this.deviceId) {
          console.error('Device ID non disponible. Le lecteur n’est pas prêt.');
          return;
        }

        await this.$axios.$put(
          `https://api.spotify.com/v1/me/player/pause?device_id=${this.deviceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Lecture mise en pause.');
      } catch (error) {
        console.error('Erreur lors de la mise en pause :', error.response?.data || error.message);
      }
    },
  },
};
</script>

<style scoped>
/* Exemple de styles pour la page de recherche */
input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #333;
  color: white;
}
</style>
