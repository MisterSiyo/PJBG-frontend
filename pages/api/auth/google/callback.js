import axios from "axios";

export default async function handler(req, res) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Code d'autorisation manquant" });
    }

    // Échange du code contre un token d'accès
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error });
    }

    // Récupérer les informations de l'utilisateur Google
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const googleUserData = await userResponse.json();

    // Préparer les données utilisateur pour l'enregistrement en BDD
    const userData = {
      googleId: googleUserData.id,
      email: googleUserData.email,
      name: googleUserData.name,
      firstName: googleUserData.given_name,
      lastName: googleUserData.family_name,
      picture: googleUserData.picture,
    };

    // Envoyer les données au backend pour enregistrement/connexion
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/google-auth`,
        userData
      );

      if (response.data && response.data.token) {
        // Stocker le token dans un cookie
        res.setHeader(
          "Set-Cookie",
          `auth_token=${response.data.token}; Path=/; HttpOnly; Max-Age=604800`
        );

        // Rediriger vers la page d'accueil avec succès
        return res.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL}/?auth=success&username=${
            userData.email.split("@")[0]
          }`
        );
      } else {
        return res.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL}/?auth=error&message=no_token`
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
      return res.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/?auth=error&message=database_error`
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'authentification Google:", error);
    return res.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/?auth=error&message=google_error`
    );
  }
}
