import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const API_BASE_URL = "http://localhost:5000/courses";

// Styles inline
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f7fafc",
    minHeight: "80vh",
  },
  kanbanBoard: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    paddingBottom: "20px",
  },
  column: {
    minWidth: "250px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    padding: "16px",
  },
  columnTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e2e8f0",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  cardTitle: {
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: "4px",
  },
  cardDetails: {
    fontSize: "12px",
    color: "#6b7280",
  },
};

const getStatusBadgeStyle = (status) => {
  let backgroundColor, color;
  switch (status) {
    case "disponible":
      backgroundColor = "#dcfce7";
      color = "#166534";
      break;
    case "réservé":
      backgroundColor = "#fef3c7";
      color = "#d97706";
      break;
    case "terminé":
      backgroundColor = "#fee2e2";
      color = "#dc2626";
      break;
    default:
      backgroundColor = "#f3f4f6";
      color = "#374151";
  }
  return { padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "500", backgroundColor, color };
};

export default function Kanban() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les cours
  const fetchCourses = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setCourses(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des cours:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Fonction pour gérer le drag and drop
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const updatedCourses = Array.from(courses);
    const [movedCourse] = updatedCourses.splice(source.index, 1);
    movedCourse.status = destination.droppableId;

    updatedCourses.splice(destination.index, 0, movedCourse);

    setCourses(updatedCourses);

    // Mettre à jour le statut sur le serveur
    axios.put(`${API_BASE_URL}/${movedCourse._id}`, { status: movedCourse.status })
      .catch(err => console.error("Erreur lors de la mise à jour du statut:", err));
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <div style={{ fontSize: "18px" }}>Chargement des données...</div>
        </div>
      </div>
    );
  }

  // Organiser les cours par statut
  const columns = {
    disponible: courses.filter(course => course.status === "disponible"),
    réservé: courses.filter(course => course.status === "réservé"),
    terminé: courses.filter(course => course.status === "terminé"),
  };

  return (
    <div style={styles.container}>
      <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#2d3748", marginBottom: "20px" }}>Course Kanban</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.kanbanBoard}>
          {Object.keys(columns).map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={styles.column}
                >
                  <div style={styles.columnTitle}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    <span style={getStatusBadgeStyle(status)}>{columns[status].length}</span>
                  </div>
                  {columns[status].map((course, index) => (
                    <Draggable key={course._id} draggableId={course._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...styles.card,
                            ...provided.draggableProps.style,
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = "#f9fafb"}
                          onMouseOut={(e) => e.target.style.backgroundColor = "#ffffff"}
                        >
                          <div style={styles.cardTitle}>{course.title}</div>
                          <div style={styles.cardDetails}>
                            {course.language} - {course.level} - {course.duration}h - {course.price}TND
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
