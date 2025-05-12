<template>
  <aside class="w-64 bg-gradient-to-b from-black via-[#2d0036] to-[#1a0022] p-4 min-h-screen shadow-2xl border-r border-pink-900">
    <div class="mb-8">
      <img src="../assets/logo-spotify.png" alt="Spotify Logo" class="h-16 mx-auto drop-shadow-lg" />
    </div>
    <!-- Menu de navigation -->
    <nav>
      <ul>
        <li class="mb-4">
          <nuxt-link
            to="/"
            exact
            class="flex items-center text-pink-200 hover:text-pink-400 font-bold transition-colors duration-200"
            active-class="text-pink-400"
          >
            <span class="material-icons mr-4 text-pink-400">home</span>
            Accueil
          </nuxt-link>
        </li>
        <li class="mb-4">
          <nuxt-link
            to="/dashboard"
            class="flex items-center text-pink-200 hover:text-pink-400 font-bold transition-colors duration-200"
            active-class="text-pink-400"
          >
            <span class="material-icons mr-4 text-pink-400">search</span>
            Rechercher
          </nuxt-link>
        </li>
        <li class="mb-4">
          <nuxt-link
            to="/library"
            class="flex items-center text-pink-200 hover:text-pink-400 font-bold transition-colors duration-200"
            active-class="text-pink-400"
          >
            <span class="material-icons mr-4 text-pink-400">library_music</span>
            Votre Bibliothèque
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
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
  transition: color 0.2s;
}

.nuxt-link-exact-active {
  color:  #72c0f4 !important; /* pink-400 */
}
</style>
  