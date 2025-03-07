import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserToStore, removeUserFromStore } from "../reducers/user";

/**
 * Hook personnalisé pour gérer l'authentification des utilisateurs
 * Synchronise l'état entre localStorage et Redux pour maintenir la session
 */
export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  // Vérifier si l'utilisateur est connecté
  const isLoggedIn = !!user?.token;

  // Synchroniser l'état lors du chargement de l'application
  useEffect(() => {
    console.log("🔍 useAuth - Initialisation avec état:", {
      isLoggedIn,
      username: user?.username || "non connecté",
      tokenPresent: !!user?.token,
      authType: user?.authType || "aucun",
    });

    // Si connecté dans Redux mais pas dans localStorage, mettre à jour localStorage
    if (isLoggedIn) {
      console.log(
        "✅ useAuth - Utilisateur déjà connecté dans Redux:",
        user.username
      );

      // Si c'est une session Reddit, s'assurer que les données sont dans localStorage
      if (user.authType === "reddit" && !localStorage.getItem("redditUser")) {
        console.log(
          "🔄 useAuth - Rétablissement des données Reddit dans localStorage"
        );
        const redditUser = {
          name: user.username,
          icon_img:
            user.picture ||
            "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png",
          created_utc: Date.now() / 1000,
          total_karma: 0,
        };
        localStorage.setItem("redditUser", JSON.stringify(redditUser));
        console.log(
          "💾 useAuth - Données Reddit sauvegardées dans localStorage"
        );
      }

      // S'assurer que le token est stocké dans localStorage
      if (!localStorage.getItem("authToken") && user.token) {
        console.log("🔄 useAuth - Sauvegarde du token dans localStorage");
        localStorage.setItem("authToken", user.token);
      }
    }
    // Si pas connecté dans Redux mais qu'il y a un token dans localStorage, restaurer la session
    else {
      console.log(
        "🔍 useAuth - Utilisateur non connecté dans Redux, vérification localStorage"
      );
      const authToken = localStorage.getItem("authToken");
      const redditUser = localStorage.getItem("redditUser");
      const googleUser = localStorage.getItem("googleUser");

      console.log("🔍 useAuth - État localStorage:", {
        tokenExists: !!authToken,
        redditUserExists: !!redditUser,
        googleUserExists: !!googleUser,
      });

      if (authToken && (redditUser || googleUser)) {
        console.log(
          "🔄 useAuth - Tentative de restauration de session depuis localStorage"
        );

        let userData = null;
        let authType = "unknown";

        if (redditUser) {
          const parsedUser = JSON.parse(redditUser);
          authType = "reddit";
          userData = {
            token: authToken,
            username: parsedUser.name,
            email: `${parsedUser.name}@reddit.user`,
            name: parsedUser.name,
            surname: "",
            role: "patron",
            authType: "reddit",
            isAuthenticated: true,
          };
          console.log(
            "🔄 useAuth - Construction des données Reddit pour Redux:",
            parsedUser.name
          );
        } else if (googleUser) {
          const parsedUser = JSON.parse(googleUser);
          authType = "google";
          userData = {
            token: authToken,
            username: parsedUser.name,
            email: parsedUser.email,
            name: parsedUser.given_name,
            surname: parsedUser.family_name,
            role: "patron",
            authType: "google",
            isAuthenticated: true,
          };
          console.log(
            "🔄 useAuth - Construction des données Google pour Redux:",
            parsedUser.name
          );
        }

        if (userData) {
          console.log(
            `✅ useAuth - Session ${authType} restaurée pour:`,
            userData.username
          );
          dispatch(addUserToStore(userData));
          console.log(
            "💾 useAuth - Données utilisateur ajoutées au store Redux"
          );
        }
      } else {
        console.log(
          "❌ useAuth - Aucune session valide trouvée dans localStorage"
        );
      }
    }
  }, [dispatch, isLoggedIn, user]);

  // Fonction de déconnexion
  const logout = () => {
    console.log("🚪 useAuth - Déconnexion de l'utilisateur:", user?.username);

    // Nettoyer localStorage
    localStorage.removeItem("redditUser");
    localStorage.removeItem("googleUser");
    localStorage.removeItem("authToken");
    console.log("🧹 useAuth - Données de session supprimées de localStorage");

    // Mettre à jour Redux
    dispatch(removeUserFromStore());
    console.log("🧹 useAuth - Utilisateur supprimé du store Redux");
  };

  // Fonction pour vérifier si l'utilisateur est connecté avec un type spécifique d'auth
  const isLoggedInWith = (authType) => {
    const result = isLoggedIn && user?.authType === authType;
    console.log(`🔍 useAuth - Vérification connection ${authType}:`, result);
    return result;
  };

  return {
    user,
    isLoggedIn,
    isLoggedInWith,
    logout,
  };
}

export default useAuth;
