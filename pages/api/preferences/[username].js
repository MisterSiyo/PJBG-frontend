// API route pour gérer les préférences d'un utilisateur spécifique
export default async function handler(req, res) {
  const { username } = req.query;

  if (req.method === "GET") {
    try {
      // Appeler l'API backend pour récupérer les préférences
      const response = await fetch(
        `http://localhost:5000/api/preferences/${username}`
      );
      const data = await response.json();

      return res.status(response.status).json(data);
    } catch (error) {
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
