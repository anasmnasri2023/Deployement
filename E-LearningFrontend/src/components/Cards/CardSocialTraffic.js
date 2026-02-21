import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/bookings";

// Icône pour les statistiques
const TrendingUpIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H9v1h4.586l-4.293 4.293-2.293-2.293a1 1 0 0 0-1.414 0L1 8.586l.707.707L6 5l2.293 2.293a1 1 0 0 0 1.414 0L15 2z"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
    <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zM1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
  </svg>
);

export default function CardSocialTraffic() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les réservations
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE_URL);
      const bookingsData = Array.isArray(res.data) ? res.data : [];
      setBookings(bookingsData);
      calculateStats(bookingsData);
      setError(null);
    } catch (err) {
      console.error("❌ Erreur lors du chargement des réservations:", err);
      setError("Erreur lors du chargement des données");
      setBookings([]);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const calculateStats = (bookingsData) => {
    const statusCounts = {};
    const total = bookingsData.length;

    // Compter les réservations par statut
    bookingsData.forEach(booking => {
      const status = booking.status || 'non défini';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Calculer les pourcentages et organiser les données
    const statsArray = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
      color: getStatusColor(status),
      bgColor: getStatusBgColor(status)
    }));

    // Trier par nombre de réservations (décroissant)
    statsArray.sort((a, b) => b.count - a.count);

    setStats({
      total,
      byStatus: statsArray
    });
  };

  // Couleurs selon le statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmé': return '#166534';
      case 'en attente': return '#d97706';
      case 'annulé': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'confirmé': return '#dcfce7';
      case 'en attente': return '#fef3c7';
      case 'annulé': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  // Charger les données au montage
  useEffect(() => {
    fetchBookings();
  }, []);

  // Styles
  const styles = {
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '16px',
      margin: '12px 0',
      maxWidth: '600px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '1px solid #e5e7eb'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    refreshButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    totalStats: {
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    totalNumber: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1e40af',
      margin: '0 0 4px 0'
    },
    totalLabel: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f9fafb',
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      borderBottom: '2px solid #e5e7eb'
    },
    tableRow: {
      borderBottom: '1px solid #f3f4f6'
    },
    tableCell: {
      padding: '16px',
      fontSize: '14px'
    },
    statusBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'capitalize'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      borderRadius: '4px',
      transition: 'width 0.5s ease-in-out'
    },
    countCell: {
      fontWeight: '600',
      fontSize: '16px'
    },
    percentageCell: {
      fontWeight: '500',
      color: '#6b7280'
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      flexDirection: 'column',
      gap: '12px'
    },
    errorMessage: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      padding: '16px',
      borderRadius: '8px',
      textAlign: 'center',
      fontSize: '14px'
    },
    emptyState: {
      textAlign: 'center',
      color: '#6b7280',
      padding: '40px 16px',
      fontSize: '16px'
    }
  };

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={styles.loadingSpinner}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.card}>
        <div style={styles.errorMessage}>
          {error}
          <button
            onClick={fetchBookings}
            style={{ ...styles.refreshButton, marginLeft: '12px' }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <div style={styles.card}>
        {/* En-tête */}
        <div style={styles.header}>
          <h3 style={styles.title}>
            <ChartIcon />
            Statistiques des Réservations
          </h3>
          <button
            onClick={fetchBookings}
            style={styles.refreshButton}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            <TrendingUpIcon />
            Actualiser
          </button>
        </div>

        {/* Statistiques totales */}
        <div style={styles.totalStats}>
          <div style={styles.totalNumber}>{stats.total || 0}</div>
          <p style={styles.totalLabel}>Total des Réservations</p>
        </div>

        {/* Tableau des statistiques */}
        {stats.byStatus && stats.byStatus.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Statut</th>
                <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Nombre</th>
                <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Pourcentage</th>
                <th style={styles.tableHeader}>Répartition</th>
              </tr>
            </thead>
            <tbody>
              {stats.byStatus.map((stat, index) => (
                <tr key={stat.status} style={styles.tableRow}>
                  {/* Statut avec badge coloré */}
                  <td style={styles.tableCell}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: stat.bgColor,
                        color: stat.color
                      }}
                    >
                      {stat.status}
                    </span>
                  </td>
                  
                  {/* Nombre */}
                  <td style={{ ...styles.tableCell, ...styles.countCell, textAlign: 'center' }}>
                    {stat.count}
                  </td>
                  
                  {/* Pourcentage */}
                  <td style={{ ...styles.tableCell, ...styles.percentageCell, textAlign: 'center' }}>
                    {stat.percentage}%
                  </td>
                  
                  {/* Barre de progression */}
                  <td style={styles.tableCell}>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${stat.percentage}%`,
                          backgroundColor: stat.color
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={styles.emptyState}>
            <p>Aucune donnée de réservation disponible</p>
            <button
              onClick={fetchBookings}
              style={styles.refreshButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              Charger les données
            </button>
          </div>
        )}

        {/* Résumé en bas */}
        {stats.byStatus && stats.byStatus.length > 0 && (
          <div style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <strong>Résumé:</strong> {stats.total} réservation{stats.total > 1 ? 's' : ''} au total, 
            répartie{stats.total > 1 ? 's' : ''} en {stats.byStatus.length} statut{stats.byStatus.length > 1 ? 's' : ''} différent{stats.byStatus.length > 1 ? 's' : ''}.
          </div>
        )}
      </div>
    </>
  );
}