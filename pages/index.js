import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/index.module.css";
import ProjectCard from "../components/ProjectCard";
import Home from "../components/Home";
import useAuth from "../hooks/useAuth"; 

export default function Index() {
  const [projects, setProjects] = useState([]);
  const { isLoggedIn } = useAuth(); // 🔥 Vérifie si l'utilisateur est connecté
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      fetch("http://localhost:3000/projects/get/all")
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {

            const sortedProjects = data.projectsData
              .map((project) => ({
                ...project,
                totalContributed: project.progressions?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
                fundingPercentage: project.goal
                  ? Math.round((project.progressions?.reduce((sum, p) => sum + (p.amount || 0), 0) / project.goal) * 100)
                  : 0,
              }))
              .sort((a, b) => b.fundingPercentage - a.fundingPercentage) // 🔥 Tri décroissant (du plus financé au moins financé)
              .slice(0, 6); // 🔥 On garde les 6 meilleurs

            setProjects(sortedProjects); // ✅ Stocke uniquement les 6 meilleurs projets
          }
        })
        .catch((error) => console.error("❌ Erreur de chargement des projets :", error));
    }
  }, [isLoggedIn]);


  if (isLoggedIn) {
    return <Home projects={projects} />;
  }


  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.sectionTitle}>Welcome To PJBG</h1>
      <section className={styles.heroSection}>
        <div className={styles.heroBubble}>
          <h1 className={styles.heroTitle}>
            PJBG is a crowdfunding website centered on the player’s needs.
          </h1>
          <p className={styles.heroSubtitle}>
            Imagine the ideal game and tell the Game Developers what you want!
          </p>
        </div>
      </section>

      <h2 className={styles.discoverTitle}>Discover our top projects</h2>
      <div className={styles.projectGrid}>
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>

      <div className={styles.usefulLinks}>
        <h2 className={styles.usefulTitle}>Liens utiles</h2>
        <div className={styles.linksContainer}>
          {[
            { name: "GameFunder Blog", url: "https://blog.gamefunder.com", img: "/images/blog.png" },
            { name: "Guide du Crowdfunding", url: "https://crowdfunding-guide.com", img: "/images/crowdfunding.png" },
            { name: "Forum des Développeurs", url: "https://forum.devgames.com", img: "/images/forum.png" },
          ].map((link, index) => (
            <div key={index} className={styles.linkCard}>
              <img src={link.img} alt={link.name} className={styles.linkImage} />
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
