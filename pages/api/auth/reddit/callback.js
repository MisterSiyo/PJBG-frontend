import axios from "axios";

// Endpoint pour gérer le callback de l'authentification Reddit
export default async function handler(req, res) {
  try {
    const { code, state } = req.query;
    console.log("Callback Reddit appelé avec paramètres:", {
      code: code ? "présent" : "absent",
      state,
      url: req.url,
    });

    if (!code) {
      console.error("Code d'autorisation manquant dans la requête");
      return res.redirect("/?auth=error&message=Code%20manquant");
    }

    console.log("Code d'autorisation Reddit reçu dans le callback");

    // Utiliser les identifiants exacts fournis par l'utilisateur
    const CLIENT_ID = "V4QqtDuthlwC3k45bRxPZQ";
    const CLIENT_SECRET = "_wDYyJZf0XOVgydr37FquuMepjhXrw";
    const REDIRECT_URI = "http://localhost:3001/api/auth/reddit/callback";
    const BASE_URL = "http://localhost:3001";

    // Échange du code contre un token d'accès
    const tokenResponse = await fetch(
      "https://www.reddit.com/api/v1/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`
          ).toString("base64")}`,
          "User-Agent": "PJBG/1.0.0 (by /u/username)", // Reddit exige un User-Agent valide
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: REDIRECT_URI,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Erreur d'échange de token:", tokenData.error);
      res.redirect(
        `/?auth=error&message=${encodeURIComponent(tokenData.error)}`
      );
      return;
    }

    console.log("Token d'accès Reddit obtenu avec succès dans le callback");

    // Récupérer les informations de l'utilisateur Reddit
    const userResponse = await fetch("https://oauth.reddit.com/api/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "User-Agent": "PJBG/1.0.0 (by /u/username)", // Reddit exige un User-Agent valide
      },
    });

    const redditUserData = await userResponse.json();
    console.log("Informations utilisateur Reddit récupérées:", {
      username: redditUserData.name,
      id: redditUserData.id,
      karma: redditUserData.total_karma || 0,
    });

    // Stocker les données dans un cookie httpOnly
    res.setHeader("Set-Cookie", [
      `auth_token=${tokenData.access_token}; Path=/; HttpOnly; Max-Age=3600; SameSite=Strict`,
      `reddit_user=${encodeURIComponent(
        JSON.stringify({
          name: redditUserData.name,
          icon_img: redditUserData.icon_img || "",
          total_karma: redditUserData.total_karma || 0,
        })
      )}; Path=/; Max-Age=3600; SameSite=Strict`,
    ]);

    // Créer l'URL de redirection avec les paramètres
    const redirectUrl = `${BASE_URL}/?auth=success&username=${
      redditUserData.name
    }&provider=reddit&timestamp=${Date.now()}`;
    console.log("Redirection vers:", redirectUrl);

    // Attention à ne pas renvoyer de valeur avec res.redirect()
    res.redirect(redirectUrl);
    return;
  } catch (error) {
    console.error("Erreur lors de l'authentification Reddit:", error);
    // Éviter de renvoyer une valeur
    res.redirect(
      `/?auth=error&message=${encodeURIComponent(
        error.message || "Erreur inconnue"
      )}`
    );
    return;
  }
}
