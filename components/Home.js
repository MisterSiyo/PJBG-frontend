import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/layout.module.css";
import ProjectCard from "./ProjectCard"; // Import du composant pour afficher les projets

export default function Home() {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Charger tous les projets quand la page Home s'affiche
    fetch("http://localhost:3000/projects/get/all")
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setProjects(data.projectsData); // Stocker les projets dans le state
        }
      })
      .catch((error) => console.error("Erreur de chargement des projets :", error));
  }, []);

  return (
    <div className={styles.mainContainer}>
      {/* Bouton pour créer un projet */}
      <div className={styles.createProjectContainer}>
        <h2>Want to create your own?</h2>
        <button onClick={() => router.push("/gameCreation")}>
          Create Your Project
        </button>
      </div>

      {/* Affichage des projets */}
      <h2 className={styles.sectionTitle}>Discover our top projects</h2>
      <div className={styles.projectGrid}>
        {projects.length > 0 ? (
          projects.map((project, index) => <ProjectCard key={index} project={project} />)
        ) : (
          <p>Loading projects...</p>
        )}
      </div>
    </div>
  );
}
