import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "../styles/layout.module.css";
import ProjectCard from "./ProjectCard"; // Composant pour afficher les projets
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { addUserToStore } from "../reducers/user";

export default function Home() {
  const router = useRouter();
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch()
  // État pour les projets
  const [projects, setProjects] = useState([]);
  // État pour l'option de tri
  const [sortOption, setSortOption] = useState("default");
  // État pour la liste des GMTypes (carrousel)
  const [gmTypes, setGmTypes] = useState([]);
  // État de chargement du carrousel
  const [loading, setLoading] = useState(true);

  // Configuration du carrousel
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 6,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  // 1) Charger et trier les projets
  useEffect(() => {
    fetch("http://localhost:3000/projects/get/all")
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // On clone pour éviter de modifier directement data.projectsData
          let sortedProjects = [...data.projectsData];

          switch (sortOption) {
            case "progress":
              sortedProjects.sort((a, b) => {
                const progressA =
                  a.progressions?.reduce(
                    (acc, p) => acc + (p.pledgeChosen.contributionLevel || 0),
                    0
                  ) || 0;
                const progressB =
                  b.progressions?.reduce(
                    (acc, p) => acc + (p.pledgeChosen.contributionLevel || 0),
                    0
                  ) || 0;

                const percentA = a.goal ? (progressA / a.goal) * 100 : 0;
                const percentB = b.goal ? (progressB / b.goal) * 100 : 0;

                return percentB - percentA; // Du plus financé au moins financé
              });
              break;

            case "mostFunded":
              sortedProjects.sort((a, b) => {
                const totalA =
                  a.progressions?.reduce(
                    (acc, p) => acc + (p.pledgeChosen.contributionLevel || 0),
                    0
                  ) || 0;
                const totalB =
                  b.progressions?.reduce(
                    (acc, p) => acc + (p.pledgeChosen.contributionLevel || 0),
                    0
                  ) || 0;
                return totalB - totalA;
              });
              break;

            case "leastFunded":
              sortedProjects.sort((a, b) => {
                const totalA =
                  a.progressions?.reduce(
                    (acc, p) => acc + (p.pledgeChosen.contributionLevel || 0),
                    0
                  ) || 0;
                const totalB =
                  b.progressions?.reduce(
                    (acc, p) => acc + (p.pledgeChosen.contributionLevel || 0),
                    0
                  ) || 0;
                return totalA - totalB;
              });
              break;

            case "alphabeticalAsc":
              sortedProjects.sort((a, b) => a.title.localeCompare(b.title));
              break;

            case "alphabeticalDesc":
              sortedProjects.sort((a, b) => b.title.localeCompare(a.title));
              break;

            default:
              // Si "default", on ne touche pas l'ordre.
              break;
          }

          setProjects(sortedProjects);
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des projets:", err);
      });
  }, [sortOption]);

  // 2) Charger la liste de GMTypes pour le carrousel
  useEffect(() => {
    fetch("http://localhost:3000/genres") 
  
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // data.types correspond à "mechanics" côté backend
          setGmTypes(data.genres);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des GMType:", err);
        setLoading(false);
      });
  }, []);

  // re render du redux 
  // useEffect(() => {
  //   if (user.token) {
  //     fetch('http://localhost:3000/users/reduxrender', {
  //       method: 'POST',
  //       headers: {'Content-Type': 'application/json'},
  //       body: JSON.stringify({token : user.token})
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       dispatch(addUserToStore(data.user))
  //     })
  //   }
  // }, [])

  // Affichage conditionnel si GMTypes en cours de chargement
  if (loading) {
    return <div className={styles.mainContainer}>Loading GMTypes...</div>;
  }

  return (
    <div className={styles.mainContainer}>
      {/* Carrousel de GMTypes */}
      {gmTypes.length > 0 ? (
        <div className={styles.carouselContainer}>
          <Slider {...sliderSettings}>
            {gmTypes.map((genre, index) => (
              <div key={index} className={styles.carouselItem}>
                <button className={styles.subCategory}>
                  {genre.name}
                </button>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <p>Aucun GMType trouvé.</p>
      )}
      {/* Bouton "Create Project" visible uniquement si user.role === "patron" */}
      {user?.role === "patron" && (
        <div className={styles.createProjectContainer}>
          <h2>Want to create your own?</h2>
          <button onClick={() => router.push("/gameCreation")}>
            Create Your Project
          </button>
        </div>
      )}

      {/* Titre */}
      <h2 className={styles.sectionTitle}>Discover our top projects</h2>


      {/* Options de tri (uniquement si l'utilisateur est connecté) */}
      {user?.token && (
        <div className={styles.sortContainer}>
          <label htmlFor="sort">Sort projects by: </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="progress">Goals</option>
            <option value="mostFunded">Most Funded</option>
            <option value="leastFunded">Least Funded</option>
            <option value="alphabeticalAsc">Alphabetical (A → Z)</option>
            <option value="alphabeticalDesc">Alphabetical (Z → A)</option>
          </select>
        </div>
      )}



      {/* Grid des projets */}
      <div className={styles.projectGrid}>
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))
        ) : (
          <p>Loading projects...</p>
        )}
      </div>
    </div>
  );
}
