export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Récupérer les données de la requête
    const { projectId } = req.body;
    const token = req.headers.authorization;

    // Transférer la requête au backend
    const backendResponse = await fetch(
      "https://pjbg-backend.vercel.app/users/toggleFollow",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ projectId }),
      }
    );

    // Récupérer la réponse du backend
    const data = await backendResponse.json();

    // Renvoyer la réponse au client
    return res.status(backendResponse.status).json(data);
  } catch (error) {
    console.error("Erreur proxy API:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
