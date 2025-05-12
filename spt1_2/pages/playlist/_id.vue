<template>
    <div class="flex h-screen bg-gradient-to-br from-black via-[#2d0036] to-[#1a0022] text-white">
      <!-- Barre latérale -->
      <aside class="w-64 bg-gradient-to-b from-black via-[#2d0036] to-[#1a0022] p-4">
        <nuxt-link to="/dashboard" class="text-pink-200 hover:text-pink-400 flex items-center mb-4 font-bold">
          <span class="material-icons mr-2 text-pink-400">arrow_back</span>
          Retour
        </nuxt-link>
      </aside>
  
      <!-- Contenu principal -->
      <main class="flex-1 overflow-y-auto">
        <header class="p-4 bg-black/80 border-b border-pink-900">
          <h1 class="text-2xl font-bold text-pink-200">{{ playlistName }}</h1>
          <p class="text-pink-300">{{ playlistDescription }}</p>
        </header>
  
        <!-- Liste des morceaux -->
        <section class="p-4">
          <div v-if="loading" class="text-center mt-8">
            <svg
              class="animate-spin h-8 w-8 text-pink-300 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
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
            <p class="mt-4 text-pink-300">Chargement des morceaux...</p>
          </div>
  
          <div v-else>
            <div v-if="playlistTracks && playlistTracks.length">
              <div
                v-for="track in playlistTracks"
                :key="track.id"
                class="flex items-center bg-black/70 rounded-2xl p-4 mb-2 shadow-lg shadow-pink-900/10"
              >
                <img
                  :src="track.album?.images?.[0]?.url || require('~/assets/default-album.png')"
                  :alt="track.name"
                  class="w-16 h-16 object-cover rounded mr-4 border-2 border-pink-400"
                />
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-pink-100">{{ track.name }}</h3>
                  <p class="text-pink-300 text-sm">{{ track.artists[0]?.name }}</p>
                </div>
                <button
                  @click="playTrack(track.uri)"
                  class="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full shadow-lg shadow-pink-500/40 hover:from-pink-400 hover:to-purple-400 text-white ml-4"
                >
                  <i class="material-icons">play_arrow</i>
                </button>
              </div>
            </div>
            <div v-else class="text-center text-pink-300 py-8">
              Aucune piste dans cette playlist.
            </div>
          </div>
        </section>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        playlistName: '',
        playlistDescription: '',
        playlistTracks: [],
        loading: true,
      };
    },
    async mounted() {
      this.loading = true;
      const token = localStorage.getItem('spotify_access_token');
      const playlistId = this.$route.params.id;
      try {
        // Get playlist details
        const playlistRes = await this.$axios.$get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.playlistName = playlistRes.name;
        this.playlistDescription = playlistRes.description;
        this.playlistTracks = playlistRes.tracks.items.map(item => item.track).filter(Boolean);
      } catch (error) {
        console.error('Error loading playlist:', error);
        this.playlistName = 'Erreur';
        this.playlistDescription = '';
        this.playlistTracks = [];
      } finally {
        this.loading = false;
      }
    },
    methods: {
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
    },
  };
  </script>
  