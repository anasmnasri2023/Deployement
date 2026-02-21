import React, { useState, useEffect } from "react";

export default function UserStatsChart() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);
  const API_BASE_URL = "http://localhost:5000";

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/getAllUsers`);
      const data = await response.json();
      
      if (response.ok) {
        const adaptedUsers = data.UserList.map(user => ({
          id: user._id,
          status: user.isBloked ? "Blocked" : (user.statu ? "Active" : "Inactive"),
          joinDate: user.createdAt ? new Date(user.createdAt) : new Date()
        }));
        setUsers(adaptedUsers);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Traiter les données pour le graphique (6 derniers mois)
  const getChartData = () => {
    const months = [];
    const currentDate = new Date();
    
    // Générer les 6 derniers mois
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({
        name: date.toLocaleDateString('fr-FR', { month: 'short' }),
        year: date.getFullYear(),
        month: date.getMonth()
      });
    }

    // Calculer les données pour chaque mois
    return months.map(monthInfo => {
      const monthUsers = users.filter(user => {
        const userDate = new Date(user.joinDate);
        return userDate.getFullYear() === monthInfo.year && 
               userDate.getMonth() === monthInfo.month;
      });

      const activeCount = monthUsers.filter(user => user.status === 'Active').length;
      const inactiveCount = monthUsers.filter(user => user.status === 'Inactive' || user.status === 'Blocked').length;
      const total = activeCount + inactiveCount;

      return {
        month: monthInfo.name,
        activeCount,
        inactiveCount,
        activePercentage: total > 0 ? ((activeCount / total) * 100).toFixed(1) : 0,
        inactivePercentage: total > 0 ? ((inactiveCount / total) * 100).toFixed(1) : 0,
        total
      };
    });
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(d => Math.max(d.activeCount, d.inactiveCount))) || 10;

  const chartStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    margin: '10px',
    maxWidth: '600px'
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2d3748',
    margin: '0 0 4px 0',
    textAlign: 'center'
  };

  const subtitleStyle = {
    color: '#6b7280',
    fontSize: '12px',
    margin: '0 0 12px 0',
    textAlign: 'center'
  };

  const legendStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '12px',
    fontSize: '11px'
  };

  const chartContainerStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '180px',
    position: 'relative',
    borderBottom: '1px solid #e5e7eb',
    borderLeft: '1px solid #e5e7eb'
  };

  const monthGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    flex: 1
  };

  const barsContainerStyle = {
    display: 'flex',
    gap: '2px',
    alignItems: 'flex-end'
  };

  const getBarStyle = (value, isActive) => ({
    width: '20px',
    backgroundColor: isActive ? '#3182ce' : '#dc2626',
    borderRadius: '2px 2px 0 0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    height: `${(value / maxValue) * 150}px`,
    minHeight: value > 0 ? '3px' : '0px',
    position: 'relative'
  });

  const tooltipStyle = {
    position: 'absolute',
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    zIndex: 1000,
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const triangleStyle = {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderTop: '4px solid #1f2937'
  };

  const summaryStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '12px',
    padding: '8px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    fontSize: '11px'
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={chartStyle}>
      {/* Titre compact */}
      <h3 style={titleStyle}>User Statistics</h3>
      <p style={subtitleStyle}>Monthly Distribution</p>

      {/* Légende compacte */}
      <div style={legendStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: '#3182ce', 
            borderRadius: '2px' 
          }}></div>
          <span>Active</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: '#dc2626', 
            borderRadius: '2px' 
          }}></div>
          <span>Inactive</span>
        </div>
      </div>

      {/* Graphique compact */}
      <div style={chartContainerStyle}>
        {chartData.map((data, index) => (
          <div key={index} style={monthGroupStyle}>
            <div style={barsContainerStyle}>
              {/* Barre Active (Bleu) */}
              <div
                style={getBarStyle(data.activeCount, true)}
                onMouseEnter={() => setHoveredBar(`active-${index}`)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {hoveredBar === `active-${index}` && (
                  <div style={tooltipStyle}>
                    Active: {data.activePercentage}%
                    <div style={triangleStyle}></div>
                  </div>
                )}
              </div>
              
              {/* Barre Inactive (Rouge) */}
              <div
                style={getBarStyle(data.inactiveCount, false)}
                onMouseEnter={() => setHoveredBar(`inactive-${index}`)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {hoveredBar === `inactive-${index}` && (
                  <div style={tooltipStyle}>
                    Inactive: {data.inactivePercentage}%
                    <div style={triangleStyle}></div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Label du mois */}
            <div style={{ 
              marginTop: '4px', 
              fontSize: '10px', 
              fontWeight: '500',
              color: '#6b7280'
            }}>
              {data.month}
            </div>
          </div>
        ))}
      </div>

      {/* Résumé compact */}
      <div style={summaryStyle}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#3182ce' }}>
            {users.filter(user => user.status === 'Active').length}
          </div>
          <div style={{ color: '#6b7280' }}>Active</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#dc2626' }}>
            {users.filter(user => user.status !== 'Active').length}
          </div>
          <div style={{ color: '#6b7280' }}>Inactive</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151' }}>
            {users.length}
          </div>
          <div style={{ color: '#6b7280' }}>Total</div>
        </div>
      </div>
    </div>
  );
}