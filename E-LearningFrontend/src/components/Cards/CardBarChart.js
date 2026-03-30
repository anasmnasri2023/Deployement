import React, { useState, useEffect } from "react";

export default function UserStatsChart() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);
  const API_BASE_URL = "http://localhost:5000";

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/getAllUsers`);
      const data = await response.json();
      const usersArray = data.UserList || data.users || data;
      if (!Array.isArray(usersArray)) return;

      const adaptedUsers = usersArray.map(user => ({
        id: user._id,
        status: user.isBloked ? "Blocked" : user.statu ? "Active" : "Inactive",
        joinDate: user.createdAt ? new Date(user.createdAt) : new Date()
      }));
      setUsers(adaptedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const getChartData = () => {
    if (users.length === 0) return [];

    // Find the earliest and latest user join dates
    const dates = users.map(u => new Date(u.joinDate));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(); // today

    // Build month range: 1 month before earliest → current month
    const startYear = minDate.getFullYear();
    const startMonth = minDate.getMonth() - 1; // 1 month buffer before first user
    const endYear = maxDate.getFullYear();
    const endMonth = maxDate.getMonth();

    const months = [];
    let y = startYear;
    let m = startMonth;

    // Normalize negative month
    if (m < 0) { m = 11; y -= 1; }

    while (y < endYear || (y === endYear && m <= endMonth)) {
      const date = new Date(y, m, 1);
      months.push({
        name: date.toLocaleDateString('en-US', { month: 'short' }),
        year: y,
        month: m
      });
      m++;
      if (m > 11) { m = 0; y++; }
    }

    return months.map(monthInfo => {
      const monthUsers = users.filter(user => {
        const d = new Date(user.joinDate);
        return d.getFullYear() === monthInfo.year && d.getMonth() === monthInfo.month;
      });

      const activeCount = monthUsers.filter(u => u.status === 'Active').length;
      const inactiveCount = monthUsers.filter(u => u.status !== 'Active').length;
      const total = activeCount + inactiveCount;

      return {
        month: monthInfo.name,
        year: monthInfo.year,
        activeCount,
        inactiveCount,
        activePercentage: total > 0 ? ((activeCount / total) * 100).toFixed(1) : 0,
        inactivePercentage: total > 0 ? ((inactiveCount / total) * 100).toFixed(1) : 0,
        total
      };
    });
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(d => Math.max(d.activeCount, d.inactiveCount)), 1);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      margin: '10px',
      width: '100%',
      maxWidth: '700px'
    }}>
      {/* Title */}
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2d3748', margin: '0 0 2px 0', textAlign: 'center' }}>
        User Statistics
      </h3>
      <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 12px 0', textAlign: 'center' }}>
        Monthly Distribution
      </p>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '12px', fontSize: '11px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#3182ce', borderRadius: '2px' }}></div>
          <span>Active</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#dc2626', borderRadius: '2px' }}></div>
          <span>Inactive</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: '180px',
        borderBottom: '1px solid #e5e7eb',
        borderLeft: '1px solid #e5e7eb',
        overflowX: 'auto',
        gap: '4px',
        padding: '0 4px'
      }}>
        {chartData.map((data, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '30px', flex: 1 }}>
            <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end' }}>
              {/* Active bar */}
              <div
                style={{
                  width: '12px',
                  backgroundColor: data.activeCount > 0 ? '#3182ce' : '#e5e7eb',
                  borderRadius: '2px 2px 0 0',
                  cursor: 'pointer',
                  height: `${Math.max((data.activeCount / maxValue) * 150, data.activeCount > 0 ? 3 : 0)}px`,
                  position: 'relative',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={() => setHoveredBar(`active-${index}`)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {hoveredBar === `active-${index}` && data.activeCount > 0 && (
                  <div style={{
                    position: 'absolute', bottom: '100%', left: '50%',
                    transform: 'translateX(-50%)', marginBottom: '4px',
                    backgroundColor: '#1f2937', color: 'white',
                    padding: '3px 6px', borderRadius: '4px',
                    fontSize: '10px', whiteSpace: 'nowrap', zIndex: 1000
                  }}>
                    Active: {data.activeCount} ({data.activePercentage}%)
                  </div>
                )}
              </div>
              {/* Inactive bar */}
              <div
                style={{
                  width: '12px',
                  backgroundColor: data.inactiveCount > 0 ? '#dc2626' : '#e5e7eb',
                  borderRadius: '2px 2px 0 0',
                  cursor: 'pointer',
                  height: `${Math.max((data.inactiveCount / maxValue) * 150, data.inactiveCount > 0 ? 3 : 0)}px`,
                  position: 'relative',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={() => setHoveredBar(`inactive-${index}`)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {hoveredBar === `inactive-${index}` && data.inactiveCount > 0 && (
                  <div style={{
                    position: 'absolute', bottom: '100%', left: '50%',
                    transform: 'translateX(-50%)', marginBottom: '4px',
                    backgroundColor: '#1f2937', color: 'white',
                    padding: '3px 6px', borderRadius: '4px',
                    fontSize: '10px', whiteSpace: 'nowrap', zIndex: 1000
                  }}>
                    Inactive: {data.inactiveCount} ({data.inactivePercentage}%)
                  </div>
                )}
              </div>
            </div>
            {/* Month label */}
            <div style={{ marginTop: '4px', fontSize: '9px', fontWeight: '500', color: '#6b7280', textAlign: 'center' }}>
              {data.month}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{
        display: 'flex', justifyContent: 'space-around', marginTop: '12px',
        padding: '8px', backgroundColor: '#f9fafb', borderRadius: '6px', fontSize: '11px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#3182ce' }}>
            {users.filter(u => u.status === 'Active').length}
          </div>
          <div style={{ color: '#6b7280' }}>Active</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#dc2626' }}>
            {users.filter(u => u.status !== 'Active').length}
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