<template>
  <div class="flex h-screen bg-black">
    <Sidebar />
    <main class="flex-1 overflow-y-auto">
      <!-- Search Bar -->
      <div class="p-4 bg-gray-900">
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Rechercher des artistes, des chansons ou des playlists..."
            class="w-full px-4 py-2 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span class="absolute right-4 top-2 text-gray-400">
            <i class="material-icons">search</i>
          </span>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchResults" class="p-8">
        <h2 class="text-2xl font-bold mb-4">Résultats de recherche</h2>
        
        <!-- Artists -->
        <div v-if="searchResults.artists?.items.length" class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Artistes</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div
              v-for="artist in searchResults.artists.items"
              :key="artist.id"
              class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105"
            >
              <img
                :src="artist.images[0]?.url || require('~/assets/default-album.png')"
                :alt="artist.name"
                class="w-full h-40 object-cover mb-2 rounded-full"
              />
              <h3 class="text-lg font-semibold text-center">{{ artist.name }}</h3>
              <p class="text-gray-400 text-sm text-center">Artiste</p>
            </div>
          </div>
        </div>

        <!-- Tracks -->
        <div v-if="searchResults.tracks?.items.length" class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Chansons</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div
              v-for="track in searchResults.tracks.items"
              :key="track.id"
              class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105"
            >
              <img
                :src="track.album.images[0]?.url || require('~/assets/default-album.png')"
                :alt="track.name"
                class="w-full h-40 object-cover mb-2 rounded"
              />
              <h3 class="text-lg font-semibold">{{ track.name }}</h3>
              <p class="text-gray-400 text-sm">{{ track.artists[0]?.name }}</p>
              <button
                @click="playTrack(track.uri)"
                class="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                :disabled="!isPlayerReady"
              >
                {{ isPlayerReady ? 'Écouter' : 'Chargement...' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Playlists -->
        <div v-if="searchResults.playlists?.items.length" class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Playlists</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div
              v-for="playlist in searchResults.playlists.items"
              :key="playlist.id"
              class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105"
            >
              <img
                :src="playlist.images[0]?.url || require('~/assets/default-album.png')"
                :alt="playlist.name"
                class="w-full h-40 object-cover mb-2 rounded"
              />
              <h3 class="text-lg font-semibold">{{ playlist.name }}</h3>
              <p class="text-gray-400 text-sm">Par {{ playlist.owner.display_name }}</p>
              <button
                @click="playPlaylist(playlist.uri)"
                class="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                :disabled="!isPlayerReady"
              >
                {{ isPlayerReady ? 'Écouter' : 'Chargement...' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    <PlayerBar 
      @player-ready="handlePlayerReady"
      @player-not-ready="handlePlayerNotReady"
      @player-state-changed="handlePlayerStateChanged"
    />
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
      searchQuery: '',
      searchResults: null,
      loading: false,
      isPlayerReady: false,
      pendingTrack: null,
      pendingPlaylist: null,
    };
  },
  methods: {
    ...mapMutations(['setDeviceId']),
    
    handlePlayerReady(deviceId) {
      console.log('Player is ready in search page:', deviceId);
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
      console.log('Player is not ready in search page');
      this.isPlayerReady = false;
    },
    
    handlePlayerStateChanged(state) {
      console.log('Player state changed in search page:', state);
    },
    
    async search() {
      if (!this.searchQuery.trim()) {
        this.searchResults = null;
        return;
      }

      this.loading = true;
      try {
        const token = await getValidAccessToken();
        if (!token) return;

        const response = await this.$axios.$get(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(this.searchQuery)}&type=track,artist,album,playlist&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.searchResults = response;
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async playTrack(uri) {
      if (!this.isPlayerReady) {
        console.log('Player not ready, storing track for later:', uri);
        this.pendingTrack = uri;
        return;
      }

      try {
        const token = await getValidAccessToken();
        const deviceId = this.$store.getters.getDeviceId;
        if (!token || !deviceId) {
          console.error('No token or device ID available');
          return;
        }

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
      } catch (error) {
        console.error('Error playing track:', error);
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
        const deviceId = this.$store.getters.getDeviceId;
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
      }
    },

    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        console.log('Searching for:', this.searchQuery);
        this.search();
      }, 300);
    },
  },
  
  beforeDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  },
};
</script>
