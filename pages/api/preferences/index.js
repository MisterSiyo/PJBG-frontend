// API route pour gérer les préférences
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { username, preferences } = req.body;
      // Utiliser username comme ID utilisateur
      const userId = username;

      // Appeler l'API backend
      const response = await fetch("http://localhost:5000/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userId,
          preferences,
        }),
      });

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
