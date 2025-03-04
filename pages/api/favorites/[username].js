// API route pour gérer les favoris d'un utilisateur spécifique
export default async function handler(req, res) {
  const { username } = req.query;
  // Utiliser username comme ID utilisateur
  const userId = username;

  console.log(`API route called: ${req.method} /api/favorites/${username}`);

  if (req.method === "GET") {
    try {
      // Appeler l'API backend pour récupérer les favoris
      console.log(`Fetching favorites for user: ${userId}`);
      const response = await fetch(
        `http://localhost:5000/api/favorites/${userId}`
      );
      const data = await response.json();
      console.log("Backend response:", data);

      return res.status(response.status).json(data);
    } catch (error) {
      console.error("Error in GET /api/favorites/[username]:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else if (req.method === "POST") {
    try {
      const { preferences } = req.body;
      console.log(`Saving favorites for user: ${userId}`, preferences);

      // Appeler l'API backend pour mettre à jour les favoris
      const response = await fetch(
        `http://localhost:5000/api/favorites/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ preferences }),
        }
      );

      const data = await response.json();
      console.log("Backend response:", data);

      return res.status(response.status).json(data);
    } catch (error) {
      console.error("Error in POST /api/favorites/[username]:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }
}
