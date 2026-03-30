import React, { useState, useEffect } from "react";
import axios from "axios";

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

const EyeIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M2.146 2.146a.5.5 0 0 1 .708 0L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854a.5.5 0 0 1 0-.708z"/>
  </svg>
);

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    userId: "",
    courseId: "",
    amount: "",
    currency: "TND",
    status: "en attente",
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
  });

  // URLs de base pour l'API
  const API_BASE_URL = "http://localhost:5000/payments";
  const USERS_API_URL = "http://localhost:5000/users/getAllUsers";
  const COURSES_API_URL = "http://localhost:5000/courses";

  // Fonction pour récupérer le token d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Récupération des utilisateurs
  const fetchUsers = async () => {
    try {
      const res = await axios.get(USERS_API_URL, { headers: getAuthHeaders() });
      console.log("Réponse API utilisateurs:", res.data);
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (res.data && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else if (res.data && Array.isArray(res.data.UserList)) {
        setUsers(res.data.UserList.map(user => ({
          _id: user._id,
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        })));
      } else {
        console.error("Structure de données utilisateurs inattendue:", res.data);
        setUsers([]);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs:", err);
      setUsers([]);
    }
  };

  // Récupération des cours
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

  // Récupération des paiements
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(API_BASE_URL, {
        headers: getAuthHeaders(),
      });

      const transformedPayments = response.data.map((payment) => ({
        id: payment._id,
        student: payment.userId
          ? `${payment.userId.firstName || ""} ${payment.userId.lastName || ""}`.trim()
          : "Étudiant inconnu",
        course: payment.courseId?.title || "Cours inconnu",
        amount: payment.amount,
        currency: payment.currency || "TND",
        status: payment.status,
        transactionId: payment.transactionId || "N/A",
        date: payment.createdAt
          ? new Date(payment.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      }));

      setPayments(transformedPayments);
      setFilteredPayments(transformedPayments);
      calculateLocalStats(transformedPayments);
    } catch (error) {
      console.error("Erreur lors du chargement des paiements:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchUsers(), fetchCourses(), fetchPayments()]);
      } catch (error) {
        console.error("Erreur générale lors du chargement:", error);
      }
    };
    loadAllData();
  }, []);

  const calculateLocalStats = (paymentsData) => {
    const localStats = {
      totalRevenue: paymentsData.reduce(
        (sum, payment) => (payment.status === "réussi" ? sum + payment.amount : sum),
        0
      ),
      totalTransactions: paymentsData.length,
      completedPayments: paymentsData.filter((p) => p.status === "réussi").length,
      pendingPayments: paymentsData.filter((p) => p.status === "en attente").length,
      failedPayments: paymentsData.filter((p) => p.status === "échoué").length,
    };
    setStats(localStats);
  };

  // Supprimer un paiement
  const deletePayment = async (paymentId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce paiement ?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/${paymentId}`, {
        headers: getAuthHeaders(),
      });
      await fetchPayments();
      alert("Paiement supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert(`Erreur lors de la suppression: ${error.response?.data?.message || error.message}`);
    }
  };

  // Mettre à jour le statut d'un paiement
  const updatePaymentStatus = async (paymentId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE_URL}/${paymentId}`,
        { status: newStatus },
        { headers: getAuthHeaders() }
      );
      await fetchPayments();
      alert(`Statut mis à jour avec succès: ${newStatus}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert(`Erreur lors de la mise à jour: ${error.response?.data?.message || error.message}`);
    }
  };

  // Ajouter ou modifier un paiement
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.courseId || !formData.amount) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/${editingId}`,
          { ...formData, amount: parseFloat(formData.amount) },
          { headers: getAuthHeaders() }
        );
        alert("Paiement modifié avec succès !");
      } else {
        await axios.post(
          API_BASE_URL,
          { ...formData, amount: parseFloat(formData.amount) },
          { headers: getAuthHeaders() }
        );
        alert("Paiement ajouté avec succès !");
      }
      setFormData({ userId: "", courseId: "", amount: "", currency: "TND", status: "en attente" });
      setEditingId(null);
      setShowFormModal(false);
      fetchPayments();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert(`Erreur lors de la sauvegarde du paiement: ${err.response?.data?.message || err.message}`);
    }
  };

  // Mettre en édition
  const handleEdit = (payment) => {
    setFormData({
      userId: payment.userId?._id || payment.userId || "",
      courseId: payment.courseId?._id || payment.courseId || "",
      amount: payment.amount || "",
      currency: payment.currency || "TND",
      status: payment.status || "en attente",
    });
    setEditingId(payment.id);
    setShowFormModal(true);
  };

  // Annuler l'édition
  const handleCancel = () => {
    setFormData({ userId: "", courseId: "", amount: "", currency: "TND", status: "en attente" });
    setEditingId(null);
    setShowFormModal(false);
  };

  // Ouvrir le modal pour ajouter
  const handleAddNew = () => {
    setFormData({ userId: "", courseId: "", amount: "", currency: "TND", status: "en attente" });
    setEditingId(null);
    setShowFormModal(true);
  };

  // Afficher les détails d'un paiement
  const showDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  // Rafraîchir les utilisateurs manuellement
  const handleRefreshUsers = () => {
    fetchUsers();
  };

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Filtrage des paiements
  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    if (dateRange !== "all") {
      const today = new Date();
      const filterDate = new Date();

      switch (dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(today.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(today.getMonth() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(
        (payment) => new Date(payment.date) >= filterDate
      );
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter, dateRange]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "réussi":
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case "en attente":
        return { backgroundColor: '#fef3c7', color: '#d97706' };
      case "échoué":
        return { backgroundColor: '#fee2e2', color: '#dc2626' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const exportPayments = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Étudiant,Cours,Montant,Devise,Statut,Date,Transaction ID\n" +
      filteredPayments
        .map(
          (payment) =>
            `${payment.id},${payment.student},${payment.course},${payment.amount},${payment.currency},${payment.status},${payment.date},${payment.transactionId}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payments_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange("all");
  };

  // Styles inline
  const styles = {
    container: { padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#2d3748', margin: 0 },
    subtitle: { color: '#6b7280', fontSize: '16px', marginTop: '4px' },
    button: { backgroundColor: '#3182ce', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '16px', transition: 'all 0.2s' },
    buttonDisabled: { backgroundColor: '#9ca3af', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '16px' },
    error: { backgroundColor: '#fee2e2', border: '1px solid #f87171', color: '#dc2626', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    success: { backgroundColor: '#dcfce7', border: '1px solid #4ade80', color: '#166534', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' },
    statsCard: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '24px', transition: 'transform 0.2s' },
    statsIcon: { padding: '12px', borderRadius: '9999px' },
    filterContainer: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '24px' },
    filterTitle: { fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '16px' },
    filterGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center' },
    searchContainer: { position: 'relative' },
    searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' },
    input: { width: '100%', border: '1px solid #d1d5db', padding: '12px 12px 12px 40px', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' },
    select: { width: '100%', border: '1px solid #d1d5db', padding: '12px', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box', backgroundColor: 'white' },
    filterButton: { backgroundColor: '#6b7280', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '16px', transition: 'all 0.2s' },
    filterInfo: { display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' },
    tableContainer: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' },
    tableHeader: { backgroundColor: '#f7fafc', padding: '12px', textAlign: 'left', fontWeight: '600', color: '#2d3748', border: '1px solid #e2e8f0', fontSize: '12px', textTransform: 'uppercase' },
    tableCell: { padding: '12px', border: '1px solid #e2e8f0' },
    actionButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '8px', margin: '0 4px', borderRadius: '4px' },
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
    select: { width: '100%', border: '1px solid #d1d5db', padding: '12px', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box', backgroundColor: 'white' },
    buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' },
    cancelButton: { padding: '12px 24px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#374151', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
    saveButton: { padding: '12px 24px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
    modalBody: { padding: '24px' },
    paymentInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    paymentName: { fontWeight: '600', color: '#2d3748' },
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
          <div style={{ fontSize: '18px', marginBottom: '20px' }}>Chargement des paiements...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* En-tête */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestion des Paiements</h1>
          <p style={styles.subtitle}>Suivez et gérez tous les paiements de la plateforme</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{ ...styles.button, backgroundColor: '#4a5568', marginRight: '10px' }}
            onClick={handleRefreshUsers}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2d3748'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4a5568'}
          >
            Refresh Users
          </button>
          <button
            style={styles.button}
            onClick={handleAddNew}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
          >
            <PlusIcon />
            Add Payment
          </button>
          <button
            style={loading ? styles.buttonDisabled : styles.button}
            onClick={fetchPayments}
            disabled={loading}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#2c5282')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#3182ce')}
          >
            <i className={`fas ${loading ? "fa-spinner fa-spin" : "fa-sync-alt"}`}></i>
            <span style={{ marginLeft: '8px' }}>{loading ? "Chargement..." : "Actualiser"}</span>
          </button>
          <button
            style={filteredPayments.length === 0 ? styles.buttonDisabled : styles.button}
            onClick={exportPayments}
            disabled={filteredPayments.length === 0}
            onMouseOver={(e) => filteredPayments.length > 0 && (e.target.style.backgroundColor = '#2c5282')}
            onMouseOut={(e) => filteredPayments.length > 0 && (e.target.style.backgroundColor = '#3182ce')}
          >
            <i className="fas fa-download"></i>
            <span style={{ marginLeft: '8px' }}>Exporter CSV</span>
          </button>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div style={styles.error}>
          <div>
            <strong>Erreur:</strong> {error}
          </div>
          <button
            onClick={() => setError(null)}
            style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '18px' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Message de succès */}
      {!loading && !error && payments.length > 0 && (
        <div style={styles.success}>
          <i className="fas fa-check-circle"></i>
          Données chargées avec succès. {payments.length} paiements trouvés.
        </div>
      )}

      {/* Cartes de statistiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={styles.statsCard}
             onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
             onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Revenus Totaux</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748' }}>{stats.totalRevenue.toFixed(2)} TND</p>
            </div>
            <div style={{ ...styles.statsIcon, backgroundColor: '#dcfce7' }}>
              <i className="fas fa-dollar-sign" style={{ color: '#16a34a' }}></i>
            </div>
          </div>
        </div>
        <div style={styles.statsCard}
             onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
             onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Transactions</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748' }}>{stats.totalTransactions}</p>
            </div>
            <div style={{ ...styles.statsIcon, backgroundColor: '#dbeafe' }}>
              <i className="fas fa-credit-card" style={{ color: '#3b82f6' }}></i>
            </div>
          </div>
        </div>
        <div style={styles.statsCard}
             onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
             onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Paiements Réussis</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{stats.completedPayments}</p>
            </div>
            <div style={{ ...styles.statsIcon, backgroundColor: '#dcfce7' }}>
              <i className="fas fa-check-circle" style={{ color: '#16a34a' }}></i>
            </div>
          </div>
        </div>
        <div style={styles.statsCard}
             onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
             onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>En Attente</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>{stats.pendingPayments}</p>
              {stats.failedPayments > 0 && (
                <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{stats.failedPayments} échoués</p>
              )}
            </div>
            <div style={{ ...styles.statsIcon, backgroundColor: '#fef3c7' }}>
              <i className="fas fa-clock" style={{ color: '#d97706' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de formulaire */}
      {showFormModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingId ? "Modifier le paiement" : "Ajouter un nouveau paiement"}
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
                  <label style={styles.label}>
                    Utilisateur ({users.length} disponible{users.length > 1 ? 's' : ''})
                  </label>
                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    style={styles.select}
                    required
                  >
                    <option value="">Sélectionnez un utilisateur</option>
                    {users.length === 0 ? (
                      <option value="" disabled>Aucun utilisateur disponible</option>
                    ) : (
                      users.map((user) => (
                        <option key={user._id || user.id} value={user._id || user.id}>
                          {user.firstName || user.lastName
                            ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                            : user.email || `Utilisateur ${user._id}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Cours ({courses.length} disponible{courses.length > 1 ? 's' : ''})
                  </label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    style={styles.select}
                    required
                  >
                    <option value="">Sélectionnez un cours</option>
                    {courses.length === 0 ? (
                      <option value="" disabled>Aucun cours disponible</option>
                    ) : (
                      courses.map((course) => (
                        <option key={course._id || course.id} value={course._id || course.id}>
                          {course.title || course.name || `Cours ${course._id}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Montant</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    style={styles.input}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Devise</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="TND">TND</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Statut</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="en attente">En attente</option>
                    <option value="réussi">Réussi</option>
                    <option value="échoué">Échoué</option>
                  </select>
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
      {showDetailModal && selectedPayment && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Détails du paiement</h3>
              <button
                style={styles.closeButton}
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedPayment(null);
                }}
                onMouseOver={(e) => e.target.style.color = '#6b7280'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}
              >
                <CloseIcon />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.paymentInfo}>
                <div>
                  <div style={styles.paymentName}>{selectedPayment.student}</div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>{selectedPayment.course}</div>
                </div>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <p><strong>ID:</strong> {selectedPayment.id}</p>
                <p><strong>Étudiant:</strong> {selectedPayment.student}</p>
                <p><strong>Cours:</strong> {selectedPayment.course}</p>
                <p><strong>Montant:</strong> {selectedPayment.amount.toFixed(2)} {selectedPayment.currency}</p>
                <p><strong>Statut:</strong> {selectedPayment.status}</p>
                <p><strong>Date:</strong> {new Date(selectedPayment.date).toLocaleDateString('fr-FR')}</p>
                <p><strong>Transaction ID:</strong> {selectedPayment.transactionId}</p>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedPayment(null);
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

      {/* Filtres et recherche */}
      <div style={styles.filterContainer}>
        <h3 style={styles.filterTitle}>Filtres et Recherche</h3>
        <div style={styles.filterGrid}>
          <div style={styles.searchContainer}>
            <i className="fas fa-search" style={styles.searchIcon}></i>
            <input
              type="text"
              placeholder="Rechercher par nom, cours, ID..."
              style={styles.input}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            style={styles.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="réussi">Réussi</option>
            <option value="en attente">En attente</option>
            <option value="échoué">Échoué</option>
          </select>
          <select
            style={styles.select}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
          <button
            style={styles.filterButton}
            onClick={resetFilters}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
          >
            <i className="fas fa-filter"></i>
            <span style={{ marginLeft: '8px' }}>Réinitialiser</span>
          </button>
          <div style={styles.filterInfo}>
            <i className="fas fa-info-circle"></i>
            {filteredPayments.length} résultat(s)
          </div>
        </div>
      </div>

      {/* Tableau des paiements */}
      <div style={styles.tableContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748' }}>
            Liste des Paiements ({filteredPayments.length})
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
            <i className="fas fa-table"></i>
            Dernière mise à jour: {new Date().toLocaleTimeString("fr-FR")}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>ID Paiement</th>
              <th style={styles.tableHeader}>Étudiant</th>
              <th style={styles.tableHeader}>Cours</th>
              <th style={styles.tableHeader}>Montant</th>
              <th style={styles.tableHeader}>Statut</th>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Transaction ID</th>
              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ ...styles.tableCell, textAlign: 'center', color: '#6b7280', padding: '48px' }}>
                  <i className="fas fa-credit-card" style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '16px', display: 'block' }}></i>
                  <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#2d3748', marginBottom: '8px' }}>
                    Aucun paiement trouvé
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {searchTerm || statusFilter !== "all" || dateRange !== "all"
                      ? "Aucun paiement ne correspond à vos critères de recherche."
                      : "Aucun paiement n'a été enregistré pour le moment."}
                  </p>
                  {(searchTerm || statusFilter !== "all" || dateRange !== "all") && (
                    <button
                      onClick={resetFilters}
                      style={{ color: '#3b82f6', fontSize: '14px', marginTop: '12px', background: 'none', border: 'none' }}
                    >
                      <i className="fas fa-times" style={{ marginRight: '4px' }}></i>
                      Effacer les filtres
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              currentPayments.map((payment) => (
                <tr key={payment.id} style={{ backgroundColor: 'white' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  <td style={styles.tableCell}>
                    <span style={{ fontFamily: 'monospace' }}>{payment.id.substring(0, 8)}...</span>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-user" style={{ color: '#3b82f6', fontSize: '14px' }}></i>
                      </div>
                      <div style={{ fontWeight: '500', color: '#2d3748' }}>{payment.student}</div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={{ fontWeight: '500', color: '#2d3748' }}>{payment.course}</div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={{ fontWeight: '600', color: '#2d3748' }}>{payment.amount.toFixed(2)} {payment.currency}</div>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      ...getStatusColor(payment.status)
                    }}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={{ color: '#6b7280' }}>{new Date(payment.date).toLocaleDateString("fr-FR")}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(payment.date).toLocaleTimeString("fr-FR")}</div>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                      {payment.transactionId}
                    </span>
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(payment)}
                        style={{ ...styles.actionButton, color: '#3182ce' }}
                        title="Modifier"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#cec7feff'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <EditIcon />
                      </button>
                      {payment.status === "en attente" && (
                        <>
                          <button
                            onClick={() => updatePaymentStatus(payment.id, "réussi")}
                            style={{ ...styles.actionButton, color: '#16a34a' }}
                            title="Marquer comme réussi"
                            onMouseOver={(e) => e.target.style.backgroundColor = '#dcfce7'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            onClick={() => updatePaymentStatus(payment.id, "échoué")}
                            style={{ ...styles.actionButton, color: '#dc2626' }}
                            title="Marquer comme échoué"
                            onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => showDetails(payment)}
                        style={{ ...styles.actionButton, color: '#1b8a52ff' }}
                        title="Voir les détails"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#dbeafe'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => deletePayment(payment.id)}
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
        {currentPayments.length > 0 && (
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