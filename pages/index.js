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
      fetch("https://pjbg-backend.vercel.app/projects/get/all")
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

      {/* Titre principal */}
      <h1 className={styles.heroTitle}>
        Fund, Create, and Develop Together!
      </h1>

      {/* Conteneurs des paragraphes côte à côte */}
      <div className={styles.heroParagraphs}>
      <div className={`${styles.heroContainer} ${styles.firstTwo}`}>
          <p className={styles.heroSubtitle}>
          From a "Patron's" perspective, the platform offers two main possibilities:
           you can either launch your own game idea and invite other players to help
            bring it to life, or you can support an existing project that excites you. 
            Whether you want to contribute financially to a concept that inspires you 
            or create your own game from scratch, you set a funding goal and offer 
            different reward tiers. This way, everyone can support a project at their
             own level and receive exclusive perks in return, making the experience 
             even more engaging.          </p>
        </div>

        <div className={`${styles.heroContainer} ${styles.firstTwo}`}>
          <p className={styles.heroSubtitle}>
          For a "Studio," the platform provides a unique opportunity to find game
            projects that already have a dedicated community and secured funding.
            Instead of spending time searching for new ideas or worrying about whether
            a concept will attract players, you can focus on developing a game that has
            already generated interest. By stepping in as a developer, you gain access
            to a ready-made audience, valuable player feedback, and financial support,
            making the entire process more efficient and rewarding.          </p>
        </div>

        <div className={`${styles.heroContainer} ${styles.fullWidth}`}>
          <p className={styles.heroSubtitle}>
          Ultimately, the platform creates a dynamic ecosystem where "Patrons" and
            "Studios" come together to bring innovative game ideas to life. Players can
            track every stage of development, provide feedback, and see how their
            contributions shape the final product. At the same time, development teams
            have a direct line to their future audience, allowing for better communication
            and adaptation throughout the process. This seamless connection between idea
            creators, funders, and developers is what makes the platform a powerful space
            for game creation.          </p>
        </div>
      </div>

    </div>
  </section>
    <div className={styles.containerProjects}>
      <h2 className={styles.discoverTitle}>Discover our top projects</h2>
      <div className={styles.projectGrid}>
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
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
