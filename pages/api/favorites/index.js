// API route pour ajouter un favori
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { username, gameStyle } = req.body;

      // Appeler l'API backend
      const response = await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, gameStyle }),
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
