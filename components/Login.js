import styles from "../styles/auth.module.css";
import { useState } from "react";
import styles from "../styles/login.module.css"

// Définition du composant SignIn qui prend une fonction onSubmit comme prop
export default function SignIn({ onSubmit }) {
  // Initialisation de l'état local avec useState, contenant les champs email et mot de passe
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Fonction pour gérer les changements dans les champs de formulaire (email ou mot de passe)
  const handleChange = (e) => {
    const { name, value } = e.target; // Récupère le nom du champ et sa nouvelle valeur
    setFormData({ ...formData, [name]: value }); // Met à jour l'état local avec les nouvelles valeurs
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async () => {
    // Vérification que l'email est valide avec une expression régulière (regex)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.email)) {
      alert("Invalid email address."); // Si l'email est invalide, on affiche un message d'alerte
      return;
    }

    // Vérification que tous les champs sont remplis
    if (!formData.email || !formData.password || !formData.username) {
      alert("Please complete all fields."); // Si un champ est vide, on affiche une alerte
      return;
    }
    // Tentative d'appel à l'API pour la connexion de l'utilisateur
    try {
      const response = await fetch("https://pjbg-backend.vercel.app/users/login", {
        method: "POST", // Méthode HTTP POST pour envoyer les données
        headers: { "Content-Type": "application/json" }, // En-tête indiquant que le corps de la requête est en JSON
        body: JSON.stringify(formData), // Conversion de formData en chaîne JSON pour l'envoyer au serveur
      });

      // Si la réponse n'est pas correcte (code de statut HTTP 2xx)
      if (!response.ok) {
        const data = await response.json(); // Extraction des données de la réponse en JSON
        if (data.message === "Email not recognized !") {
          alert(
            "Email unknown. Please verify your address or create an account."
          ); // Message pour un email non reconnu
        } else if (data.message === "Incorrect password.") {
          alert("Incorrect password. Please try again."); // Message pour un mot de passe incorrect
        } else {
          alert("An error has occurred. Please try again later."); // Message générique d'erreur
        }
        return; // Sort de la fonction si l'API renvoie une erreur
      }
      // Si la connexion est réussie, on traite les données retournées par l'API
      const data = await response.json();
      onSubmit(data); // On appelle la fonction onSubmit (passée en prop) avec les données reçues
    } catch (error) {
      // Si une erreur survient lors de l'appel à l'API
      alert("Server error. Please try again later.");
    }
  };

  // Le JSX retourné par le composant pour afficher l'interface de connexion
  return (
    <div className={styles.authContainer}>
      <button
        className={styles.authButton}
        onClick={() => alert("Authentification Reddit en cours...")}
      >
        Connect with Reddit
      </button>
      <button
        className={styles.authButton}
        onClick={() => alert("Authentification Google en cours...")}
      >
        <GoogleAuthButton />
      </button>

      <h3 className={styles.separator}>or</h3>

      <label>Email:</label>
      <input
        className={styles.authInput}
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label>Password:</label>
      <input
        className={styles.authInput}
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button className={styles.authButton} onClick={handleSubmit}>
        Enter
      </button>
    </div>
  );
}
