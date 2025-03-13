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


    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const cookieValue = parts.pop().split(";").shift();

      return cookieValue;
    }

    return null;
  };

  useEffect(() => {

    // Récupérer les paramètres de redirection après authentification
    const { auth, username, provider, timestamp } = router.query;

    // Nettoyer les paramètres de l'URL après traitement
    const cleanUrl = () => {
      router.replace("/", undefined, { shallow: true });
    };

    // Si authentification réussie
    if (auth === "success" && username) {

      // Récupérer les données des cookies
      const authToken = getCookie("auth_token");
      const redditUserCookie = getCookie("reddit_user");

      let redditUser = null;
      if (redditUserCookie) {
        try {
          redditUser = JSON.parse(decodeURIComponent(redditUserCookie));
        } catch (e) {
          console.error("Erreur lors du parsing des données Reddit:", e);
        }
      }

      if (authToken) {

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

        // Si c'est Reddit, créer également une entrée dans localStorage
        if (provider === "reddit" && redditUser) {
          localStorage.setItem("redditUser", JSON.stringify(redditUser));
          localStorage.setItem("authToken", authToken);

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
