"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import styles from "../styles/preferences.module.css";
import useAuth from "../hooks/useAuth";

function Preferences() {
  // État pour gérer les colonnes et leurs items
  const [columns, setColumns] = useState({
    genres: {
      title: "Genres",
      items: [
        "FPS",
        "RPG",
        "Adventure",
        "Simulation",
        "Sport",
        "RTS",
        "MOBA",
        "Horror",
      ].filter((item, index, self) => self.indexOf(item) === index),
    },
    plus: {
      title: "Plus",
      items: [],
    },
    moins: {
      title: "Moins",
      items: [],
    },
    blackList: {
      title: "Black List",
      items: [],
    },
  });

  // États pour gérer le chargement et les messages
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Utiliser le hook d'authentification pour récupérer l'utilisateur connecté
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Charger les préférences existantes au chargement du composant et quand l'utilisateur change
  useEffect(() => {
    if (isAuthenticated && user) {
      loadPreferences();
    }
  }, [isAuthenticated, user]);

  const loadPreferences = async () => {
    if (!isAuthenticated || !user) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/preferences/${user.username}`
      );
      const data = await response.json();

      if (data.success && data.preferences) {
        setColumns((prevColumns) => ({
          ...prevColumns,
          plus: {
            ...prevColumns.plus,
            items: [...new Set(data.preferences.plus || [])],
          },
          moins: {
            ...prevColumns.moins,
            items: [...new Set(data.preferences.moins || [])],
          },
          blackList: {
            ...prevColumns.blackList,
            items: [...new Set(data.preferences.blackList || [])],
          },
        }));
        setMessage("Preferences loaded successfully");
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
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
      // Déplacement entre colonnes
      // Vérifier si l'élément existe déjà dans la colonne de destination
      if (!destItems.includes(removed)) {
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
        // Si l'élément existe déjà, on ne l'ajoute pas mais on met quand même à jour la source
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
        });
        // Afficher un message temporaire
        setMessage("⚠️ Cet élément existe déjà dans cette catégorie");
        setTimeout(() => setMessage(""), 2000);
      }
    }
  };

  // Sauvegarde des préférences
  const savePreferences = async () => {
    if (!isAuthenticated || !user) {
      setMessage("Please log in to save your preferences");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          username: user.username,
          preferences: {
            plus: columns.plus.items,
            moins: columns.moins.items,
            blackList: columns.blackList.items,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Vos préférences ont été enregistrées avec succès !");

        // Faire disparaître le message après 3 secondes
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setMessage("❌ Erreur lors de l'enregistrement : " + data.message);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage("❌ Erreur lors de l'enregistrement : " + error.message);
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
      {authLoading ? (
        <div className={styles.loading}>Loading user information...</div>
      ) : !isAuthenticated || !user ? (
        <div className={styles.notAuthenticated}>
          <p>You need to be logged in to manage your preferences.</p>
        </div>
      ) : (
        <>
          {/* Zone de drag and drop */}
          <DragDropContext onDragEnd={onDragEnd}>
            {/* Colonnes principales (Genres, Plus, Moins) */}
            <div className={styles.columnsContainer}>
              {Object.entries(columns)
                .filter(([columnId]) => columnId !== "blackList")
                .map(([columnId, column]) => (
                  <div key={columnId} className={styles.columnWrapper}>
                    <h2 className={styles.columnTitle}>{column.title}</h2>
                    <Droppable droppableId={columnId}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`${styles.column} ${styles.genresColumn}`}
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

            {/* Colonne Black List */}
            <div>
              {Object.entries(columns)
                .filter(([columnId]) => columnId === "blackList")
                .map(([columnId, column]) => (
                  <div key={columnId} className={styles.blackListWrapper}>
                    <h2 className={styles.columnTitle}>{column.title}</h2>
                    <Droppable droppableId={columnId}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`${styles.column} ${styles.blackListColumn}`}
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
          <button
            onClick={savePreferences}
            className={styles.saveButton}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save my preferences"}
          </button>

          {/* Affichage des messages */}
          {message && (
            <div
              className={`${styles.message} ${
                message.includes("Erreur") || message.includes("❌")
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

export default Preferences;
