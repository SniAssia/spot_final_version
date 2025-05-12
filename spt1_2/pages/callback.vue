<template>
  <div class="min-h-screen flex items-center justify-center bg-black">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-white mb-4">Connexion en cours...</h1>
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
    </div>
  </div>
</template>

<script>
export default {
  async mounted() {
  const code = this.$route.query.code;

  if (!code) {
    console.error("Code d'autorisation manquant.");
    this.$toast.error("Erreur d'authentification. Veuillez réessayer.");
    this.$router.push('/login');
    return;
  }

  console.log("Code d'autorisation reçu:", code);

  try {
    // Envoi de la requête POST pour récupérer le token
    const response = await this.$axios.$post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://d614-41-137-204-12.ngrok-free.app/callback', // Assurez-vous que c'est la même que dans le Dashboard
        client_id: '637ca364d801495da5109a9936b99211',
        client_secret: '46eeab5d0eda4810955feeb0a159b537',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Afficher la réponse complète pour vérifier la structure de l'objet
    console.log('Réponse Spotify:', response);

    // Vérification de la structure de la réponse
    if (response && response.access_token) {
      // Enregistrer les tokens dans localStorage
      localStorage.setItem('spotify_access_token', response.access_token);
      localStorage.setItem('spotify_refresh_token', response.refresh_token);
      localStorage.setItem('spotify_token_expires_at', Date.now() + (response.expires_in * 1000));

      // Rediriger vers le tableau de bord
      this.$router.push('/dashboard');
    } else {
      // Si pas de token d'accès dans la réponse, afficher une erreur
      console.error("Token d'accès manquant dans la réponse.");
      this.$toast.error("Erreur d'authentification. Aucun token reçu.");
      this.$router.push('/login');
    }

  } catch (error) {
    console.error("Erreur lors de l'échange du token :", error.response?.data || error.message);
    this.$toast.error("Erreur lors de l'authentification. Veuillez réessayer.");
    this.$router.push('/login');
  }
}

};
</script>
