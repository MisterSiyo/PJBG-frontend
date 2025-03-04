"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import styles from "../styles/favorites.module.css";
import useAuth from "../hooks/useAuth";

function Favorites() {
  // Utiliser le hook d'authentification pour récupérer l'utilisateur connecté
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // État pour gérer les colonnes et leurs items
  const [columns, setColumns] = useState({
    allGenres: {
      title: "All game styles",
      items: [
        "FPS",
        "RPG",
        "Adventure",
        "Simulation",
        "Sport",
        "RTS",
        "MOBA",
        "Horror",
        "Platformer",
        "Puzzle",
        "Strategy",
        "Racing",
        "Fighting",
        "Survival",
        "Sandbox",
        "Card Game",
      ].filter((item, index, self) => self.indexOf(item) === index), // Filtrer les doublons dans la liste initiale
    },
    favorites: {
      title: "My favorites games",
      items: [],
    },
  });

  // États pour gérer le chargement et les messages
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Charger les favoris existants au chargement du composant et quand l'utilisateur change
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites();
    }
  }, [isAuthenticated, user]);

  const loadFavorites = async () => {
    if (!isAuthenticated || !user) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/favorites/${user.username}`
      );

      // Vérifier si la réponse est OK avant de parser le JSON
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.favorites) {
        // Mettre à jour les colonnes avec les favoris chargés
        setColumns((prevColumns) => {
          // Créer une copie des items de allGenres
          const allGenresItems = [...prevColumns.allGenres.items];

          // Filtrer les items qui sont déjà dans les favoris
          const filteredAllGenres = allGenresItems.filter(
            (item) => !data.favorites.includes(item)
          );

          return {
            ...prevColumns,
            allGenres: {
              ...prevColumns.allGenres,
              items: filteredAllGenres,
            },
            favorites: {
              ...prevColumns.favorites,
              items: [...new Set(data.favorites || [])], // Utiliser Set pour éliminer les doublons
            },
          };
        });
        setMessage("Favorites loaded successfully");
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      // Ne pas afficher de message d'erreur pour les premières utilisations
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion du drag and drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Si on dépose au même endroit, ne rien faire
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      // Déplacement dans la même colonne
      sourceItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      });
    } else {
      // Vérifier si l'élément existe déjà dans la colonne de destination
      if (!destItems.includes(removed)) {
        // Déplacement entre colonnes
        destItems.splice(destination.index, 0, removed);
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems,
          },
        });
      } else {
        // Si on essaie d'ajouter un doublon, on remet l'élément dans sa colonne d'origine
        sourceItems.splice(source.index, 0, removed);
        setMessage("⚠️ This style is already in your favorites");
        setTimeout(() => setMessage(""), 2000);
      }
    }
  };

  // Sauvegarde des favoris
  const saveFavorites = async () => {
    if (!isAuthenticated || !user) {
      setMessage("Please log in to save your favorites");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Saving favorites:", columns.favorites.items);
      console.log("User:", user.username);

      // Vérifier si le backend est en cours d'exécution
      try {
        await fetch("http://localhost:3000/api/health");
      } catch (error) {
        console.error("Backend server is not running:", error);
        setMessage(
          "Error: Backend server is not running. Please start the server."
        );
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/favorites/${user.username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            preferences: columns.favorites.items,
          }),
        }
      );

      // Vérifier si la réponse est OK avant de parser le JSON
      if (!response.ok) {
        console.error("Response not OK:", response.status);
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        setMessage("✅ Your favorites have been saved successfully!");

        // Faire disparaître le message après 3 secondes
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setMessage("❌ Error saving favorites: " + data.message);
      }
    } catch (error) {
      console.error("Error saving favorites:", error);
      setMessage("❌ Error saving favorites: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Générer un ID unique pour chaque élément
  const getItemId = (item, index, columnId) => {
    return `${item}-${columnId}-${index}`;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My favorite game styles</h1>
      <p className={styles.description}>
        Drag and drop your favorite game styles into the "My Favorite Styles"
        box
      </p>

      {authLoading ? (
        <div className={styles.loading}>Loading user information...</div>
      ) : !isAuthenticated || !user ? (
        <div className={styles.notAuthenticated}>
          <p>You need to be logged in to manage your favorites.</p>
        </div>
      ) : (
        <>
          {/* Zone de drag and drop */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className={styles.columnsContainer}>
              {Object.entries(columns)
                .sort(([columnId]) => (columnId === "allGenres" ? -1 : 1))
                .map(([columnId, column]) => (
                  <div
                    key={columnId}
                    className={`${styles.columnWrapper} ${
                      columnId === "allGenres"
                        ? styles.allGenresWrapper
                        : styles.favoritesWrapper
                    }`}
                  >
                    <h2 className={styles.columnTitle}>{column.title}</h2>
                    <Droppable droppableId={columnId}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`${styles.column} ${
                            columnId === "allGenres"
                              ? styles.allGenresColumn
                              : styles.favoritesColumn
                          }`}
                        >
                          {column.items.map((item, index) => (
                            <Draggable
                              key={getItemId(item, index, columnId)}
                              draggableId={getItemId(item, index, columnId)}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${styles.dragItem} ${
                                    snapshot.isDragging ? styles.dragging : ""
                                  }`}
                                  style={{
                                    ...provided.draggableProps.style,
                                    opacity: snapshot.isDragging ? 0.8 : 1,
                                  }}
                                >
                                  {item}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
            </div>
          </DragDropContext>

          {/* Bouton de sauvegarde */}
          <div className={styles.buttonContainer}>
            <button
              onClick={saveFavorites}
              className={styles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save my favorites"}
            </button>

            <button
              className={styles.debugButton}
              onClick={() => console.log("Current columns state:", columns)}
              style={{ display: "none" }} // Cacher le bouton de débogage en production
            >
              Debug State
            </button>
          </div>

          {/* Affichage des messages */}
          {message && (
            <div
              className={`${styles.message} ${
                message.includes("Error") || message.includes("❌")
                  ? styles.messageError
                  : message.includes("✅")
                  ? styles.messageSuccess
                  : message.includes("⚠️")
                  ? styles.messageWarning
                  : ""
              }`}
            >
              {message}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Favorites;
