<template>
  <div class="flex h-screen bg-black text-white">
    <!-- Barre latérale -->
    <Sidebar />

    <!-- Contenu principal -->
    <main class="flex-1 overflow-y-auto">
      <!-- Search Bar -->
      <div class="p-4 bg-gray-900">
        <div class="relative">
          <input
            v-model="query"
            @keyup.enter="search"
            placeholder="Recherchez des artistes, albums ou morceaux"
            class="w-full px-4 py-2 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span class="absolute right-4 top-2 text-gray-400">
            <i class="material-icons">search</i>
          </span>
        </div>
      </div>

      <!-- Categories Section -->
      <div v-if="!query" class="p-8">
        <h2 class="text-2xl font-bold mb-6">Parcourir tout</h2>
        <div v-if="categoriesLoading" class="text-center py-8">
          <p class="text-gray-400">Chargement des catégories...</p>
        </div>
        <div v-else-if="categories.length === 0" class="text-center py-8">
          <p class="text-gray-400">Aucune catégorie trouvée</p>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div
            v-for="category in categories"
            :key="category.id"
            class="relative group cursor-pointer"
            @click="browseCategory(category.id)"
          >
            <img
              :src="category.icons[0]?.url"
              :alt="category.name"
              class="w-full h-40 object-cover rounded-lg shadow-lg"
            />
            <div class="absolute inset-0 bg-black bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-all duration-200">
              <h3 class="absolute bottom-4 left-4 text-xl font-bold">{{ category.name }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="results && results.length" class="p-8">
        <div v-for="(item, index) in results" :key="item.id + '-' + index" class="result">
          <p>{{ item.name }}</p>
          <p v-if="item.artists">Artiste : {{ item.artists[0]?.name }}</p>
          <button @click="playTrack(item.uri)">Lire</button>
        </div>
      </div>

      <!-- No results message -->
      <div v-else-if="results.length === 0 && !loading" class="p-8 text-center text-gray-400">
        Aucun résultat trouvé pour "{{ query }}"
      </div>

      <!-- Loading message -->
      <div v-else-if="loading" class="p-8 text-center text-gray-400">
        Recherche en cours...
      </div>

      <!-- Player Bar -->
      <PlayerBar />
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Sidebar from '~/components/Sidebar.vue';
import PlayerBar from '~/components/PlayerBar.vue';

export default {
  components: {
    Sidebar,
    PlayerBar,
  },
  data() {
    return {
      query: '',
      results: [],
      loading: false,
      categories: [],
      categoriesLoading: false,
    };
  },
  computed: {
    ...mapGetters(['getDeviceId']),
  },
  async mounted() {
    this.categoriesLoading = true;
    try {
      await this.loadCategories();
    } catch (error) {
      console.error('Error in mounted:', error);
    } finally {
      this.categoriesLoading = false;
    }
  },
  methods: {
    async loadCategories() {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
          console.error('Token non trouvé : redirection vers la connexion.');
          this.$router.push('/login');
          return;
        }

        const response = await this.$axios.$get(
          'https://api.spotify.com/v1/browse/categories',
          {
            params: { 
              limit: 20,
              country: 'FR',  // Ajout du paramètre de pays
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response && response.categories && response.categories.items) {
          this.categories = response.categories.items;
        } else {
          console.error('Format de réponse invalide:', response);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        this.$toast.error('Erreur lors du chargement des catégories');
      }
    },
    async browseCategory(categoryId) {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
          console.error('Token non trouvé : redirection vers la connexion.');
          this.$router.push('/login');
          return;
        }

        const response = await this.$axios.$get(
          `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`,
          {
            params: { limit: 20 },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.results = response.playlists.items;
      } catch (error) {
        console.error('Erreur lors du chargement des playlists de la catégorie :', error);
      }
    },
    async search() {
      if (!this.query.trim()) {
        this.results = [];
        return;
      }

      this.loading = true;
      this.results = []; // Réinitialiser les résultats

      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
          console.error('Token non trouvé : redirection vers la connexion.');
          this.$router.push('/login');
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

        if (response && response.tracks && response.tracks.items) {
          this.results = response.tracks.items;
        } else {
          console.error('Aucun résultat trouvé pour la recherche.');
        }
      } catch (error) {
        console.error('Erreur lors de la recherche :', error);
      } finally {
        this.loading = false;
      }
    },
    async playTrack(uri) {
      try {
        const token = localStorage.getItem('spotify_access_token');
        const deviceId = this.getDeviceId;

        if (!deviceId) {
          console.error("Device ID non disponible. Le lecteur n'est pas prêt.");
          return;
        }

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

        console.log(`Lecture démarrée pour ${uri}`);
      } catch (error) {
        console.error('Erreur lors de la lecture du morceau :', error);
      }
    },
  },
};
</script>

<style scoped>
.result {
  @apply bg-gray-800 p-4 rounded-lg mb-4 hover:bg-gray-700 transition duration-200;
}

.result button {
  @apply bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded-full mt-2;
}

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
