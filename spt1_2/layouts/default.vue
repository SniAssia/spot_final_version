<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
export default {
  head() {
    return {
      script: [
        {
          src: 'https://sdk.scdn.co/spotify-player.js',
          async: true,
        },
      ],
    };
  },
  mounted() {
    // Définir onSpotifyWebPlaybackSDKReady
    if (!window.onSpotifyWebPlaybackSDKReady) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log('Spotify SDK chargé avec succès.');
      };
    }
  },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
  