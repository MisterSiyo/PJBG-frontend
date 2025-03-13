import styles from "../styles/projectCard.module.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFollowedProject, setFollowedProjects } from "../reducers/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as RegularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";

export default function ProjectCard({ project }) {

  const router = useRouter();
  const [showNews, setShowNews] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const isLoggedIn = !!user?.token;
  const [projectData, setProjectData] = useState({});
  const isFollowed =
    isLoggedIn &&
    user.followedProjects?.length > 0 &&
    user.followedProjects.map(e=> e._id).includes(project._id);

  // Si le projet n'existe pas, on ne retourne rien
  if (!project) return null;

  project.pageURL ? 
  (useEffect(() => {
    fetch(`http://localhost:3000/projects/${project.pageURL}`)
      .then(response => response.json())
      .then(data => {
        if (data.result) {
            setProjectData(data.project)
        }
      })
  }, [])

) : (

    useEffect(() => {
    fetch(`http://localhost:3000/projects/byId/${project}`)
      .then(response => response.json())
      .then(data => {
        if (data.result) {
            setProjectData(data.project)
        }
      })
  }, [])

)

  const handleFollowClick = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push("/");
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
        body: JSON.stringify({ projectId: projectData._id }),
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
        // Mettre à jour les projets suivis dans Redux avec les données du serveur
        // si vous avez un action setFollowedProjects
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
  const totalCollected = (projectData.progressions?.reduce((acc, p) => acc + ((p.pledgeChosen.contributionLevel) || 0), 0) || 0).toLocaleString();
  const goal = projectData.goal?.toLocaleString();
  // calcul pour le pourcentage
  const fundingPercentage = projectData.goal
    ? Math.round((totalCollected / projectData.goal) * 100)
    : 0;

  // Récupération de la dernière news publiée (tri par date décroissante) peut être qu'on en veut plus qu'un ? faudrait aussi mettre une limite sur la date
  const latestNews =
    projectData.histories?.length > 1
      ? [...projectData.histories].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
          .message
      : "New Project, check it out !";

  return (
    <div
      className={styles.projectCard}
      onClick={() => router.push(`/project/${projectData.pageURL}`)}
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
      <div className={styles.nameContainer}>
      <h3 className={styles.projectName}>{projectData.title}</h3>
      </div>

      {/* Le pitch se trouve là */}
      <div className={styles.descriptionContainer}>
        <p className={styles.projectDescription}>{projectData.pitch}</p>
      </div>

      {/* J'vais chercher les catégories ici et j'applique une couleur */}
      <div className={styles.categoriesContainer}>
        {projectData.detail?.gameMechanics?.length > 0 ? (
          projectData.detail.gameMechanics
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
