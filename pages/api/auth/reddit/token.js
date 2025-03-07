import axios from "axios";

export default async function handler(req, res) {
  console.log("📥 API /auth/reddit/token - Requête reçue:", req.method);

  if (req.method !== "POST") {
    console.log(
      "❌ API /auth/reddit/token - Méthode non autorisée:",
      req.method
    );
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;
  console.log(
    "🔍 API /auth/reddit/token - Code reçu:",
    code ? code.substring(0, 10) + "..." : "absent"
  );

  if (!code) {
    console.log("❌ API /auth/reddit/token - Code manquant");
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    // Utiliser les identifiants exacts fournis par l'utilisateur
    const CLIENT_ID = "V4QqtDuthlwC3k45bRxPZQ";
    const CLIENT_SECRET = "_wDYyJZf0XOVgydr37FquuMepjhXrw";
    const REDIRECT_URI = "http://localhost:3001/api/auth/reddit/callback";

    console.log("🔄 API /auth/reddit/token - Configuration:", {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
    });

    // Construire l'URL encodée correctement
    const encodedRedirectUri = encodeURIComponent(REDIRECT_URI);
    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodedRedirectUri}`;

    console.log("🔄 API /auth/reddit/token - Appel à Reddit avec body:", body);

    // Échanger le code contre un token
    const tokenResponse = await axios
      .post("https://www.reddit.com/api/v1/access_token", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`
          ).toString("base64")}`,
          "User-Agent": "PJBG/1.0.0 (by /u/username)", // Reddit exige un User-Agent valide
        },
      })
      .catch((error) => {
        console.error(
          "❌ API /auth/reddit/token - Erreur lors de l'échange de code:",
          error.response?.data || error.message
        );
        throw error;
      });

    console.log(
      "✅ API /auth/reddit/token - Réponse de l'API Reddit:",
      tokenResponse.data
    );
    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    console.log(
      "✅ API /auth/reddit/token - Token obtenu:",
      access_token.substring(0, 10) + "..."
    );

    // Récupérer les informations de l'utilisateur
    console.log(
      "🔄 API /auth/reddit/token - Récupération des infos utilisateur"
    );
    const userResponse = await axios
      .get("https://oauth.reddit.com/api/v1/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "User-Agent": "PJBG/1.0.0 (by /u/username)", // Reddit exige un User-Agent valide
        },
      })
      .catch((error) => {
        console.error(
          "❌ API /auth/reddit/token - Erreur lors de la récupération des infos utilisateur:",
          error.response?.data || error.message
        );
        throw error;
      });

    console.log(
      "✅ API /auth/reddit/token - Infos utilisateur récupérées:",
      userResponse.data.name
    );

    // Préparer la réponse
    const response = {
      user: userResponse.data,
      token: {
        access_token,
        refresh_token,
        expires_in,
      },
    };

    console.log("📤 API /auth/reddit/token - Envoi de la réponse au client");
    return res.status(200).json(response);
  } catch (error) {
    console.error(
      "❌ API /auth/reddit/token - Erreur globale:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      error: "Erreur lors de l'authentification Reddit",
      details: error.response?.data || error.message,
      message: error.message,
    });
  }
}
