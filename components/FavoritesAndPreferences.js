"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import styles from "../styles/favoritesAndPreferences.module.css";
import useAuth from "../hooks/useAuth";

function FavoritesAndPreferences() {
  // Utiliser le hook d'authentification pour récupérer l'utilisateur connecté
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user.token;

  // État pour gérer les colonnes et leurs items pour la sélection des favoris
  const [favoritesColumns, setFavoritesColumns] = useState({
    allGenres: {
      title: "All game genres",
      items: [
"Adventure",
"Puzzle",
"Strategy",
"Fighting",
"Survival",
"Card Game",
"FPS",
"Simulation",
"RTS",
"MOBA",
"Platformer",
"Racing",
"Horror",
"RPG",
"Sport",
"Sandbox",
"Beat'em up",
"Hack and Slash",
"Metroidvania",
"Point-and-click",
"Text Adventure",
"Interactive Movie",
"Walking Simulator",
"Western RPG",
"Japanese RPG",
"Action RPG",
"Tactical RPG",
"MMORPG",
"Roguelike/Roguelite",
"Life Simulation",
"Vehicle Simulation",
"City Building",
"Farming Simulation",
"Turn-Based Strategy",
"Tower Defense",
"Grand Strategy",
"Sports Simulation",
"Arcade Sports",
"Arcade Racing",
"Racing Simulation",
"2D Fighting",
"3D Fighting",
"Platform Fighting",
"Logic Puzzle",
"Physics Puzzle",
"Hidden Object",
"Survival Horror",
"Psychological Horror",
"Action Horror",
"Horror Adventure",
"Construction Sandbox",
"Survival Sandbox",
"Rhythm Game",
"Music Creation",
"Visual Novel",
"Dating Sim",
"Interactive Fiction"
      ].filter((item, index, self) => self.indexOf(item) === index),
    },
    favorites: {
      title: "My favorites game genres",
      items: [],
    },
    blackList: {
      title: "Black List",
      items: [],
    },
  });

  // État pour gérer les colonnes et leurs items pour le classement des favoris
  const [preferencesColumns, setPreferencesColumns] = useState({
    favoritesPlus: {
      title: "Favoris +",
      items: [],
    },
    favorites: {
      title: "Favoris",
      items: [],
    },
    favoritesMinus: {
      title: "Favoris -",
      items: [],
    },
  });

  // États pour gérer le chargement, les messages et le modal
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Charger les favoris et préférences existants au chargement du composant et quand l'utilisateur change
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  // Charger toutes les données utilisateur depuis le backend
  const loadUserData = async () => {
    if (!isAuthenticated || !user) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/users/favorites/${user.username}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Mettre à jour les favoris
        setFavoritesColumns((prevColumns) => {
          // Créer une copie des items de allGenres
          const allGenresItems = [...prevColumns.allGenres.items];

          // Filtrer les items qui sont déjà dans les favoris ou la blacklist
          const filteredAllGenres = allGenresItems.filter(
            (item) =>
              !data.favorites.includes(item) && !data.blackList.includes(item)
          );

          return {
            ...prevColumns,
            allGenres: {
              ...prevColumns.allGenres,
              items: filteredAllGenres,
            },
            favorites: {
              ...prevColumns.favorites,
              items: [...new Set(data.favorites || [])],
            },
            blackList: {
              ...prevColumns.blackList,
              items: [...new Set(data.blackList || [])],
            },
          };
        });

        // Mettre à jour les préférences
        setPreferencesColumns((prevColumns) => ({
          ...prevColumns,
          favoritesPlus: {
            ...prevColumns.favoritesPlus,
            items: [...new Set(data.favoritesPlus || [])],
          },
          favorites: {
            ...prevColumns.favorites,
            items: [...new Set(data.favorites || [])],
          },
          favoritesMinus: {
            ...prevColumns.favoritesMinus,
            items: [...new Set(data.favoritesMinus || [])],
          },
        }));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion du drag and drop pour les favoris
  const onDragEndFavorites = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Si on dépose au même endroit, ne rien faire
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = favoritesColumns[source.droppableId];
    const destColumn = favoritesColumns[destination.droppableId];

    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      // Déplacement dans la même colonne
      sourceItems.splice(destination.index, 0, removed);
      setFavoritesColumns({
        ...favoritesColumns,
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
        setFavoritesColumns({
          ...favoritesColumns,
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
        setMessage("⚠️ This style is already in this category");
        setTimeout(() => setMessage(""), 2000);
      }
    }
  };

  // Gestion du drag and drop pour les préférences
  const onDragEndPreferences = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Si on dépose au même endroit, ne rien faire
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = preferencesColumns[source.droppableId];
    const destColumn = preferencesColumns[destination.droppableId];

    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      // Déplacement dans la même colonne
      sourceItems.splice(destination.index, 0, removed);
      setPreferencesColumns({
        ...preferencesColumns,
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
        setPreferencesColumns({
          ...preferencesColumns,
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
        // Si l'élément existe déjà, on ne l'ajoute pas mais on met quand même à jour la source
        setPreferencesColumns({
          ...preferencesColumns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
        });
        // Afficher un message temporaire
        setMessage("⚠️ This element already exists in this category");
        setTimeout(() => setMessage(""), 2000);
      }
    }
  };

  // Sauvegarde des favoris et ouverture du modal pour le classement
  const saveFavoritesAndOpenModal = async () => {
    if (!isAuthenticated || !user) {
      setMessage("Please log in to save your favorites");
      return;
    }

    try {
      setIsLoading(true);

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

      // Sauvegarder les favoris et la blacklist
      const favoritesResponse = await fetch(
        `http://localhost:3000/users/favorites/${user.username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            favorites: favoritesColumns.favorites.items,
            blackList: favoritesColumns.blackList.items,
          }),
        }
      );

      if (!favoritesResponse.ok) {
        throw new Error(`HTTP error: ${favoritesResponse.status}`);
      }

      setMessage("✅ Favorites saved !");

      // Mettre à jour les favoris dans le modal
      setPreferencesColumns((prevColumns) => ({
        ...prevColumns,
        favorites: {
          ...prevColumns.favorites,
          items: [...favoritesColumns.favorites.items],
        },
      }));

      // Ouvrir le modal pour le classement des favoris
      setShowModal(true);
    } catch (error) {
      console.error("Error saving favorites:", error);
      setMessage("❌ Error saving favorites: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarde des préférences et fermeture du modal
  const savePreferencesAndCloseModal = async () => {
    if (!isAuthenticated || !user) {
      setMessage("Please log in to save your preferences");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/users/favorites/${user.username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            favorites: preferencesColumns.favorites.items,
            favoritesPlus: preferencesColumns.favoritesPlus.items,
            favoritesMinus: preferencesColumns.favoritesMinus.items,
            blackList: favoritesColumns.blackList.items,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Your preferences have been saved successfully !");
        setShowModal(false);

        // Faire disparaître le message après 3 secondes
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setMessage("❌ Error saving preferences: " + data.message);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage("❌ Error saving preferences: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Générer un ID unique pour chaque élément
  const getItemId = (item) => {
    return `${item.replace(/\s+/g, '-')}`;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Favorites and Preferences</h1>

      {message && <div className={styles.message}>{message}</div>}

      {/* Section de sélection des favoris */}
      <div className={styles.favoritesSection}>
        <h2>Select your favorites</h2>
        <DragDropContext onDragEnd={onDragEndFavorites}>
          <div className={styles.columnsContainer}>
            {Object.entries(favoritesColumns).map(([columnId, column]) => (
              <div key={columnId} className={styles.column}>
                <h3 className={styles.columnTitle}>{column.title}</h3>
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`${styles.droppable} ${
                        snapshot.isDraggingOver ? styles.draggingOver : ""
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
                              className={`${styles.draggable} ${
                                snapshot.isDragging ? styles.dragging : ""
                              }`}
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

        <button
          className={styles.saveButton}
          onClick={saveFavoritesAndOpenModal}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save and choose your preferences"}
        </button>
      </div>

      {/* Modal pour le classement des favoris */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Sort your favorites</h2>
            <p>Drag and drop your favorites into the corresponding columns</p>

            <DragDropContext onDragEnd={onDragEndPreferences}>
              <div className={styles.columnsContainer}>
                {Object.entries(preferencesColumns).map(
                  ([columnId, column]) => (
                    <div key={columnId} className={styles.column}>
                      <h3 className={styles.columnTitle}>{column.title}</h3>
                      <Droppable droppableId={columnId}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`${styles.droppable} ${
                              snapshot.isDraggingOver ? styles.draggingOver : ""
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
                                    className={`${styles.draggable} ${
                                      snapshot.isDragging ? styles.dragging : ""
                                    }`}
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
                  )
                )}
              </div>
            </DragDropContext>

            <div className={styles.modalButtons}>
              <button
                className={styles.saveButton}
                onClick={savePreferencesAndCloseModal}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save my preferences"}
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowModal(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FavoritesAndPreferences;
