import styles from "../styles/layout.module.css";
import ProjectCard from "../components/ProjectCard";
import { useEffect, useState } from "react";
import Home from "../components/Home";

export default function Index() {
  const [projects, setProjects] = useState([]);
// On trie les 6 meilleures projet considerant la barre de progression
  useEffect(() => {
    fetch("http://localhost:3000/projects/get/all")
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // const sortedProjects = data.projectsData
          //   .map((project) => ({
          //     ...project,
          //     totalContributed: project.progressions?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
          //     fundingPercentage: project.goal
          //       ? Math.round((project.progressions?.reduce((sum, p) => sum + (p.amount || 0), 0) / project.goal) * 100)
          //       : 0,
          //   }))
          //   .sort((a, b) => b.fundingPercentage - a.fundingPercentage)
          //   .slice(0, 6);
          // setProjects(sortedProjects);
          setProjects(data.projectsData)
        }
      });
  }, []);

  const usefulLinks = [
    {
      name: "GameFunder Blog",
      url: "https://blog.gamefunder.com",
      img: "/images/blog.png", // Il faut remplacer par une image 
    },
    {
      name: "Guide du Crowdfunding",
      url: "https://crowdfunding-guide.com",
      img: "/images/crowdfunding.png",
    },
    {
      name: "Forum des Développeurs",
      url: "https://forum.devgames.com",
      img: "/images/forum.png",
    },
  ];

  return (
    <>
      <Home />
      <div className={styles.mainContainer}>
        <h1 className={styles.sectionTitle}>Welcome To PJBG</h1>
        <p>PJBG is a crowdfunding website centered on the player’s needs.</p>

        <h2 className={styles.sectionTitle}>Discover our top projects</h2>
        <div className={styles.projectGrid}>
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>

        <div className={styles.usefulLinks}>
          <h2 className={styles.usefulTitle}>Liens utiles</h2>
          <div className={styles.linksContainer}>
            {usefulLinks.map((link, index) => (
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
    </>
  );
}
