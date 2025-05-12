<template>
  <div class="flex h-screen bg-gradient-to-br from-black via-[#2d0036] to-[#1a0022] text-white">
    <!-- Barre latérale -->
    <Sidebar />

    <!-- Contenu principal -->
    <main class="flex-1 overflow-y-auto">
      <!-- Profile and Logout Section -->
      <div class="p-4 bg-black/80 flex justify-end items-center border-b border-pink-900">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <img
              :src="userProfile?.images?.[0]?.url || require('~/assets/default-album.png')"
              :alt="userName"
              class="w-8 h-8 rounded-full border-2 border-pink-400 shadow-pink-400/40 shadow"
            />
            <span class="text-pink-200">{{ userName }}</span>
          </div>
          <button
            @click="logout"
            class="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-4 py-2 rounded-full flex items-center shadow-lg hover:shadow-pink-500/40 focus:outline-none focus:ring-4 focus:ring-pink-400"
          >
            <i class="material-icons mr-2">logout</i>
            Déconnexion
          </button>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="p-8">
        <h2 class="text-2xl font-bold mb-4 text-pink-300">Résultats de recherche</h2>
        <!-- Artists -->
        <div v-if="searchResults.artists?.items.length" class="mb-8">
          <h3 class="text-xl font-semibold mb-4 text-pink-200">Artistes</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div
              v-for="artist in searchResults.artists.items"
              :key="artist.id"
              class="bg-black/70 p-4 rounded-2xl hover:bg-pink-900/30 transition duration-200 ease-in-out transform hover:scale-105 shadow-lg shadow-pink-900/10"
            >
              <img
                :src="artist.images[0]?.url || require('~/assets/default-album.png')"
                :alt="artist.name"
                class="w-full h-40 object-cover mb-2 rounded-full border-2 border-pink-400"
              />
              <h3 class="text-lg font-semibold text-center text-pink-100">{{ artist.name }}</h3>
              <p class="text-pink-300 text-sm text-center">Artiste</p>
            </div>
          </div>
        </div>
        <!-- Tracks -->
        <div v-if="searchResults.tracks?.items.length" class="mb-8">
          <h3 class="text-xl font-semibold mb-4 text-pink-200">Chansons</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div
              v-for="track in searchResults.tracks.items"
              :key="track.id"
              class="bg-black/70 p-4 rounded-2xl hover:bg-pink-900/30 transition duration-200 ease-in-out transform hover:scale-105 shadow-lg shadow-pink-900/10"
            >
              <div class="relative group">
                <img
                  :src="track.album.images[0]?.url || require('~/assets/default-album.png')"
                  :alt="track.name"
                  class="w-full h-40 object-cover mb-2 rounded border-2 border-pink-400"
                />
                <div class="absolute bottom-2 right-2 flex space-x-2">
                  <button
                    @click="playTrack(track.uri)"
                    class="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg shadow-pink-500/40"
                  >
                    <i class="material-icons">play_arrow</i>
                  </button>
                  <button
                    @click="openAddToPlaylistModal(track)"
                    class="bg-black/70 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-pink-400"
                  >
                    <i class="material-icons">playlist_add</i>
                  </button>
                </div>
              </div>
              <h3 class="text-lg font-semibold text-pink-100">{{ track.name }}</h3>
              <p class="text-pink-300 text-sm">{{ track.artists[0]?.name }}</p>
            </div>
          </div>
        </div>
        <!-- Playlists -->
        <div v-if="searchResults.playlists?.items.length" class="mb-8">
          <h3 class="text-xl font-semibold mb-4 text-pink-200">Playlists</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div
              v-for="playlist in searchResults.playlists.items"
              :key="playlist.id"
              class="bg-black/70 p-4 rounded-2xl hover:bg-pink-900/30 transition duration-200 ease-in-out transform hover:scale-105 shadow-lg shadow-pink-900/10"
            >
              <img
                :src="playlist.images[0]?.url || require('~/assets/default-album.png')"
                :alt="playlist.name"
                class="w-full h-40 object-cover mb-2 rounded border-2 border-pink-400"
              />
              <h3 class="text-lg font-semibold text-pink-100">{{ playlist.name }}</h3>
              <p class="text-pink-300 text-sm">Par {{ playlist.owner.display_name }}</p>
              <button
                @click="playPlaylist(playlist.uri)"
                class="mt-2 w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white py-2 px-4 rounded-full flex items-center justify-center font-bold shadow-lg shadow-pink-500/40"
              >
                <i class="material-icons mr-2">play_arrow</i>
                LIRE
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Section -->
      <section v-else class="p-8 bg-gradient-to-b from-black/80 via-[#2d0036]/80 to-[#1a0022]/90">
        <!-- Bannière -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-pink-200">
            {{ greetingMessage }}, {{ userName || 'utilisateur' }} !
          </h1>
        </div>
        <!-- Section Écoutés récemment -->
        <div v-if="recentlyPlayed && recentlyPlayed.length" class="mb-8">
          <h2 class="text-2xl font-bold mb-4 text-pink-300">Écoutés récemment</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div
              v-for="track in recentlyPlayed"
              :key="track.id"
              class="bg-black/70 p-4 rounded-2xl hover:bg-pink-900/30 transition duration-200 ease-in-out transform hover:scale-105 shadow-lg shadow-pink-900/10"
            >
              <div class="relative group">
                <img
                  :src="track?.album?.images?.[0]?.url || require('~/assets/default-album.png')"
                  :alt="track?.name || 'Unknown track'"
                  class="w-full h-40 object-cover mb-2 rounded border-2 border-pink-400"
                />
                <div class="absolute bottom-2 right-2 flex space-x-2">
                  <button
                    @click="playTrack(track.uri)"
                    class="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg shadow-pink-500/40"
                  >
                    <i class="material-icons">play_arrow</i>
                  </button>
                  <button
                    @click="openAddToPlaylistModal(track)"
                    class="bg-black/70 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-pink-400"
                  >
                    <i class="material-icons">playlist_add</i>
                  </button>
                </div>
              </div>
              <h3 class="text-lg font-semibold truncate text-pink-100">{{ track?.name || 'Unknown track' }}</h3>
              <p class="text-pink-300 text-sm truncate">{{ track?.artists?.[0]?.name || 'Unknown artist' }}</p>
            </div>
          </div>
        </div>
        <!-- Section Vos Playlists -->
        <div v-if="userPlaylists && userPlaylists.length" class="mb-8">
          <h2 class="text-2xl font-bold mb-4 text-pink-300">Vos Playlists</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div
              v-for="playlist in userPlaylists"
              :key="playlist.id"
              class="bg-black/70 p-4 rounded-2xl hover:bg-pink-900/30 transition duration-200 ease-in-out transform hover:scale-105 shadow-lg shadow-pink-900/10"
            >
              <div class="relative group">
                <img
                  :src="playlist?.images?.[0]?.url || require('~/assets/default-album.png')"
                  :alt="playlist?.name || 'Unknown playlist'"
                  class="w-full h-40 object-cover mb-2 rounded border-2 border-pink-400"
                />
                <div class="absolute bottom-2 right-2 flex space-x-2">
                  <button
                    @click="playPlaylist(playlist.uri)"
                    class="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg shadow-pink-500/40"
                  >
                    <i class="material-icons">play_arrow</i>
                  </button>
                </div>
              </div>
              <h3 class="text-lg font-semibold truncate text-pink-100">{{ playlist?.name || 'Unknown playlist' }}</h3>
              <p class="text-pink-300 text-sm truncate">{{ playlist?.tracks?.total || 0 }} titres</p>
              <button
                @click="playPlaylist(playlist.uri)"
                class="mt-2 w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white py-2 px-4 rounded-full flex items-center justify-center font-bold shadow-lg shadow-pink-500/40"
              >
                <i class="material-icons mr-2">play_arrow</i>
                LIRE
              </button>
            </div>
          </div>
        </div>
        <!-- Section Recommandations -->
        <div v-if="recommendations && recommendations.length" class="mb-8">
          <h2 class="text-2xl font-bold mb-4 text-pink-300">Recommandations pour vous</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div
              v-for="track in recommendations"
              :key="track.id"
              class="bg-black/70 p-4 rounded-2xl hover:bg-pink-900/30 transition duration-200 ease-in-out transform hover:scale-105 shadow-lg shadow-pink-900/10"
            >
              <div class="relative group">
                <img
                  :src="track?.album?.images?.[0]?.url || require('~/assets/default-album.png')"
                  :alt="track?.name || 'Unknown track'"
                  class="w-full h-40 object-cover mb-2 rounded border-2 border-pink-400"
                />
                <div class="absolute bottom-2 right-2 flex space-x-2">
                  <button
                    @click="playTrack(track.uri)"
                    class="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg shadow-pink-500/40"
                  >
                    <i class="material-icons">play_arrow</i>
                  </button>
                  <button
                    @click="openAddToPlaylistModal(track)"
                    class="bg-black/70 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-pink-400"
                  >
                    <i class="material-icons">playlist_add</i>
                  </button>
                </div>
              </div>
              <h3 class="text-lg font-semibold truncate text-pink-100">{{ track?.name || 'Unknown track' }}</h3>
              <p class="text-pink-300 text-sm truncate">{{ track?.artists?.[0]?.name || 'Unknown artist' }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <PlayerBar />

    <!-- Add to Playlist Modal -->
    <div v-if="showAddToPlaylistModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-black/90 p-6 rounded-2xl w-full max-w-md border border-pink-900 shadow-lg shadow-pink-900/20">
        <h2 class="text-2xl font-bold mb-4 text-pink-300">Ajouter à une playlist</h2>
        <div v-if="userPlaylists && userPlaylists.length > 0" class="space-y-4 max-h-96 overflow-y-auto">
          <div v-for="playlist in userPlaylists" :key="playlist.id" class="flex items-center justify-between p-2 hover:bg-pink-900/30 rounded">
            <div class="flex items-center">
              <img
                :src="playlist?.images?.[0]?.url || require('~/assets/default-album.png')"
                :alt="playlist?.name || 'Unknown playlist'"
                class="w-12 h-12 object-cover rounded mr-4 border-2 border-pink-400"
              />
              <div>
                <h3 class="font-semibold text-pink-100">{{ playlist?.name || 'Unknown playlist' }}</h3>
                <p class="text-pink-300 text-sm">{{ playlist?.tracks?.total || 0 }} titres</p>
              </div>
            </div>
            <button
              @click="addTrackToPlaylist(playlist.id)"
              class="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-4 py-2 rounded-full shadow-lg shadow-pink-500/40"
            >
              Ajouter
            </button>
          </div>
        </div>
        <div v-else class="text-center py-4">
          <p class="text-pink-300">Aucune playlist disponible</p>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            @click="showAddToPlaylistModal = false"
            class="px-4 py-2 text-pink-200 hover:text-pink-100"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import Sidebar from '~/components/Sidebar.vue';
import PlayerBar from '~/components/PlayerBar.vue';
import { getValidAccessToken } from '~/utils/auth';

export default {
  components: {
    Sidebar,
    PlayerBar,
  },
  data() {
    return {
      userName: null,
      userProfile: null,
      recentlyPlayed: [],
      userPlaylists: [],
      recommendations: [],
      searchQuery: '',
      searchResults: {
        artists: { items: [] },
        tracks: { items: [] },
        playlists: { items: [] }
      },
      searchTimeout: null,
      greetingMessage: '',
      showAddToPlaylistModal: false,
      selectedTrack: null,
    };
  },
  mounted() {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      console.error('Token non disponible. Veuillez vous reconnecter.');
      this.$router.push('/login');
      return;
    }

    // Fetch user data
    this.setGreetingMessage();
    this.loadUserProfile();
    this.loadRecentlyPlayed();
    this.loadLibrary();
    this.getRecommendations();

    // Listen for player events from the layout
    this.$root.$on('player-ready', this.handlePlayerReady);
    this.$root.$on('player-not-ready', this.handlePlayerNotReady);
    this.$root.$on('player-state-changed', this.handlePlayerStateChanged);
  },
  beforeDestroy() {
    // Clean up event listeners
    this.$root.$off('player-ready', this.handlePlayerReady);
    this.$root.$off('player-not-ready', this.handlePlayerNotReady);
    this.$root.$off('player-state-changed', this.handlePlayerStateChanged);
  },
  methods: {
    ...mapMutations(['setDeviceId']),
    async loadUserProfile() {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) return;

        const response = await this.$axios.$get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.userName = response.display_name;
        this.userProfile = response;
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    },
    async loadRecentlyPlayed() {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) return;

        const response = await this.$axios.$get('https://api.spotify.com/v1/me/player/recently-played?limit=20', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.recentlyPlayed = response.items.map(item => item.track);
      } catch (error) {
        console.error('Error loading recently played:', error);
      }
    },
    async loadLibrary() {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) return;

        const playlistsResponse = await this.$axios.$get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 50,
          },
        });

        if (playlistsResponse && playlistsResponse.items) {
          this.userPlaylists = playlistsResponse.items.filter(playlist => playlist !== null);
        }
      } catch (error) {
        console.error('Error loading library:', error);
        this.userPlaylists = [];
      }
    },
    async getRecommendations() {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) return;

        const topArtistsResponse = await this.$axios.$get('https://api.spotify.com/v1/me/top/artists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 5,
            time_range: 'medium_term',
          },
        });

        if (!topArtistsResponse?.items?.length) {
          console.error('No top artists found');
          return;
        }

        const artistIds = topArtistsResponse.items.map(artist => artist.id).filter(id => id !== null);

        if (!artistIds.length) {
          console.error('No valid artist IDs found');
          return;
        }

        const recommendationsResponse = await this.$axios.$get('https://api.spotify.com/v1/recommendations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            seed_artists: artistIds.join(','),
            limit: 10,
          },
        });

        if (recommendationsResponse?.tracks) {
          this.recommendations = recommendationsResponse.tracks.filter(track => track !== null);
        }
      } catch (error) {
        console.error('Error getting recommendations:', error);
        this.recommendations = [];
      }
    },
    async playTrack(uri) {
      try {
        const token = localStorage.getItem('spotify_access_token');
        const deviceId = localStorage.getItem('spotify_device_id');
        if (!token || !deviceId) return;

        await this.$axios.$put(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
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
      } catch (error) {
        console.error('Error playing track:', error);
      }
    },
    async playPlaylist(uri) {
      try {
        const token = localStorage.getItem('spotify_access_token');
        const deviceId = localStorage.getItem('spotify_device_id');
        if (!token || !deviceId) return;

        await this.$axios.$put(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            context_uri: uri,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        console.error('Error playing playlist:', error);
      }
    },
    async handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      if (!this.searchQuery.trim()) {
        this.searchResults = {
          artists: { items: [] },
          tracks: { items: [] },
          playlists: { items: [] }
        };
        return;
      }

      this.searchTimeout = setTimeout(async () => {
        try {
          const token = localStorage.getItem('spotify_access_token');
          const response = await this.$axios.$get('https://api.spotify.com/v1/search', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              q: this.searchQuery,
              type: 'artist,track,playlist',
              limit: 5,
            },
          });

          this.searchResults = response;
        } catch (error) {
          console.error('Error searching:', error);
        }
      }, 300);
    },
    setGreetingMessage() {
      const hour = new Date().getHours();
      if (hour < 12) {
        this.greetingMessage = 'Bonjour';
      } else if (hour < 18) {
        this.greetingMessage = 'Bon après-midi';
      } else {
        this.greetingMessage = 'Bonsoir';
      }
    },
    handlePlayerReady(deviceId) {
      console.log('Player is ready on device:', deviceId);
    },
    handlePlayerNotReady(deviceId) {
      console.log('Player is not ready on device:', deviceId);
    },
    handlePlayerStateChanged(state) {
      console.log('Player state changed:', state);
    },
    async openAddToPlaylistModal(track) {
      try {
        this.selectedTrack = track;
        this.showAddToPlaylistModal = true;
        // Load playlists when opening the modal
        await this.loadLibrary();
      } catch (error) {
        console.error('Error opening add to playlist modal:', error);
        this.$toast.error('Erreur lors de l\'ouverture de la modal');
      }
    },
    async addTrackToPlaylist(playlistId) {
      try {
        const token = await getValidAccessToken();
        if (!token || !this.selectedTrack) {
          this.$toast.error('Erreur lors de l\'ajout à la playlist');
          return;
        }

        // Add the track to the playlist
        await this.$axios.$post(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            uris: [this.selectedTrack.uri],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Update the playlist's track count in the UI
        const playlist = this.userPlaylists.find(p => p.id === playlistId);
        if (playlist) {
          playlist.tracks.total = (playlist.tracks.total || 0) + 1;
        }

        this.$toast.success('Titre ajouté à la playlist');
        this.showAddToPlaylistModal = false;
        this.selectedTrack = null;

        // Reload the library to ensure everything is in sync
        await this.loadLibrary();
      } catch (error) {
        console.error('Error adding track to playlist:', error);
        this.$toast.error('Erreur lors de l\'ajout à la playlist');
        
        if (error.response?.status === 401) {
          try {
            await getValidAccessToken();
            await this.addTrackToPlaylist(playlistId);
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            this.$toast.error('Session expirée. Veuillez vous reconnecter.');
            this.$router.push('/login');
          }
        }
      }
    },
    async logout() {
      try {
        // Clear all Spotify-related data
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        localStorage.removeItem('spotify_token_expires_at');
        localStorage.removeItem('spotify_device_id');
        
        // Redirect to login page
        this.$router.push('/login');
      } catch (error) {
        console.error('Error during logout:', error);
        this.$toast.error('Erreur lors de la déconnexion');
      }
    },
  },
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
