import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/reviews";
const USERS_API_URL = "http://localhost:5000/users/getAllUsers";
const COURSES_API_URL = "http://localhost:5000/courses";

// Composants d'icônes personnalisés
const PlusIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9.5L7 13.707V10.5a.5.5 0 0 0-.5-.5H3.207L11.207 9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M2.146 2.146a.5.5 0 0 1 .708 0L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854a.5.5 0 0 1 0-.708z"/>
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="16" height="16" fill={filled ? "#fbbf24" : "#d1d5db"} viewBox="0 0 16 16">
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
  </svg>
);

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    courseId: "",
    rating: 1,
    comment: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fonction pour récupérer le token d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Charger les utilisateurs
  const fetchUsers = async () => {
    try {
      const res = await axios.get(USERS_API_URL, { headers: getAuthHeaders() });
      console.log("Réponse API utilisateurs:", res.data);
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (res.data && Array.isArray(res.data.UserList)) {
        setUsers(res.data.UserList.map(user => ({
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
        })));
      } else if (res.data && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else {
        console.error("Structure de données utilisateurs inattendue:", res.data);
        setUsers([]);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs:", err);
      setUsers([]);
    }
  };

  // Charger les cours
  const fetchCourses = async () => {
    try {
      const res = await axios.get(COURSES_API_URL, { headers: getAuthHeaders() });
      if (Array.isArray(res.data)) {
        setCourses(res.data);
      } else if (res.data && Array.isArray(res.data.courses)) {
        setCourses(res.data.courses);
      } else {
        console.error("Structure de données cours inattendue:", res.data);
        setCourses([]);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des cours:", err);
      setCourses([]);
    }
  };

  // Charger toutes les reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(API_BASE_URL, { headers: getAuthHeaders() });
      setReviews(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        fetchUsers(),
        fetchCourses(),
        fetchReviews()
      ]);
    };
    loadAllData();
  }, []);

  // Fonction pour obtenir le nom d'utilisateur
  const getUserName = (userId) => {
    if (typeof userId === 'object' && userId?.username) {
      return userId.username;
    }
    if (typeof userId === 'object' && userId?.name) {
      return userId.name;
    }
    const user = users.find(u => u._id === userId);
    return user ? (user.username || user.name || user.email) : userId || "Utilisateur inconnu";
  };

  // Fonction pour obtenir le titre du cours
  const getCourseTitle = (courseId) => {
    if (typeof courseId === 'object' && courseId?.title) {
      return courseId.title;
    }
    const course = courses.find(c => c._id === courseId);
    return course ? course.title : courseId || "Cours inconnu";
  };

  // Composant pour afficher les étoiles
  const renderStars = (rating, clickable = false, onChange = () => {}) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <span 
            key={i}
            onClick={() => clickable && onChange(i + 1)}
            style={{ cursor: clickable ? 'pointer' : 'default' }}
          >
            <StarIcon filled={i < rating} />
          </span>
        ))}
      </div>
    );
  };

  // Gérer le formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Ajouter ou modifier une review
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, formData, { headers: getAuthHeaders() });
        alert("Review modifiée avec succès !");
      } else {
        await axios.post(API_BASE_URL, formData, { headers: getAuthHeaders() });
        alert("Review ajoutée avec succès !");
      }
      setFormData({ userId: "", courseId: "", rating: 1, comment: "" });
      setEditingId(null);
      setShowModal(false);
      fetchReviews();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert(`Erreur lors de la sauvegarde de la review: ${err.response?.data?.message || err.message}`);
    }
  };

  // Supprimer
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette review ?")) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`, { headers: getAuthHeaders() });
        alert("Review supprimée avec succès !");
        fetchReviews();
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert(`Erreur lors de la suppression de la review: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  // Mettre en édition
  const handleEdit = (review) => {
    setFormData({
      userId: review.userId?._id || review.userId,
      courseId: review.courseId?._id || review.courseId,
      rating: review.rating || 1,
      comment: review.comment || "",
    });
    setEditingId(review._id);
    setShowModal(true);
  };

  // Annuler l'édition
  const handleCancel = () => {
    setFormData({ userId: "", courseId: "", rating: 1, comment: "" });
    setEditingId(null);
    setShowModal(false);
  };

  // Ouvrir le modal pour ajouter
  const handleAddNew = () => {
    setFormData({ userId: "", courseId: "", rating: 1, comment: "" });
    setEditingId(null);
    setShowModal(true);
  };

  // Afficher les détails d'une review
  const showDetails = (review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  // Rafraîchir les utilisateurs manuellement
  const handleRefreshUsers = () => {
    fetchUsers();
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = reviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Styles inline
  const styles = {
    container: { padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#2d3748', margin: 0 },
    addButton: { backgroundColor: '#3182ce', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '16px', transition: 'all 0.2s' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', width: '100%', maxWidth: '600px', margin: '20px', maxHeight: '90vh', overflow: 'auto' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #e2e8f0' },
    modalTitle: { fontSize: '20px', fontWeight: '600', color: '#2d3748', margin: 0 },
    closeButton: { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', borderRadius: '4px' },
    form: { padding: '24px' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px' },
    formGroup: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' },
    input: { width: '100%', border: '1px solid #d1d5db', padding: '12px', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' },
    textarea: { width: '100%', border: '1px solid #d1d5db', padding: '12px', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box', resize: 'vertical', minHeight: '100px' },
    ratingContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
    buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' },
    cancelButton: { padding: '12px 24px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#374151', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
    saveButton: { padding: '12px 24px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
    table: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' },
    tableHeader: { backgroundColor: '#f7fafc', padding: '12px', textAlign: 'left', fontWeight: '600', color: '#2d3748', border: '1px solid #e2e8f0', fontSize: '12px', textTransform: 'uppercase' },
    tableCell: { padding: '12px', border: '1px solid #e2e8f0' },
    actionButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '8px', margin: '0 4px', borderRadius: '4px' },
    modalBody: { padding: '24px' },
    reviewInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    reviewName: { fontWeight: '600', color: '#2d3748' },
    pagination: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '20px',
      padding: '16px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    paginationButton: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      color: '#374151',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      margin: '0 4px',
      transition: 'all 0.2s'
    },
    paginationButtonDisabled: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      backgroundColor: '#f9fafb',
      color: '#9ca3af',
      borderRadius: '6px',
      cursor: 'not-allowed',
      margin: '0 4px'
    },
    paginationSelect: {
      border: '1px solid #d1d5db',
      padding: '8px',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: 'white'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column' }}>
          <div style={{ fontSize: '18px', marginBottom: '20px' }}>Chargement des reviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header avec bouton Add Review et Refresh Users */}
      <div style={styles.header}>
        <h2 style={styles.title}>Gestion des Reviews</h2>
        <button
          style={{ ...styles.addButton, backgroundColor: '#4a5568', marginRight: '10px' }}
          onClick={handleRefreshUsers}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2d3748'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4a5568'}
        >
          Refresh Users
        </button>
        <button
          style={styles.addButton}
          onClick={handleAddNew}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
        >
          <PlusIcon />
          Add Review
        </button>
      </div>

      {/* Modal de formulaire */}
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingId ? "Modifier la review" : "Ajouter une nouvelle review"}
              </h3>
              <button
                style={styles.closeButton}
                onClick={handleCancel}
                onMouseOver={(e) => e.target.style.color = '#6b7280'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}
              >
                <CloseIcon />
              </button>
            </div>

            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Utilisateur ({users.length} disponible{users.length > 1 ? 's' : ''})</label>
                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  >
                    <option value="">Sélectionnez un utilisateur</option>
                    {users.length === 0 ? (
                      <option value="" disabled>Aucun utilisateur disponible</option>
                    ) : (
                      users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.username || user.name || user.email}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Cours ({courses.length} disponible{courses.length > 1 ? 's' : ''})</label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  >
                    <option value="">Sélectionnez un cours</option>
                    {courses.length === 0 ? (
                      <option value="" disabled>Aucun cours disponible</option>
                    ) : (
                      courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Note</label>
                  <div style={styles.ratingContainer}>
                    {renderStars(formData.rating, true, (val) =>
                      setFormData({ ...formData, rating: val })
                    )}
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {formData.rating}/5 étoiles
                    </span>
                  </div>
                </div>

                <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>Commentaire</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder="Entrez votre commentaire..."
                    required
                  />
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={styles.cancelButton}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.saveButton}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
                >
                  {editingId ? "Save Changes" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de détails */}
      {showDetailModal && selectedReview && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Détails de la review</h3>
              <button
                style={styles.closeButton}
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedReview(null);
                }}
                onMouseOver={(e) => e.target.style.color = '#6b7280'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}
              >
                <CloseIcon />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.reviewInfo}>
                <div>
                  <div style={styles.reviewName}>{getUserName(selectedReview.userId)}</div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>{getCourseTitle(selectedReview.courseId)}</div>
                </div>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <p><strong>ID:</strong> {selectedReview._id}</p>
                <p><strong>Utilisateur:</strong> {getUserName(selectedReview.userId)}</p>
                <p><strong>Cours:</strong> {getCourseTitle(selectedReview.courseId)}</p>
                <p><strong>Note:</strong> {renderStars(selectedReview.rating)} ({selectedReview.rating}/5 étoiles)</p>
                <p><strong>Commentaire:</strong> {selectedReview.comment || "Aucun commentaire"}</p>
                <p><strong>Date:</strong> {new Date(selectedReview.createdAt || selectedReview.updatedAt).toLocaleDateString('fr-FR')}</p>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedReview(null);
                  }}
                  style={styles.cancelButton}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={styles.table}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748' }}>
            Liste des Reviews ({reviews.length})
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
            <i className="fas fa-table"></i>
            Dernière mise à jour: {new Date().toLocaleTimeString("fr-FR")}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Utilisateur</th>
              <th style={styles.tableHeader}>Cours</th>
              <th style={styles.tableHeader}>Note</th>
              <th style={styles.tableHeader}>Commentaire</th>
              <th style={styles.tableHeader}>Date</th>
              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ ...styles.tableCell, textAlign: 'center', color: '#6b7280', padding: '48px' }}>
                  <i className="fas fa-star" style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '16px', display: 'block' }}></i>
                  <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#2d3748', marginBottom: '8px' }}>
                    Aucune review trouvée
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    Aucune review n'a été enregistrée pour le moment.
                  </p>
                </td>
              </tr>
            ) : (
              currentReviews.map((review) => (
                <tr key={review._id} style={{ backgroundColor: 'white' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  <td style={styles.tableCell}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-user" style={{ color: '#3b82f6', fontSize: '14px' }}></i>
                      </div>
                      <div style={{ fontWeight: '500', color: '#2d3748' }}>{getUserName(review.userId)}</div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={{ fontWeight: '500', color: '#2d3748' }}>{getCourseTitle(review.courseId)}</div>
                  </td>
                  <td style={styles.tableCell}>
                    {renderStars(review.rating)}
                  </td>
                  <td style={{ ...styles.tableCell, maxWidth: '200px' }}>
                    <div style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      {review.comment || "Aucun commentaire"}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={{ color: '#6b7280' }}>{new Date(review.createdAt || review.updatedAt).toLocaleDateString('fr-FR')}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(review.createdAt || review.updatedAt).toLocaleTimeString('fr-FR')}</div>
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(review)}
                        style={{ ...styles.actionButton, color: '#3182ce' }}
                        title="Modifier"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#cec7feff'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => showDetails(review)}
                        style={{ ...styles.actionButton, color: '#199066ff' }}
                        title="Voir les détails"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#dbeafe'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        style={{ ...styles.actionButton, color: '#dc2626' }}
                        title="Supprimer"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {currentReviews.length > 0 && (
          <div style={styles.pagination}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>Éléments par page :</span>
              <select
                style={styles.paginationSelect}
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                style={currentPage === 1 ? styles.paginationButtonDisabled : styles.paginationButton}
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                onMouseOver={(e) => currentPage !== 1 && (e.target.style.backgroundColor = '#f9fafb')}
                onMouseOut={(e) => currentPage !== 1 && (e.target.style.backgroundColor = 'white')}
              >
                &lt;&lt;
              </button>
              <button
                style={currentPage === 1 ? styles.paginationButtonDisabled : styles.paginationButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                onMouseOver={(e) => currentPage !== 1 && (e.target.style.backgroundColor = '#f9fafb')}
                onMouseOut={(e) => currentPage !== 1 && (e.target.style.backgroundColor = 'white')}
              >
                &lt;
              </button>
              <span>
                Page {currentPage} sur {totalPages}
              </span>
              <button
                style={currentPage === totalPages ? styles.paginationButtonDisabled : styles.paginationButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                onMouseOver={(e) => currentPage !== totalPages && (e.target.style.backgroundColor = '#f9fafb')}
                onMouseOut={(e) => currentPage !== totalPages && (e.target.style.backgroundColor = 'white')}
              >
                &gt;
              </button>
              <button
                style={currentPage === totalPages ? styles.paginationButtonDisabled : styles.paginationButton}
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                onMouseOver={(e) => currentPage !== totalPages && (e.target.style.backgroundColor = '#f9fafb')}
                onMouseOut={(e) => currentPage !== totalPages && (e.target.style.backgroundColor = 'white')}
              >
                &gt;&gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}