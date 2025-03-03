"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import styles from "../styles/preferences.module.css";

function Preferences({ username }) {
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
      ],
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

  // Charger les préférences existantes au chargement du composant
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/preferences/${username}`
        );
        const data = await response.json();

        if (data.success && data.preferences) {
          // Mettre à jour les colonnes avec les préférences chargées
          setColumns((prevColumns) => ({
            ...prevColumns,
            plus: {
              ...prevColumns.plus,
              items: data.preferences.plus || [],
            },
            moins: {
              ...prevColumns.moins,
              items: data.preferences.moins || [],
            },
            blackList: {
              ...prevColumns.blackList,
              items: data.preferences.blackList || [],
            },
          }));
          setMessage("Préférences chargées avec succès");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des préférences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
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
    }
  };

  // Sauvegarde des préférences
  const savePreferences = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          preferences: {
            plus: columns.plus.items,
            moins: columns.moins.items,
            blackList: columns.blackList.items,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Vos préférences ont été sauvegardées !");
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
            message.includes("Erreur")
              ? styles.messageError
              : styles.messageSuccess
          }`}
        >
          {message}
        </div>
      )}

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
        onClick={savePreferences}
        className={styles.saveButton}
        disabled={isLoading}
      >
        {isLoading ? "Sauvegarde en cours..." : "Sauvegarder mes préférences"}
      </button>
    </div>
  );
}

export default Preferences;
