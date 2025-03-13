"use client";
import styles from "../styles/header.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setRole, addUserToStore, removeUserFromStore } from "../reducers/user";
import GoogleAuthButton from "./GoogleAuthButton";
import RedditAuthButton from "./RedditAuthButton";
import useAuth from "../hooks/useAuth";

export default function Header() {
  const [showPopover, setShowPopover] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showNavMenu, setShowNavMenu] = useState(false);

  const dispatch = useDispatch();
  const { user, isLoggedIn, logout } = useAuth();

  const router = useRouter();
  const isLoginPage = router.pathname === "/login";
  const hideLoginButton = [
    "/signin-options",
    "/signup-user",
    "/signup-dev",
  ].includes(router.pathname);

  // Afficher l'état de connexion à chaque rendu
  useEffect(() => {
    console.log("🔍 Header - État actuel:", {
      isLoggedIn,
      username: user?.username || "non connecté",
      authType: user?.authType || "aucun",
      showPopover,
      showNavMenu,
    });
  });

  // Fermer le popover quand l'utilisateur est connecté
  useEffect(() => {
    if (isLoggedIn) {
      console.log("✅ Header - Utilisateur connecté, fermeture du popover");
      setShowPopover(false);
    }
  }, [isLoggedIn]);

  const handleRoleSelection = (selectedRole, signupPath) => {
    console.log(`🔄 Header - Sélection du rôle: ${selectedRole}`);
    dispatch(setRole(selectedRole));
    setShowPopover(false);
    router.push(signupPath);
  };

  const handleLogin = async () => {
    console.log("🔄 Header - Tentative de connexion classique");
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!identifier || !password) {
      console.log("❌ Header - Champs incomplets");
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const loginData = {
      email: emailRegex.test(identifier) ? identifier : undefined,
      username: !emailRegex.test(identifier) ? identifier : undefined,
      password,
    };

    console.log("🔄 Header - Envoi de la requête de connexion");
    try {
      const response = await fetch("https://pjbg-backend.vercel.app/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      console.log("📥 Header - Réponse du serveur:", {
        status: response.status,
        ok: response.ok,
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          console.log(
            "✅ Header - Connexion réussie, token reçu:",
            data.token.substring(0, 10) + "..."
          );

          // Mettre à jour le state Redux
          const userForStore = {
            ...data,
            authType: "local",
            isAuthenticated: true,
          };

          console.log("🔄 Header - Mise à jour Redux:", userForStore.username);
          dispatch(addUserToStore(userForStore));

          // Stocker le token dans localStorage pour la persistance
          console.log("💾 Header - Sauvegarde du token dans localStorage");
          localStorage.setItem("authToken", data.token);

          // Fermer le popover
          setShowPopover(false);
        } else {
          console.error("❌ Header - Token manquant dans la réponse");
          alert("Erreur inconnue. Veuillez réessayer.");
        }
      } else {
        console.error("❌ Header - Erreur de connexion:", data.message);
        alert(data.message || "Une erreur s'est produite.");
      }
    } catch (error) {
      console.error("❌ Header - Exception lors de la connexion:", error);
      alert("Une erreur s'est produite.");
    }
  };

  const handleLogout = () => {
    console.log("🔄 Header - Déconnexion de l'utilisateur:", user?.username);

    // Utiliser la fonction de déconnexion du hook useAuth
    logout();

    // Rediriger vers l'accueil
    console.log("🔄 Header - Redirection vers l'accueil");
    router.push("/");
  };

  const navigateTo = (path) => {
    console.log(`🔄 Header - Navigation vers: ${path}`);
    router.push(path);
    setShowNavMenu(false);
  };

  // Handler pour la connexion réussie via OAuth
  const handleOAuthSuccess = (userData) => {
    console.log(
      "✅ Header - Connexion OAuth réussie pour:",
      userData?.name || "inconnu"
    );
    // Fermer le popover après connexion réussie
    setShowPopover(false);
  };

  return (
    <>
      <header className={styles.header}>
        {!isLoginPage && (
          <button className={styles.backButton} onClick={() => router.back()}>
            ⬅ Back
          </button>
        )}
        <div className={styles.logoContainer}>
          <h1 className={styles.title} onClick={() => router.push("/")}>
            <img src="..\images\logo_controller.png" alt="Logo" className={styles.logoIcon} />
          </h1>
        </div>

        {!hideLoginButton &&
          (isLoggedIn ? (
            <div className={styles.userMenu}>
              <span className={styles.welcomeLogin}>Welcome, {user.username} !</span>
              <button
                className={styles.navButton}
                onClick={() => setShowNavMenu(!showNavMenu)}
              >
                Menu ▼
              </button>
              {showNavMenu && (
                <div className={styles.navMenu}>
                  <button onClick={() => navigateTo("/")}>Home</button>
                  <button onClick={() => navigateTo("/account")}>
                    My Account
                  </button>
                  <button onClick={() => navigateTo("/favorites")}>
                    Favorites & Preferences
                  </button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button
              className={styles.loginButton}
              onClick={() => setShowPopover(true)}
            >
              Login / Register
            </button>
          ))}
      </header>

      {showPopover && (
  <div
    className={styles.popoverContainer}
    onClick={() => setShowPopover(false)}
  >
    <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
      <button
        className={styles.closeButton}
        onClick={() => setShowPopover(false)}
      >
        ×
      </button>
      
      <h1 className={styles.titleSection}>Log In</h1>

      <br></br>
      
      <RedditAuthButton onLoginSuccess={handleOAuthSuccess} />
      <GoogleAuthButton onLoginSuccess={handleOAuthSuccess} />
      <div className={styles.separator}>or</div>
      
      <input
        type="text"
        placeholder="Email or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        className={styles.input}
      />
      
      <button onClick={handleLogin}>Enter</button>
      <br></br>

      <div className={styles.separatorContinue}></div>

      <br></br>

      <h1 className={styles.titleSection}>Don't have an account ?</h1>


      <br></br>
      
      {/* Container pour espacer les boutons */}
      <div className={styles.signupButtonContainer}>
        <button
          onClick={() => handleRoleSelection("patron", "/signup-user")}
        >
          I am a Patron
        </button>
        
        <button
          onClick={() => handleRoleSelection("studio", "/signup-dev")}
        >
          I'm a Game Studio
        </button>
        <br></br>
        <div style={{ height: "30px" }}></div>  {/* Espace sans agrandir la popover */}
      </div>
    </div>
  </div>
)}
    </>
  );
}
