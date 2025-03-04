"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import styles from "../styles/favorites.module.css";

function Favorites({ username = "test" }) {
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
      ],
    },
    favorites: {
      title: "My favorites games",
      items: [],
    },
  });

  // États pour gérer le chargement et les messages
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Charger les favoris existants au chargement du composant
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/favorites/${username}`
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
                items: data.favorites || [],
              },
            };
          });
          setMessage("Favoris chargés avec succès");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des favoris:", error);
        // Ne pas afficher de message d'erreur pour les premières utilisations
        setMessage("");
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [username]);

  // Gestion du drag and drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
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
        setMessage("This style is already in your favorites");
      }
    }
  };

  // Sauvegarde des favoris
  const saveFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/favorites/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameStyle: columns.favorites.items,
          }),
        }
      );

      // Vérifier si la réponse est OK avant de parser le JSON
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessage("Vos favoris ont été sauvegardés !");
      } else {
        setMessage("Erreur lors de la sauvegarde : " + data.message);
      }
    } catch (error) {
      setMessage("Erreur lors de la sauvegarde : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Affichage des messages */}
      {message && (
        <div
          className={`${styles.message} ${
            message.includes("Error")
              ? styles.messageError
              : styles.messageSuccess
          }`}
        >
          {message}
        </div>
      )}

      <h1 className={styles.title}>My favorite game styles</h1>
      <p className={styles.description}>
        Drag and drop your favorite game styles into the "My Favorite favorite
        styles" box
      </p>

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
                        <Draggable key={item} draggableId={item} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={styles.dragItem}
                              style={provided.draggableProps.style}
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
      <button
        onClick={saveFavorites}
        className={styles.saveButton}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save my favorites"}
      </button>
    </div>
  );
}

export default Favorites;
