"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";

function Question({ userId = "user123" }) {
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

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Charger les préférences existantes au chargement du composant
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/preferences/${userId}`
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
  }, [userId]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      });
    } else {
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

  const savePreferences = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
        color: "black",
      }}
    >
      {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: message.includes("Erreur") ? "#ffcccc" : "#ccffcc",
            borderRadius: "4px",
            width: "100%",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", marginBottom: "20px" }}>
          {Object.entries(columns)
            .filter(([columnId]) => columnId !== "blackList")
            .map(([columnId, column]) => (
              <div
                key={columnId}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "0 10px",
                }}
              >
                <h2>{column.title}</h2>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: "#f0f0f0",
                        padding: 10,
                        width: 500,
                        minHeight: 500,
                        borderRadius: 8,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        alignContent: "flex-start",
                      }}
                    >
                      {column.items.map((item, index) => (
                        <Draggable key={item} draggableId={item} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: "none",
                                padding: 16,
                                width: "100px",
                                height: "100px",
                                backgroundColor: "white",
                                borderRadius: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                ...provided.draggableProps.style,
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

        <div>
          {Object.entries(columns)
            .filter(([columnId]) => columnId === "blackList")
            .map(([columnId, column]) => (
              <div
                key={columnId}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "0 10px",
                  width: "100%",
                }}
              >
                <h2>{column.title}</h2>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: "#f0f0f0",
                        padding: 10,
                        width: 1540,
                        minHeight: 125,
                        borderRadius: 8,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        alignContent: "flex-start",
                      }}
                    >
                      {column.items.map((item, index) => (
                        <Draggable key={item} draggableId={item} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: "none",
                                padding: 16,
                                width: "100px",
                                height: "100px",
                                backgroundColor: "white",
                                borderRadius: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                ...provided.draggableProps.style,
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

      <button
        onClick={savePreferences}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          opacity: isLoading ? 0.7 : 1,
        }}
        disabled={isLoading}
      >
        {isLoading ? "Sauvegarde en cours..." : "Sauvegarder mes préférences"}
      </button>
    </div>
  );
}

export default Question;
