<template>
  <div class="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-black via-[#2d0036] to-[#1a0022] p-4 flex items-center border-t border-pink-900 shadow-2xl">
    <!-- Left section: Track info and like button -->
    <div class="flex items-center w-1/3">
      <img
        v-if="currentTrack"
        :src="currentTrack.albumCover || require('~/assets/default-album.png')"
        :alt="currentTrack.name"
        class="w-16 h-16 object-cover mr-4 rounded shadow-lg border-2 border-pink-400"
      />
      <div v-if="currentTrack" class="flex-1">
        <p class="text-pink-100 font-semibold">{{ currentTrack.name }}</p>
        <p class="text-pink-300">{{ currentTrack.artist }}</p>
      </div>
      <button 
        v-if="currentTrack"
        @click="toggleLike(currentTrack.id)" 
        class="text-pink-400 hover:text-pink-200 transition-colors duration-200 ml-4"
        :class="{ 'text-pink-500': isTrackLiked(currentTrack.id) }"
      >
        <i class="material-icons">{{ isTrackLiked(currentTrack.id) ? 'favorite' : 'favorite_border' }}</i>
      </button>
      <div v-else class="text-pink-300">
        Aucune piste en cours de lecture
      </div>
    </div>

    <!-- Center section: Playback controls -->
    <div class="flex flex-col items-center w-1/3">
      <div class="flex items-center space-x-4 mb-2">
        <button @click="previousTrack" class="text-pink-300 hover:text-pink-100 transition-colors duration-200">
          <i class="material-icons">skip_previous</i>
        </button>
        <button @click="togglePlayback" class="text-pink-100 hover:text-pink-400 transition-colors duration-200">
          <i class="material-icons text-3xl">{{ isPlaying ? 'pause_circle_filled' : 'play_circle_filled' }}</i>
        </button>
        <button @click="nextTrack" class="text-pink-300 hover:text-pink-100 transition-colors duration-200">
          <i class="material-icons">skip_next</i>
        </button>
      </div>
      <!-- Progress bar -->
      <div class="w-full flex items-center space-x-2">
        <span class="text-xs text-pink-300">{{ formatTime(currentTime) }}</span>
        <div class="flex-1 h-1 bg-pink-900 rounded-full cursor-pointer" @click="seekTo">
          <div 
            class="h-full bg-pink-400 rounded-full" 
            :style="{ width: `${(currentTime / duration) * 100}%` }"
          ></div>
        </div>
        <span class="text-xs text-pink-300">{{ formatTime(duration) }}</span>
      </div>
    </div>

    <!-- Right section: Volume control -->
    <div class="flex items-center justify-end w-1/3 space-x-4">
      <button @click="toggleMute" class="text-pink-300 hover:text-pink-100 transition-colors duration-200">
        <i class="material-icons">{{ volumeIcon }}</i>
      </button>
      <div class="flex items-center space-x-2 w-32">
        <input
          type="range"
          v-model="volume"
          min="0"
          max="100"
          @input="setVolume"
          class="w-full h-1 bg-pink-900 rounded-full appearance-none cursor-pointer accent-pink-400"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { getValidAccessToken } from '~/utils/auth';

export default {
  name: 'PlayerBar',
  data() {
    return {
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 50,
      isMuted: false,
      previousVolume: 50,
      likedTracksIds: new Set(),
      player: null,
      isPlayerReady: false,
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
    this.loadLikedTracks();
    this.initializePlayer();
  },
  beforeDestroy() {
    if (this.player) {
      this.player.disconnect();
    }
  },
  methods: {
    ...mapMutations(['setDeviceId']),
    async loadLikedTracks() {
      try {
        const token = await getValidAccessToken();
        if (!token) return;

        const response = await this.$axios.$get('https://api.spotify.com/v1/me/tracks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.likedTracksIds = new Set(response.items.map(item => item.track.id));
      } catch (error) {
        console.error('Error loading liked tracks:', error);
      }
    },
    async initializePlayer() {
      try {
        const token = await getValidAccessToken();
        if (!token) {
          console.error('No access token found');
          return;
        }

        console.log('Initializing Spotify player...');

        // Load Spotify Web Playback SDK if not already loaded
        if (!window.Spotify) {
          console.log('Loading Spotify Web Playback SDK...');
          const script = document.createElement('script');
          script.src = 'https://sdk.scdn.co/spotify-player.js';
          script.async = true;
          document.body.appendChild(script);

          window.onSpotifyWebPlaybackSDKReady = () => {
            console.log('Spotify Web Playback SDK ready');
            this.setupPlayer(token);
          };
        } else {
          console.log('Spotify Web Playback SDK already loaded');
          this.setupPlayer(token);
        }
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    },
    setupPlayer(token) {
      console.log('Setting up Spotify player...');
      this.player = new Spotify.Player({
        name: 'Spotify Clone Player',
        getOAuthToken: async (cb) => {
          try {
            console.log('Getting OAuth token...');
            const newToken = await getValidAccessToken();
            cb(newToken);
          } catch (error) {
            console.error('Error getting OAuth token:', error);
            this.$router.push('/login');
          }
        },
        volume: 0.5,
      });

      // Error handling
      this.player.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize:', message);
      });

      this.player.addListener('authentication_error', async ({ message }) => {
        console.error('Failed to authenticate:', message);
        try {
          await getValidAccessToken();
        } catch (error) {
          console.error('Error refreshing token:', error);
          this.$router.push('/login');
        }
      });

      this.player.addListener('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account:', message);
      });

      this.player.addListener('playback_error', ({ message }) => {
        console.error('Failed to perform playback:', message);
      });

      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        console.log('Player is ready with device ID:', device_id);
        this.setDeviceId(device_id);
        localStorage.setItem('spotify_device_id', device_id);
        this.isPlayerReady = true;
        this.$emit('player-ready', device_id);
      });

      // Not Ready
      this.player.addListener('not_ready', ({ device_id }) => {
        console.log('Player is not ready:', device_id);
        this.isPlayerReady = false;
        this.$emit('player-not-ready');
      });

      // Playback status updates
      this.player.addListener('player_state_changed', (state) => {
        console.log('Player state changed:', state);
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
          this.$emit('player-state-changed', state);
        } else {
          console.log('No player state available');
          this.currentTrack = null;
          this.isPlaying = false;
          this.$emit('player-state-changed', null);
        }
      });

      // Connect to the player
      console.log('Connecting to Spotify...');
      this.player.connect().then((success) => {
        if (success) {
          console.log('Successfully connected to Spotify!');
        } else {
          console.error('Failed to connect to Spotify');
        }
      }).catch(error => {
        console.error('Error connecting to Spotify:', error);
      });
    },
    async togglePlayback() {
      if (!this.isPlayerReady) {
        console.log('Player not ready yet');
        return;
      }

      try {
        const token = await getValidAccessToken();
        const deviceId = localStorage.getItem('spotify_device_id');
        if (!token || !deviceId) return;

        if (this.isPlaying) {
          await this.$axios.$put(
            `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          await this.$axios.$put(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } catch (error) {
        console.error('Error toggling playback:', error);
      }
    },
    async previousTrack() {
      if (!this.isPlayerReady) {
        console.log('Player not ready yet');
        return;
      }

      try {
        const token = await getValidAccessToken();
        const deviceId = localStorage.getItem('spotify_device_id');
        if (!token || !deviceId) return;

        await this.$axios.$post(
          `https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error('Error playing previous track:', error);
      }
    },
    async nextTrack() {
      if (!this.isPlayerReady) {
        console.log('Player not ready yet');
        return;
      }

      try {
        const token = await getValidAccessToken();
        const deviceId = localStorage.getItem('spotify_device_id');
        if (!token || !deviceId) return;

        await this.$axios.$post(
          `https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error('Error playing next track:', error);
      }
    },
    async seekTo(event) {
      if (!this.isPlayerReady) {
        console.log('Player not ready yet');
        return;
      }

      try {
        const token = await getValidAccessToken();
        const deviceId = localStorage.getItem('spotify_device_id');
        if (!token || !deviceId) return;

        const progressBar = event.currentTarget;
        const clickPosition = event.offsetX;
        const progressBarWidth = progressBar.offsetWidth;
        const seekPercentage = clickPosition / progressBarWidth;
        const seekTime = Math.floor(this.duration * seekPercentage);

        await this.$axios.$put(
          `https://api.spotify.com/v1/me/player/seek?position_ms=${seekTime * 1000}&device_id=${deviceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error('Error seeking:', error);
      }
    },
    async setVolume() {
      if (!this.isPlayerReady) {
        console.log('Player not ready yet');
        return;
      }

      try {
        const token = await getValidAccessToken();
        const deviceId = localStorage.getItem('spotify_device_id');
        if (!token || !deviceId) return;

        await this.$axios.$put(
          `https://api.spotify.com/v1/me/player/volume?volume_percent=${this.volume}&device_id=${deviceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    },
    toggleMute() {
      if (this.isMuted) {
        this.volume = this.previousVolume;
        this.isMuted = false;
      } else {
        this.previousVolume = this.volume;
        this.volume = 0;
        this.isMuted = true;
      }
      this.setVolume();
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    isTrackLiked(trackId) {
      return this.likedTracksIds.has(trackId);
    },
    async toggleLike(trackId) {
      try {
        const token = await getValidAccessToken();
        if (!token) return;

        if (this.isTrackLiked(trackId)) {
          await this.$axios.$delete(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.likedTracksIds.delete(trackId);
        } else {
          await this.$axios.$put(
            `https://api.spotify.com/v1/me/tracks?ids=${trackId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          this.likedTracksIds.add(trackId);
        }
      } catch (error) {
        console.error('Error toggling like:', error);
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
  background:  #72c0f4;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -4px;
  box-shadow: 0 0 6px #72c0f4;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  background:  #72c0f4;
  border-radius: 2px;
}

input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background:  #72c0f4;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 6px #72c0f4;
}

input[type="range"]::-moz-range-track {
  width: 100%;
  height: 4px;
  background: #72c0f4;
  border-radius: 2px;
}
</style> 