import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { addUserToStore } from "../reducers/user";

export default function AuthHandler() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Fonction pour lire les cookies
  const getCookie = (name) => {
    if (typeof document === "undefined") return null;

    console.log("Recherche du cookie:", name);
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const cookieValue = parts.pop().split(";").shift();
      console.log(
        `Cookie ${name} trouvé:`,
        cookieValue.substring(0, 20) + "..."
      );
      return cookieValue;
    }

    console.log(`Cookie ${name} non trouvé`);
    return null;
  };

  useEffect(() => {
    console.log("AuthHandler: Vérification des paramètres d'URL", router.query);

    // Récupérer les paramètres de redirection après authentification
    const { auth, username, provider, timestamp } = router.query;

    // Nettoyer les paramètres de l'URL après traitement
    const cleanUrl = () => {
      console.log("Nettoyage de l'URL");
      router.replace("/", undefined, { shallow: true });
    };

    // Si authentification réussie
    if (auth === "success" && username) {
      console.log(
        "AuthHandler: Authentification réussie pour",
        username,
        "via",
        provider
      );

      // Récupérer les données des cookies
      const authToken = getCookie("auth_token");
      const redditUserCookie = getCookie("reddit_user");

      let redditUser = null;
      if (redditUserCookie) {
        try {
          redditUser = JSON.parse(decodeURIComponent(redditUserCookie));
          console.log("Données Reddit récupérées du cookie:", redditUser.name);
        } catch (e) {
          console.error("Erreur lors du parsing des données Reddit:", e);
        }
      }

      if (authToken) {
        console.log("Token d'authentification trouvé, mise à jour du store");

        // Créer des données utilisateur
        const userData = {
          token: authToken,
          username: username,
          email: provider === "reddit" ? `${username}@reddit.user` : username,
          name: username,
          surname: "",
          role: "patron",
          authType: provider || "reddit",
          isAuthenticated: true,
          timestamp: timestamp || Date.now(),
        };

        // Mettre à jour Redux
        dispatch(addUserToStore(userData));
        console.log("Store Redux mis à jour avec:", userData.username);

        // Si c'est Reddit, créer également une entrée dans localStorage
        if (provider === "reddit" && redditUser) {
          localStorage.setItem("redditUser", JSON.stringify(redditUser));
          localStorage.setItem("authToken", authToken);
          console.log("Données Reddit stockées dans localStorage");
        }
      } else {
        console.log("Aucun token trouvé dans les cookies");
      }

      // Nettoyer l'URL
      cleanUrl();
    }
    // Si erreur d'authentification
    else if (auth === "error") {
      console.error("Erreur d'authentification:", router.query.message);
      cleanUrl();
    }
  }, [router.query, dispatch, router]);

  // Ce composant ne rend rien visuellement
  return null;
}
