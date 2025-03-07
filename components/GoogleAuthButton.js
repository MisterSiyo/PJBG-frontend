import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import styles from "../styles/GoogleAuthButton.module.css";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { addUserToStore } from "../reducers/user";
import useAuth from "../hooks/useAuth";

const GoogleAuthButton = ({ onLoginSuccess }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn, isLoggedInWith, user: authUser } = useAuth();

  // Log initial
  useEffect(() => {
    console.log("🔍 GoogleAuthButton - Initialisation du composant");
  }, []);

  // Vérifier si un utilisateur est déjà connecté au chargement du composant
  useEffect(() => {
    console.log("🔍 GoogleAuthButton - Vérification état:", {
      isLoggedIn,
      isGoogleAuth: isLoggedInWith("google"),
    });

    // Si l'utilisateur est connecté via Google dans Redux
    if (isLoggedIn && isLoggedInWith("google")) {
      console.log(
        "✅ GoogleAuthButton - Utilisateur Google connecté:",
        authUser.username
      );

      // Récupérer les détails utilisateur Google depuis localStorage
      const storedUser = localStorage.getItem("googleUser");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log(
            "✅ GoogleAuthButton - Données utilisateur chargées:",
            parsedUser.name
          );
        } catch (error) {
          console.error(
            "❌ GoogleAuthButton - Erreur lecture localStorage:",
            error
          );
        }
      } else {
        console.log(
          "⚠️ GoogleAuthButton - Connecté dans Redux mais pas de données dans localStorage"
        );
      }
    }
  }, [isLoggedIn, isLoggedInWith, authUser]);

  // Décodage du token JWT pour obtenir les informations utilisateur
  const handleSuccess = async (credentialResponse) => {
    try {
      console.log("🔄 GoogleAuthButton - Authentification en cours...");
      setIsLoading(true);
      const decodedUser = jwtDecode(credentialResponse.credential);

      console.log(
        "✅ GoogleAuthButton - Authentification réussie:",
        decodedUser.name
      );
      console.log("🔍 GoogleAuthButton - Données utilisateur:", {
        email: decodedUser.email,
        name: decodedUser.name,
        picture: decodedUser.picture ? "présente" : "absente",
      });

      // Stocker les informations utilisateur
      setUser(decodedUser);
      localStorage.setItem("googleUser", JSON.stringify(decodedUser));
      console.log(
        "💾 GoogleAuthButton - Données utilisateur stockées dans localStorage"
      );

      // Créer un token propre à notre application
      const appToken = credentialResponse.credential;
      localStorage.setItem("authToken", appToken);
      console.log("💾 GoogleAuthButton - Token stocké dans localStorage");

      // Mettre à jour Redux
      const userForStore = {
        token: appToken,
        username: decodedUser.name,
        email: decodedUser.email,
        name: decodedUser.given_name,
        surname: decodedUser.family_name,
        role: "patron",
        authType: "google",
        isAuthenticated: true,
      };

      console.log("🔄 GoogleAuthButton - Mise à jour du store Redux");
      dispatch(addUserToStore(userForStore));

      // Appeler le callback
      if (onLoginSuccess) {
        console.log("🔄 GoogleAuthButton - Appel du callback onLoginSuccess");
        onLoginSuccess(decodedUser);
      }

      // Rediriger vers l'accueil
      console.log("🔄 GoogleAuthButton - Redirection vers l'accueil");
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (error) {
      console.error("❌ GoogleAuthButton - Erreur d'authentification:", error);
      setError("Erreur lors de l'authentification Google");
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion des erreurs
  const handleError = (error) => {
    console.error("❌ GoogleAuthButton - Erreur d'authentification:", error);
    setError("Erreur d'authentification Google");
  };

  return (
    <div className={styles.google_auth_container}>
      {isLoading && <p className={styles.loading_message}>Chargement...</p>}

      {user ? (
        <div className={styles.user_info}>
          <img
            src={user.picture}
            alt="Photo de profil"
            className={styles.profile_image}
            referrerPolicy="no-referrer"
          />
          <div className={styles.user_details}>
            <p className={styles.user_name}>{user.name}</p>
            <p className={styles.user_email}>{user.email}</p>
            {/* Nous utilisons la fonction logout du useAuth dans le Header */}
          </div>
        </div>
      ) : (
        <div className={styles.login_button_container}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            text="continue_with"
            shape="rectangular"
            locale="fr"
          />
        </div>
      )}
      {error && <p className={styles.error_message}>{error}</p>}
    </div>
  );
};

export default GoogleAuthButton;
