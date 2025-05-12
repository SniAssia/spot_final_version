<template>
  <div class="flex h-screen bg-gradient-to-br from-black via-[#2d0036] to-[#1a0022] text-white">
    <!-- Barre latérale -->
    <Sidebar />

    <!-- Contenu principal -->
    <main class="flex-1 overflow-y-auto">
      <div class="p-8 bg-gradient-to-b from-black/80 via-[#2d0036]/80 to-[#1a0022]/90">
        <!-- Header with Create Playlist Button -->
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-pink-200">Votre Bibliothèque</h1>
          <button
            @click="showCreatePlaylistModal = true"
            class="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-6 py-2 rounded-full flex items-center font-bold shadow-lg hover:shadow-pink-500/40 focus:outline-none focus:ring-4 focus:ring-pink-400"
          >
            <i class="material-icons mr-2">add</i>
            Créer une playlist
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex space-x-4 mb-6">
          <button
            @click="activeTab = 'playlists'"
            :class="[
              'px-4 py-2 rounded-full transition-colors font-bold',
              activeTab === 'playlists' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'text-pink-300 hover:text-pink-100'
            ]"
          >
            Playlists
          </button>
          <button
            @click="activeTab = 'liked'"
            :class="[
              'px-4 py-2 rounded-full transition-colors font-bold',
              activeTab === 'liked' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'text-pink-300 hover:text-pink-100'
            ]"
          >
            Titres likés
          </button>
        </div>

        <!-- Liked Songs Section -->
        <div v-if="activeTab === 'liked'" class="mb-8">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div
              v-for="track in likedTracks"
              :key="track.id"
              class="bg-black/70 p-4 rounded-2xl hover:bg-pink-900/30 transition duration-200 ease-in-out transform hover:scale-105 shadow-lg shadow-pink-900/10"
            >
              <div class="relative group">
                <img
                  :src="track?.album?.images?.[0]?.url || require('~/assets/default-album.png')"
                  :alt="track?.name || 'Unknown track'"
                  class="w-full h-40 object-cover mb-2 rounded shadow-lg border-2 border-pink-400"
                />
                <div class="absolute bottom-2 right-2 flex space-x-2">
                  <button
                    @click="toggleLike(track.id)"
                    class="bg-black/70 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-pink-400"
                  >
                    <i class="material-icons text-pink-400">favorite</i>
                  </button>
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

        <!-- Playlists Grid -->
        <div v-if="activeTab === 'playlists'" class="mb-8">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div
              v-for="playlist in userPlaylists"
              :key="playlist.id"
              class="bg-black/70 p-4 rounded-2xl hover:bg-pink-900/30 transition duration-200 ease-in-out transform hover:scale-105 shadow-lg shadow-pink-900/10"
            >
              <div class="relative group">
                <nuxt-link :to="`/playlist/${playlist.id}`" class="block focus:outline-none focus:ring-2 focus:ring-pink-400 rounded">
                  <img
                    :src="playlist?.images?.[0]?.url || require('~/assets/default-album.png')"
                    :alt="playlist?.name || 'Unknown playlist'"
                    class="w-full h-40 object-cover mb-2 rounded shadow-lg border-2 border-pink-400 transition-transform duration-200 group-hover:scale-105"
                  />
                  <h3 class="text-lg font-semibold truncate text-pink-100 text-center mt-2">{{ playlist?.name || 'Unknown playlist' }}</h3>
                </nuxt-link>
                <div class="absolute bottom-2 right-2 flex space-x-2">
                  <button
                    @click="playPlaylist(playlist.uri)"
                    class="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg shadow-pink-500/40"
                  >
                    <i class="material-icons">play_arrow</i>
                  </button>
                </div>
              </div>
              <p class="text-pink-300 text-sm truncate text-center">{{ playlist?.tracks?.total || 0 }} titres</p>
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

        <!-- Create Playlist Modal -->
        <div v-if="showCreatePlaylistModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-black/90 p-6 rounded-2xl w-full max-w-md border border-pink-900 shadow-lg shadow-pink-900/20">
            <h2 class="text-2xl font-bold mb-4 text-pink-300">Créer une nouvelle playlist</h2>
            <form @submit.prevent="createPlaylist">
              <div class="mb-4">
                <label class="block text-pink-200 mb-2">Nom de la playlist</label>
                <input
                  v-model="newPlaylistName"
                  type="text"
                  class="w-full px-4 py-2 bg-black/70 text-white rounded focus:outline-none focus:ring-2 focus:ring-pink-400 border border-pink-400"
                  placeholder="Ma nouvelle playlist"
                  required
                />
              </div>
              <div class="mb-4">
                <label class="block text-pink-200 mb-2">Description</label>
                <textarea
                  v-model="newPlaylistDescription"
                  class="w-full px-4 py-2 bg-black/70 text-white rounded focus:outline-none focus:ring-2 focus:ring-pink-400 border border-pink-400"
                  placeholder="Ajouter une description (optionnel)"
                  rows="3"
                ></textarea>
              </div>
              <div class="flex justify-end space-x-4">
                <button
                  type="button"
                  @click="showCreatePlaylistModal = false"
                  class="px-4 py-2 text-pink-200 hover:text-pink-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  class="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white rounded-full font-bold shadow-lg shadow-pink-500/40"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
    <PlayerBar />
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
      userPlaylists: [],
      likedTracks: [],
      likedTracksIds: new Set(),
      showCreatePlaylistModal: false,
      newPlaylistName: '',
      newPlaylistDescription: '',
      activeTab: 'playlists',
      currentTrack: null,
      isPlaying: false,
      player: null,
      deviceId: null,
      searchQuery: '',
      searchResults: null,
      searchTimeout: null,
      currentTime: 0,
      duration: 0,
      volume: 50,
      isMuted: false,
      previousVolume: 50,
      isPlayerReady: false,
      pendingTrack: null,
      pendingPlaylist: null,
      showAddToPlaylistModal: false,
      selectedTrack: null,
    };
  },
  computed: {
    volumeIcon() {
      if (this.isMuted || this.volume === 0) return 'volume_off';
      if (this.volume < 30) return 'volume_down';
      if (this.volume < 70) return 'volume_up';
      return 'volume_up';
    },
  },
  mounted() {
    this.loadLibrary();
    this.loadLikedTracks();
    this.initializePlayer();
  },
  beforeDestroy() {
    // Clean up event listeners
    this.$root.$off('player-ready', this.handlePlayerReady);
    this.$root.$off('player-not-ready', this.handlePlayerNotReady);
    this.$root.$off('player-state-changed', this.handlePlayerStateChanged);
  },
  methods: {
    ...mapMutations(['setDeviceId']),
    async initializePlayer() {
      const token = localStorage.getItem('spotify_access_token');
      if (!token) {
        console.error('No access token available');
        return;
      }

      // Check if script is already loaded
      if (!window.Spotify) {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
      }

      // Wait for SDK to be ready
      if (!window.Spotify) {
        window.onSpotifyWebPlaybackSDKReady = () => {
          this.setupPlayer(token);
        };
      } else {
        this.setupPlayer(token);
      }
    },

    setupPlayer(token) {
      this.player = new Spotify.Player({
        name: 'Spotify Clone Player',
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      // Error handling
      this.player.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize:', message);
        this.$toast.error('Erreur d\'initialisation du lecteur');
      });

      this.player.addListener('authentication_error', ({ message }) => {
        console.error('Failed to authenticate:', message);
        this.$toast.error('Erreur d\'authentification');
        this.$router.push('/login');
      });

      this.player.addListener('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account:', message);
        this.$toast.error('Erreur de compte Spotify');
      });

      this.player.addListener('playback_error', ({ message }) => {
        console.error('Failed to perform playback:', message);
        this.$toast.error('Erreur de lecture');
      });

      // Playback status updates
      this.player.addListener('player_state_changed', (state) => {
        if (state) {
          const track = state.track_window.current_track;
          this.currentTrack = {
            id: track.id,
            name: track.name,
            artist: track.artists[0]?.name,
            albumCover: track.album.images[0]?.url,
          };
          this.isPlaying = !state.paused;
          this.duration = state.duration / 1000;
          this.currentTime = state.position / 1000;
        }
      });

      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        console.log('Player is ready with device ID:', device_id);
        this.deviceId = device_id;
        this.setDeviceId(device_id);
        localStorage.setItem('spotify_device_id', device_id);
        this.isPlayerReady = true;
        this.$toast.success('Lecteur prêt');
        
        // Play any pending track
        if (this.pendingTrack) {
          this.playTrack(this.pendingTrack);
          this.pendingTrack = null;
        }
      });

      // Not Ready
      this.player.addListener('not_ready', ({ device_id }) => {
        console.log('Player is not ready:', device_id);
        this.isPlayerReady = false;
        this.$toast.error('Lecteur non prêt');
      });

      // Connect to the player
      this.player.connect().then((success) => {
        if (success) {
          console.log('Successfully connected to Spotify!');
        } else {
          console.error('Failed to connect to Spotify');
          this.$toast.error('Échec de la connexion à Spotify');
        }
      });
    },

    async playTrack(uri) {
      try {
        const token = await getValidAccessToken();
        const deviceId = localStorage.getItem('spotify_device_id');
        if (!token || !deviceId) {
          console.error('No token or device ID available');
          this.$toast.error('Le lecteur n\'est pas prêt. Veuillez réessayer.');
          return;
        }

        // First, ensure the device is active
        await this.$axios.$put(
          'https://api.spotify.com/v1/me/player',
          {
            device_ids: [deviceId],
            play: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Then play the track
        console.log('Playing track:', uri);
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

        this.$toast.success('Lecture démarrée');
      } catch (error) {
        console.error('Error playing track:', error);
        this.$toast.error('Erreur lors de la lecture du morceau');
        
        if (error.response?.status === 401) {
          try {
            await getValidAccessToken();
            await this.playTrack(uri);
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            this.$toast.error('Session expirée. Veuillez vous reconnecter.');
            this.$router.push('/login');
          }
        }
      }
    },

    async transferPlayback() {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token || !this.deviceId) return;

        await this.$axios.$put(
          'https://api.spotify.com/v1/me/player',
          {
            device_ids: [this.deviceId],
            play: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Playback transferred to device:', this.deviceId);
      } catch (error) {
        console.error('Error transferring playback:', error.response?.data || error.message);
      }
    },

    async togglePlayback() {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
          console.error('No access token available');
          return;
        }

        if (this.isPlaying) {
          await this.$axios.$put(
            `https://api.spotify.com/v1/me/player/pause?device_id=${this.deviceId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          await this.$axios.$put(
            `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        this.isPlaying = !this.isPlaying;
      } catch (error) {
        console.error('Error toggling playback:', error.response?.data || error.message);
      }
    },

    async previousTrack() {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token || !this.deviceId) return;

        await this.$axios.$post(
          `https://api.spotify.com/v1/me/player/previous?device_id=${this.deviceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error('Error playing previous track:', error.response?.data || error.message);
      }
    },

    async nextTrack() {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token || !this.deviceId) return;

        await this.$axios.$post(
          `https://api.spotify.com/v1/me/player/next?device_id=${this.deviceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error('Error playing next track:', error.response?.data || error.message);
      }
    },

    async toggleLike(trackId) {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
          console.error('No access token available');
          this.$toast.error('Erreur d\'authentification. Veuillez vous reconnecter.');
          this.$router.push('/login');
          return;
        }

        const isLiked = this.isTrackLiked(trackId);
        const method = isLiked ? 'delete' : 'put';

        console.log(`${isLiked ? 'Unliking' : 'Liking'} track:`, trackId);

        // Make the API call to like/unlike the track
        await this.$axios[method](
          'https://api.spotify.com/v1/me/tracks',
          {
            ids: [trackId],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Update the liked tracks Set
        if (isLiked) {
          this.likedTracksIds.delete(trackId);
          // Remove from likedTracks array
          this.likedTracks = this.likedTracks.filter(track => track.id !== trackId);
        } else {
          this.likedTracksIds.add(trackId);
          // Add to likedTracks array if we have the track info
          const track = this.searchResults?.tracks?.items?.find(t => t.id === trackId);
          if (track) {
            this.likedTracks.push(track);
          }
        }

        // Update search results if we're in search view
        if (this.searchResults?.tracks?.items) {
          const trackIndex = this.searchResults.tracks.items.findIndex(t => t.id === trackId);
          if (trackIndex !== -1) {
            this.searchResults.tracks.items[trackIndex].isLiked = !isLiked;
          }
        }

        // Show success message
        this.$toast.success(isLiked ? 'Titre retiré des favoris' : 'Titre ajouté aux favoris');

        // Reload liked tracks to ensure everything is in sync
        await this.loadLikedTracks();
      } catch (error) {
        console.error('Error toggling like:', error);
        this.$toast.error('Erreur lors de la modification des favoris');
        
        // If token expired, try to refresh and retry
        if (error.response?.status === 401) {
          try {
            const newToken = await this.$auth.refreshToken();
            if (newToken) {
              await this.toggleLike(trackId);
            } else {
              this.$router.push('/login');
            }
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            this.$toast.error('Session expirée. Veuillez vous reconnecter.');
            this.$router.push('/login');
          }
        }
      }
    },

    isTrackLiked(trackId) {
      return this.likedTracksIds.has(trackId);
    },

    async loadLibrary() {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
          console.error('No access token available');
          return;
        }

        const playlistsResponse = await this.$axios.$get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 50,
            offset: 0
          },
        });

        if (playlistsResponse && playlistsResponse.items) {
          // Filter out null items and sort by name
          this.userPlaylists = playlistsResponse.items
            .filter(playlist => playlist !== null)
            .sort((a, b) => a.name.localeCompare(b.name));
        }
      } catch (error) {
        console.error('Error loading library:', error);
        if (error.response?.status === 401) {
          try {
            const newToken = await this.$auth.refreshToken();
            if (newToken) {
              await this.loadLibrary();
            } else {
              this.$router.push('/login');
            }
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            this.$toast.error('Session expirée. Veuillez vous reconnecter.');
            this.$router.push('/login');
          }
        }
      }
    },

    async loadLikedTracks() {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
          console.error('No access token available');
          this.$toast.error('Erreur d\'authentification. Veuillez vous reconnecter.');
          this.$router.push('/login');
          return;
        }

        console.log('Loading liked tracks...');
        const response = await this.$axios.$get('https://api.spotify.com/v1/me/tracks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 50,
            market: 'FR'
          },
        });

        if (response && response.items) {
          this.likedTracks = response.items.map(item => item.track).filter(track => track !== null);
          // Update the Set of liked track IDs
          this.likedTracksIds = new Set(this.likedTracks.map(track => track.id));
          console.log('Liked tracks loaded:', this.likedTracks.length);
        }
      } catch (error) {
        console.error('Error loading liked tracks:', error);
        if (error.response?.status === 401) {
          try {
            const newToken = await this.$auth.refreshToken();
            if (newToken) {
              await this.loadLikedTracks();
            } else {
              this.$toast.error('Session expirée. Veuillez vous reconnecter.');
              this.$router.push('/login');
            }
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            this.$toast.error('Session expirée. Veuillez vous reconnecter.');
            this.$router.push('/login');
          }
        }
      }
    },

    async createPlaylist() {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
          console.error('No access token available');
          this.$toast.error('Erreur d\'authentification. Veuillez vous reconnecter.');
          this.$router.push('/login');
          return;
        }

        if (!this.newPlaylistName.trim()) {
          this.$toast.error('Le nom de la playlist est requis');
          return;
        }

        // Get user profile first
        const userResponse = await this.$axios.$get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse || !userResponse.id) {
          throw new Error('Could not get user profile');
        }

        // Create the playlist
        const playlistData = {
          name: this.newPlaylistName.trim(),
          description: this.newPlaylistDescription?.trim() || '',
          public: false,
        };

        const response = await this.$axios.$post(
          `https://api.spotify.com/v1/users/${userResponse.id}/playlists`,
          playlistData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response || !response.id) {
          throw new Error('Failed to create playlist');
        }

        // Add the new playlist to the beginning of the list
        this.userPlaylists = [response, ...this.userPlaylists];
        
        // Reset form and close modal
        this.newPlaylistName = '';
        this.newPlaylistDescription = '';
        this.showCreatePlaylistModal = false;

        // Show success message
        this.$toast.success('Playlist créée avec succès!');

        // Reload the library to ensure everything is in sync
        await this.loadLibrary();
      } catch (error) {
        console.error('Error creating playlist:', error);
        
        let errorMessage = 'Erreur lors de la création de la playlist';
        if (error.response?.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
        this.$toast.error(errorMessage);
        
        // If token expired, try to refresh and retry
        if (error.response?.status === 401) {
          try {
            const newToken = await this.$auth.refreshToken();
            if (newToken) {
              await this.createPlaylist();
            } else {
              this.$router.push('/login');
            }
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            this.$toast.error('Session expirée. Veuillez vous reconnecter.');
            this.$router.push('/login');
          }
        }
      }
    },

    async playPlaylist(uri) {
      if (!this.isPlayerReady) {
        console.log('Player not ready, storing playlist for later:', uri);
        this.pendingPlaylist = uri;
        return;
      }

      try {
        const token = await getValidAccessToken();
        const deviceId = localStorage.getItem('spotify_device_id');
        if (!token || !deviceId) {
          console.error('No token or device ID available');
          return;
        }

        console.log('Playing playlist:', uri);
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
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          try {
            await getValidAccessToken();
            // Retry playing the playlist
            await this.playPlaylist(uri);
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            this.$router.push('/login');
          }
        }
      }
    },

    async handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(async () => {
        if (!this.searchQuery.trim()) {
          this.searchResults = null;
          return;
        }

        try {
          const token = localStorage.getItem('spotify_access_token');
          if (!token) {
            console.error('No access token available');
            return;
          }

          const response = await this.$axios.$get('https://api.spotify.com/v1/search', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              q: this.searchQuery,
              type: 'track,artist,playlist,category',
              limit: 20,
            },
          });

          this.searchResults = response;
        } catch (error) {
          console.error('Error searching:', error.response?.data || error.message);
        }
      }, 300);
    },

    async browseCategory(categoryId) {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
          console.error('No access token available');
          return;
        }

        const response = await this.$axios.$get(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 20,
          },
        });

        this.searchResults = {
          ...this.searchResults,
          playlists: response.playlists,
        };
      } catch (error) {
        console.error('Error browsing category:', error.response?.data || error.message);
      }
    },

    async playArtist(uri) {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
          console.error('No access token available');
          return;
        }

        // First, ensure the device is active
        await this.$axios.$put(
          'https://api.spotify.com/v1/me/player',
          {
            device_ids: [this.deviceId],
            play: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Then play the artist
        await this.$axios.$put(
          `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
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

        console.log('Playing artist:', uri);
      } catch (error) {
        console.error('Error playing artist:', error.response?.data || error.message);
        if (error.response?.status === 404) {
          await this.transferPlayback();
          await this.playArtist(uri);
        }
      }
    },

    formatTime(seconds) {
      if (!seconds) return '0:00';
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    async seekTo(event) {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token || !this.deviceId) return;

        const progressBar = event.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        const position = Math.floor(this.duration * percent);

        await this.$axios.$put(
          `https://api.spotify.com/v1/me/player/seek?position_ms=${position * 1000}&device_id=${this.deviceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.currentTime = position;
      } catch (error) {
        console.error('Error seeking:', error.response?.data || error.message);
      }
    },

    async setVolume() {
      try {
        if (!this.player) return;
        await this.player.setVolume(this.volume / 100);
        this.isMuted = this.volume === 0;
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    },

    toggleMute() {
      if (this.isMuted) {
        this.volume = this.previousVolume;
      } else {
        this.previousVolume = this.volume;
        this.volume = 0;
      }
      this.isMuted = !this.isMuted;
      this.setVolume();
    },

    // Add this method to check if a track is liked in search results
    isTrackLikedInSearch(trackId) {
      return this.likedTracksIds.has(trackId);
    },

    handlePlayerReady(deviceId) {
      console.log('Player is ready in library page:', deviceId);
      this.isPlayerReady = true;
      this.setDeviceId(deviceId);
      
      // Play any pending track/playlist
      if (this.pendingTrack) {
        this.playTrack(this.pendingTrack);
        this.pendingTrack = null;
      } else if (this.pendingPlaylist) {
        this.playPlaylist(this.pendingPlaylist);
        this.pendingPlaylist = null;
      }
    },
    handlePlayerNotReady() {
      console.log('Player is not ready in library page');
      this.isPlayerReady = false;
    },
    handlePlayerStateChanged(state) {
      console.log('Player state changed in library page:', state);
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

.material-icons {
  transition: transform 0.2s ease-in-out;
}

button:hover .material-icons {
  transform: scale(1.1);
}

/* Custom range input styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -5px;
}

input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 2px;
  background: #4a4a4a;
  border-radius: 1px;
}

input[type="range"]::-moz-range-track {
  width: 100%;
  height: 2px;
  background: #4a4a4a;
  border-radius: 1px;
}
</style>
