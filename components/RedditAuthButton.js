"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/RedditAuthButton.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { addUserToStore } from "../reducers/user";
import useAuth from "../hooks/useAuth";

// Composant de bouton d'authentification Reddit simplifié
const RedditAuthButton = ({ onLoginSuccess }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn, isLoggedInWith, user: authUser } = useAuth();

  // Paramètres Reddit OAuth constants
  const CLIENT_ID = "V4QqtDuthlwC3k45bRxPZQ"; // ID correct avec le Q final
  const REDIRECT_URI = "http://localhost:3001/api/auth/reddit/callback";
  const STATE = "pjbg-reddit-auth";

  // URL d'authentification Reddit (en utilisant encodeURIComponent pour les paramètres)
  const REDDIT_AUTH_URL = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=code&state=${STATE}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&duration=permanent&scope=identity`;

  // Log initial
  useEffect(() => {
    console.log("🔍 RedditAuthButton - Configuration initiale:", {
      clientID: CLIENT_ID,
      redirectURI: REDIRECT_URI,
    });
  }, []);

  // Vérifier si un utilisateur est déjà connecté au chargement
  useEffect(() => {
    // Si l'utilisateur est connecté via Reddit dans Redux
    if (isLoggedIn && isLoggedInWith("reddit")) {
      console.log(
        "✅ RedditAuthButton - Utilisateur Reddit connecté dans Redux:",
        authUser.username
      );

      // Récupérer les détails utilisateur Reddit depuis localStorage
      const storedRedditUser = localStorage.getItem("redditUser");
      if (storedRedditUser) {
        try {
          const parsedUser = JSON.parse(storedRedditUser);
          setUser(parsedUser);
          console.log(
            "✅ RedditAuthButton - Données utilisateur chargées:",
            parsedUser.name
          );
        } catch (error) {
          console.error(
            "❌ RedditAuthButton - Erreur lors de la lecture localStorage:",
            error
          );
        }
      } else {
        console.log(
          "⚠️ RedditAuthButton - Pas de données Reddit dans localStorage"
        );
      }
    } else {
      console.log(
        "🔍 RedditAuthButton - Non connecté comme utilisateur Reddit"
      );
    }

    // Vérifier les paramètres d'URL pour le callback d'authentification
    if (typeof window !== "undefined" && !isLoggedIn) {
      console.log("🔍 RedditAuthButton - Vérification des paramètres URL");
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      console.log("🔍 RedditAuthButton - Paramètres URL trouvés:", {
        codePresent: !!code,
        state: state,
      });

      // Si nous avons un code et un state, c'est un retour d'authentification
      if (code && state === STATE) {
        console.log(
          "🔄 RedditAuthButton - Code d'authentification détecté, traitement..."
        );
        handleRedditCallback(code);

        // Nettoyer l'URL après traitement
        router.replace("/", undefined, { shallow: true });
        console.log("🧹 RedditAuthButton - URL nettoyée");
      }
    }
  }, [isLoggedIn, isLoggedInWith, authUser, router]);

  // Traiter le code d'authentification reçu de Reddit
  const handleRedditCallback = async (code) => {
    console.log(
      "🔄 RedditAuthButton - Traitement du code d'authentification:",
      code.substring(0, 10) + "..."
    );
    setIsLoading(true);
    setError(null);

    try {
      // Appel à notre API locale pour échanger le code contre un token
      console.log("🔄 RedditAuthButton - Appel API pour échange de code");
      const response = await axios
        .post("/api/auth/reddit/token", { code })
        .catch((err) => {
          console.error(
            "❌ RedditAuthButton - Erreur lors de l'appel API:",
            err.response?.data || err.message
          );
          throw err;
        });

      console.log("📥 RedditAuthButton - Réponse API reçue:", {
        status: response.status,
        hasUser: !!response.data?.user,
        hasToken: !!response.data?.token,
      });

      if (response.data && response.data.user) {
        const userData = response.data.user;
        const accessToken = response.data.token.access_token;

        console.log(
          "✅ RedditAuthButton - Authentification réussie pour:",
          userData.name
        );

        // Mettre à jour l'état local
        setUser(userData);
        console.log("�� RedditAuthButton - État local mis à jour");

        // Stocker les données dans localStorage
        localStorage.setItem("redditUser", JSON.stringify(userData));
        localStorage.setItem("authToken", accessToken);
        console.log("💾 RedditAuthButton - Données stockées dans localStorage");

        // Mettre à jour Redux
        const userForStore = {
          token: accessToken,
          username: userData.name,
          email: `${userData.name}@reddit.com`, // Reddit ne fournit pas d'email
          name: userData.name,
          surname: "",
          role: "patron",
          authType: "reddit",
          isAuthenticated: true,
        };

        console.log("🔄 RedditAuthButton - Mise à jour du store Redux");
        dispatch(addUserToStore(userForStore));

        // Appeler le callback de succès
        if (onLoginSuccess) {
          console.log("🔄 RedditAuthButton - Appel du callback onLoginSuccess");
          onLoginSuccess(userData);
        }

        // Rediriger vers la page d'accueil
        console.log("🔄 RedditAuthButton - Redirection vers la page d'accueil");
        setTimeout(() => {
          router.push("/");
        }, 100);
      } else {
        console.error(
          "❌ RedditAuthButton - Réponse incomplète du serveur:",
          response.data
        );
        setError("Réponse incomplète du serveur");
      }
    } catch (error) {
      console.error(
        "❌ RedditAuthButton - Erreur d'authentification:",
        error.response?.data || error.message
      );
      setError(
        `Erreur d'authentification: ${
          error.response?.data?.error || error.message
        }`
      );
    } finally {
      setIsLoading(false);
      console.log("✅ RedditAuthButton - Fin du traitement du code");
    }
  };

  // Redirection vers Reddit pour authentification
  const handleRedditLogin = () => {
    console.log("🔄 RedditAuthButton - Début de la connexion Reddit");
    setIsLoading(true);

    console.log("🔗 RedditAuthButton - URL de redirection:", REDDIT_AUTH_URL);

    // Rediriger l'utilisateur vers Reddit
    try {
      console.log("🔄 RedditAuthButton - Redirection vers Reddit...");
      // Pour déboguer, on peut temporairement imprimer l'URL dans la console
      window.location.href = REDDIT_AUTH_URL;
    } catch (error) {
      console.error("❌ RedditAuthButton - Erreur de redirection:", error);
      setError("Erreur lors de la redirection vers Reddit");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.reddit_auth_container}>
      {user ? (
        <div className={styles.user_info}>
          <img
            src={user.icon_img || "/reddit-avatar.png"}
            alt="Avatar Reddit"
            className={styles.profile_image}
          />
          <div className={styles.user_details}>
            <p className={styles.user_name}>{user.name}</p>
            <p className={styles.user_karma}>{user.total_karma || 0} karma</p>
            {/* Nous utilisons la fonction logout du useAuth dans le Header */}
          </div>
        </div>
      ) : (
        <div className={styles.login_button_container}>
          <button
            onClick={handleRedditLogin}
            className={styles.reddit_login_button}
            disabled={isLoading}
          >
            {isLoading ? "Chargement..." : "Se connecter avec Reddit"}
          </button>
        </div>
      )}
      {error && <p className={styles.error_message}>{error}</p>}
    </div>
  );
};

export default RedditAuthButton;
