import styles from "../styles/projectCard.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFollowedProject, setFollowedProjects } from "../reducers/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as RegularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";

// Dictionnaire associant une couleur à chaque catégorie, a voir si il y a peut être une méthode lié à la BDD
// const categoryColors = {
//   "Action": "#d32f2f",
//   "RPG": "#8e24aa",
//   "Strategy": "#1976d2",
//   "Adventure": "#ff7043",
//   "Simulation": "#43a047",
//   "Horror": "#c2185b",
//   "Sci-Fi": "#1a237e",
//   "Sports": "#7cb342",
//   "Multiplayer": "#b71c1c",
//   "Puzzle": "#fdd835",
//   "Tactical": "#455a64",
//   "Medieval": "#6a1b9a",
//   "Cyberpunk": "#009688",
//   "Stealth": "#263238",
//   "OpenWorld": "#ffeb3b",
//   "Fantasy": "#673ab7",
//   "City Builder": "#388e3c",
//   "Exploration": "#0277bd",
//   "Fighting": "#e53935"
// };

// Fonction pour récupérer la couleur d'une catégorie
// Si la catégorie n'existe pas dans `categoryColors`, la couleur par défaut est grise
// const getCategoryColor = (category) => categoryColors[category] || "#cccccc";

export default function ProjectCard({ project }) {
  console.log("voici ce que je recup de project : ", project);
  const router = useRouter();
  const [showNews, setShowNews] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
console.log('the project in the project card : ', project)
  const isLoggedIn = !!user.token;
  const isFollowed =
    isLoggedIn &&
    user.followedProjects?.length > 0 &&
    user.followedProjects.map(e=> e._id).includes(project._id);

  // Si le projet n'existe pas, on ne retourne rien
  if (!project) return null;

  const handleFollowClick = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // dispatch(toggleFollowedProject({ projectId: project._id }));

    try {
      const response = await fetch("/api/users/toggleFollow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ projectId: project._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Erreur lors de la mise à jour des favoris:",
          data.message
        );
        // Optionnel : annuler le changement dans Redux si l'API échoue
        // dispatch(toggleFollowedProject({ projectId: project._id }));
      } else {
        console.log(data.message);
        // Mettre à jour les projets suivis dans Redux avec les données du serveur
        // si vous avez un action setFollowedProjects
        console.log('followed projects to reducer : ', data.followedProjects)
        const followedProjectsCopy = JSON.parse(JSON.stringify(data.followedProjects));
        dispatch(setFollowedProjects(followedProjectsCopy));
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      // Annuler le changement dans Redux en cas d'erreur réseau
      // dispatch(toggleFollowedProject({ projectId: project._id }));
    }
  };

  // Calcul du total des contributions reçues ( acc = accumateur, acc commence à 0, on met 0 au lieu du undefined/null pour éviter erreur )
  const totalCollected = (project.progressions?.reduce((acc, p) => acc + ((p.pledgeChosen.contributionLevel) || 0), 0) || 0).toLocaleString();

  const goal = project.goal?.toLocaleString();
  // calcul pour le pourcentage
  const fundingPercentage = project.goal
    ? Math.round((totalCollected / project.goal) * 100)
    : 0;

  // Récupération de la dernière news publiée (tri par date décroissante) peut être qu'on en veut plus qu'un ? faudrait aussi mettre une limite sur la date
  const latestNews =
    project.histories?.length > 1
      ? [...project.histories].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
          .message
      : "New Project, check it out !";

  return (
    <div
      className={styles.projectCard}
      onClick={() => router.push(`/project/${project.pageURL}`)}
    >
      {/* Bouton pour afficher/cacher les dernières news */}
      <button
        className={styles.newsButton}
        onClick={(e) => {
          e.stopPropagation(); // Empêche le clic de redirection
          setShowNews(!showNews);
        }}
      >
        ! {/* peut etre remplacer par un logo ? */}
      </button>
      <button
        className={styles.favoriteButton}
        onClick={handleFollowClick}
        title={isFollowed ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <FontAwesomeIcon
          icon={isFollowed ? SolidHeart : RegularHeart}
          color={isFollowed ? "#ff4d4d" : "#888"}
        />
      </button>

      <h3>{project.title}</h3>

      {/* Le pitch se trouve là */}
      <div className={styles.descriptionContainer}>
        <p>{project.pitch}</p>
      </div>

      {/* J'vais chercher les catégories ici et j'applique une couleur */}
      <div className={styles.categoriesContainer}>
        {project.detail?.gameMechanics?.length > 0 ? (
          project.detail.gameMechanics
            .filter((e) => e.GMType === "genre")
            .map((category, index) => (
              <span
                key={index}
                className={styles.categoryTag}
                style={{
                  background:
                    category.color2 === "#"
                      ? category.color
                      : `linear-gradient(45deg, ${category.color} 0%, ${category.color} 15%, ${category.color2} 85%, ${category.color2} 100%)`,
                  transition: "background 0.3s ease",
                }}
              >
                {category.name}
              </span>
            ))
        ) : (
          <p className={styles.noCategory}>No categories assigned</p>
        )}
      </div>

      {/* Barre de progression du financement */}
      <div className={styles.cardBottom}>
        <div className={styles.progressContainer}>
          <span className={styles.progressText}>
            {fundingPercentage}% | {totalCollected}€ / {goal}€
          </span>
          <div className={styles.progressBar} style={{ width: `${fundingPercentage}%` }}> 
          </div>
        </div>
      </div>

      {/* je vais surement changer ça parceque j'aime pas le fait qu'il faut rappuyer sur le bouton en lui meme pour le fermer */}
      {showNews && (
        <div className={styles.newsPopover}>
          <strong>Latest News</strong>
          <p>{latestNews}</p>
        </div>
      )}
    </div>
  );
}
