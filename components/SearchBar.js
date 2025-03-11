import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/searchBar.module.css"; // Assurez-vous de créer ce fichier CSS

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  allSearchableTerms
}) {
  const router = useRouter();
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [mechanicSuggestions, setMechanicSuggestions] = useState([]);

  // c'est devenu compliqué ici, faudra demandé à Chat d'expliquer
  useEffect(() => {
    if (!allSearchableTerms || !Array.isArray(allSearchableTerms)) return;

    const trimmed = searchQuery ? searchQuery.trim().toLowerCase() : "";
    if (trimmed.length === 0) {
      setProjectSuggestions([]);
      setMechanicSuggestions([]);
      return;
    }

    // Séparer projets et mécaniques (test pour mettre une barre, j'ai peur de l'enlever maintenant)
    const filteredProjects = allSearchableTerms
      .filter((obj) => obj.type === "project" && obj.label.toLowerCase().includes(trimmed))
      .slice(0, 5); // Max 5 projets

    const filteredMechanics = allSearchableTerms
      .filter((obj) => obj.type === "mechanic" && obj.label.toLowerCase().includes(trimmed))
      .slice(0, 5); // Max 5 mécaniques

    setProjectSuggestions(filteredProjects);
    setMechanicSuggestions(filteredMechanics);
  }, [searchQuery, allSearchableTerms]);

  
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (obj) => {
    if (obj.type === "project") {
      router.push(`/project/${obj.pageURL}`);
    } else {
      setSearchQuery(obj.label);
    }
    setProjectSuggestions([]);
    setMechanicSuggestions([]);
  };

  return (
    <div className={styles.searchBarContainer}>
      {/* -------------------------------- Barre de recherche --------------------------------*/}
      <input
        type="text"
        placeholder="Search a project or mechanic..."
        value={searchQuery}
        onChange={handleChange}
        className={styles.searchInput}
      />

      {/* ------------------------ Liste déroulante des suggestions ------------------------*/}
      {(projectSuggestions.length > 0 || mechanicSuggestions.length > 0) && (
        <ul className={styles.suggestionsList}>
          
          {/* -------------------------------- Section Projets -------------------------------- */}
          {projectSuggestions.length > 0 && (
            <>
              <li className={styles.sectionTitle}>Projects</li>
              {projectSuggestions.map((item, idx) => (
                <li
                  key={`proj-${idx}`}
                  onClick={() => handleSuggestionClick(item)}
                  className={styles.suggestionItem}
                >
                  {item.label}
                </li>
              ))}
            </>
          )}

          {/* -------------------------------- Séparateur -------------------------------- */}
          {projectSuggestions.length > 0 && mechanicSuggestions.length > 0 && (
            <li className={styles.separator}></li>
          )}

          {/* -------------------------------- Section Mécaniques --------------------------------*/}
          {mechanicSuggestions.length > 0 && (
            <>
              <li className={styles.sectionTitle}>Mechanics</li>
              {mechanicSuggestions.map((item, idx) => (
                <li
                  key={`mech-${idx}`}
                  onClick={() => handleSuggestionClick(item)}
                  className={styles.suggestionItem}
                >
                  {item.label}
                </li>
              ))}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
