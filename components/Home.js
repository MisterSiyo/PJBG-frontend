import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "../styles/home.module.css";
import ProjectCard from "./ProjectCard"; // Composant pour afficher les projets
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { addUserToStore } from "../reducers/user";

// Import du composant
import SearchBar from "./SearchBar";

export default function Home() {
  const router = useRouter();
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch()
  // État pour la liste brute de projets (récupérés depuis l'API)
  const [projects, setProjects] = useState([]);
  // État pour le tri (progress, mostFunded, etc.)
  const [sortOption, setSortOption] = useState("default");
  // État pour stocker la liste de genres récupérés pour le carrousel
  const [gmTypes, setGmTypes] = useState([]);
  // État de chargement pour le carrousel
  const [loading, setLoading] = useState(true);

  // Filtrage par genres
  const [selectedGenres, setSelectedGenres] = useState([]);    
  const [filteredProjects, setFilteredProjects] = useState([]); 

  // Barre de recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [allSearchableTerms, setAllSearchableTerms] = useState([]); // Titre + mécaniques

  // Configuration du carrousel
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 5,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 5, slidesToScroll: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 4, slidesToScroll: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 3, slidesToScroll: 2 } },
    ],
  };

  // 1) Récupération de tous les projets
  useEffect(() => {
    fetch("http://localhost:3000/projects/get/all")
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setProjects(data.projectsData);

          // Construire la liste globale de termes pour la recherche
          let tempArray = [];
          data.projectsData.forEach((proj) => {
            // Ajouter le titre comme "type: project"
            if (proj.title) {
              tempArray.push({
                label: proj.title.trim(),
                type: "project",
                pageURL: proj.pageURL, // Pour la redirection
              });
            }
            // Ajouter les mécaniques (si existantes)
            if (proj.detail?.gameMechanics) {
              proj.detail.gameMechanics.forEach((gm) => {
                if (gm.name) {
                  tempArray.push({
                    label: gm.name.trim(),
                    type: "mechanic",
                  });
                }
              });
            }
          });

          // Retirer les doublons
          const unique = [];
          const seen = new Set();
          for (let item of tempArray) {
            const key =
              item.label.toLowerCase() +
              "_" +
              item.type +
              "_" +
              (item.pageURL || "");
            if (!seen.has(key) && item.label !== "") {
              unique.push(item);
              seen.add(key);
            }
          }
          setAllSearchableTerms(unique);
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des projets:", err);
      });
  }, []);

  // 2) Récupération de la liste de genres (pour le carrousel)
  useEffect(() => {
    fetch("http://localhost:3000/genres")
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
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

  // 3) Filtrer ET trier les projets dès que 'projects', 'selectedGenres',
  //    'searchQuery' ou 'sortOption' change
  useEffect(() => {
    let result = [...projects];

    // (a) Filtrage par searchQuery
    if (searchQuery.trim().length > 0) {
      const lowerSearch = searchQuery.trim().toLowerCase();
      result = result.filter((proj) => {
        const inTitle = proj.title.toLowerCase().includes(lowerSearch);

        let inMechanics = false;
        if (proj.detail?.gameMechanics) {
          const gmNames = proj.detail.gameMechanics.map((gm) =>
            gm.name.toLowerCase()
          );
          inMechanics = gmNames.some((n) => n.includes(lowerSearch));
        }

        return inTitle || inMechanics;
      });
    }

    // (b) Filtrage par genres, si l'utilisateur en a sélectionné
    if (selectedGenres.length > 0) {
      result = result.filter((proj) => {
        if (!proj.detail || !proj.detail.gameMechanics) return false;
        const projectGenres = proj.detail.gameMechanics
          .filter((gm) => gm.GMType === "genre")
          .map((gm) => gm.name);
        return selectedGenres.every((g) => projectGenres.includes(g));
      });
    }

    // (c) Appliquer le tri existant
    switch (sortOption) {
      case "progress":
        result.sort((a, b) => {
          const progressA =
            a.progressions?.reduce(
              (acc, p) => acc + (p.pledgeChosen?.contributionLevel || 0),
              0
            ) || 0;
          const progressB =
            b.progressions?.reduce(
              (acc, p) => acc + (p.pledgeChosen?.contributionLevel || 0),
              0
            ) || 0;
          const percentA = a.goal ? (progressA / a.goal) * 100 : 0;
          const percentB = b.goal ? (progressB / b.goal) * 100 : 0;
          return percentB - percentA; // tri décroissant
        });
        break;

      case "mostFunded":
        result.sort((a, b) => {
          const totalA =
            a.progressions?.reduce(
              (acc, p) => acc + (p.pledgeChosen?.contributionLevel || 0),
              0
            ) || 0;
          const totalB =
            b.progressions?.reduce(
              (acc, p) => acc + (p.pledgeChosen?.contributionLevel || 0),
              0
            ) || 0;
          return totalB - totalA;
        });
        break;

      case "leastFunded":
        result.sort((a, b) => {
          const totalA =
            a.progressions?.reduce(
              (acc, p) => acc + (p.pledgeChosen?.contributionLevel || 0),
              0
            ) || 0;
          const totalB =
            b.progressions?.reduce(
              (acc, p) => acc + (p.pledgeChosen?.contributionLevel || 0),
              0
            ) || 0;
          return totalA - totalB;
        });
        break;

      case "alphabeticalAsc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "alphabeticalDesc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;

      default:
        // default = ordre non modifié
        break;
    }

    // Mettre à jour l'état 'filteredProjects' avec le résultat final
    setFilteredProjects(result);
  }, [projects, selectedGenres, searchQuery, sortOption]);

  // Gérer le clic sur un genre
  const handleGenreClick = (genreName) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genreName)) {
        return prev.filter((g) => g !== genreName);
      }
      return [...prev, genreName];
    });
  };

  // Bouton Reset
  const handleResetGenres = () => {
    setSelectedGenres([]);
  };


  if (loading) {
    return <div className={styles.mainContainer}>Loading GMTypes...</div>;
  }

  return (
    <div className={styles.mainContainer}>
      
      {/* -------------------------------- SearchBar -------------------------------- */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        allSearchableTerms={allSearchableTerms}
      />
      {/* ------------------------ Carrousel de GMTypes------------------------ */}

      {gmTypes.length > 0 ? (
        <div className={styles.carouselContainer}>
          <Slider {...sliderSettings}>
            {gmTypes.map((genre, index) => (
              <div key={index} className={styles.carouselItem}>
                <button
                  className={styles.subCategory}
                  onClick={() => handleGenreClick(genre.name)}
                  style={{
                    border: selectedGenres.includes(genre.name)
                      ? "2px solid blue"
                      : "none",
                  }}
                >
                  {genre.name}
                </button>
              </div>
            ))}
          </Slider>
          
          {selectedGenres.length > 0 && (
            <button onClick={handleResetGenres}>
              Reset Genres
            </button>
          )}
        </div>
      ) : (
        <p>Aucun GMType trouvé.</p>
      )}
{/* -------------------------------- Bouton "Create Project" -------------------------------- */}
      {user?.role === "patron" && (
        <div className={styles.createProjectContainer}>
          <h2>Want to create your own?</h2>
          <button onClick={() => router.push("/gameCreation")}>
            Create Your Project
          </button>
        </div>
      )}
{/* -------------------------------- Titre section ---------------------------------------- */}

      <h2 className={styles.sectionTitle}>Discover our top projects</h2>

      {/* Options de tri (uniquement si user est connecté) */}
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
{/* -------------------------------- Liste des projets filtrés et triés -------------------------------- */}

      <div className={styles.projectGrid}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))
        ) : (
          <p>Loading projects...</p>
        )}
      </div>
    </div>
  );
}
