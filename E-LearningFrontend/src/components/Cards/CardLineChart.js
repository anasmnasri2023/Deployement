import React, { useState, useEffect } from "react";
import * as Chart from "chart.js";

export default function CardLineChart() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "http://localhost:5000";

  // Fetch users from API
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

  useEffect(() => {
    if (!loading && users.length > 0) {
      // Process data for the last 7 months
      const months = [];
      const currentDate = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        months.push({
          name: date.toLocaleDateString('en-US', { month: 'long' }),
          year: date.getFullYear(),
          month: date.getMonth()
        });
      }

      // Calculate active and inactive users per month
      const activeData = [];
      const inactiveData = [];

      months.forEach(monthInfo => {
        const monthUsers = users.filter(user => {
          const userDate = new Date(user.joinDate);
          return userDate.getFullYear() === monthInfo.year && 
                 userDate.getMonth() === monthInfo.month;
        });

        const activeCount = monthUsers.filter(user => user.status === 'Active').length;
        const inactiveCount = monthUsers.filter(user => user.status === 'Inactive' || user.status === 'Blocked').length;

        activeData.push(activeCount);
        inactiveData.push(inactiveCount);
      });

      // Destroy existing chart if it exists
      if (window.myLine) {
        window.myLine.destroy();
      }

      var config = {
        type: "line",
        data: {
          labels: months.map(m => m.name),
          datasets: [
            {
              label: "Active Users",
              backgroundColor: "#3182ce",
              borderColor: "#3182ce",
              data: activeData,
              fill: false,
              tension: 0.4,
              pointBackgroundColor: "#3182ce",
              pointBorderColor: "#3182ce",
              pointRadius: 6,
              pointHoverRadius: 8,
            },
            {
              label: "Inactive Users",
              fill: false,
              backgroundColor: "#dc2626",
              borderColor: "#dc2626",
              data: inactiveData,
              tension: 0.4,
              pointBackgroundColor: "#dc2626",
              pointBorderColor: "#dc2626",
              pointRadius: 6,
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          title: {
            display: false,
            text: "User Status Trends",
            fontColor: "white",
          },
          legend: {
            labels: {
              fontColor: "white",
            },
            align: "end",
            position: "bottom",
          },
          tooltips: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: function(tooltipItem, data) {
                const total = activeData[tooltipItem.index] + inactiveData[tooltipItem.index];
                const percentage = total > 0 ? ((tooltipItem.value / total) * 100).toFixed(1) : 0;
                return `${data.datasets[tooltipItem.datasetIndex].label}: ${tooltipItem.value} (${percentage}%)`;
              }
            }
          },
          hover: {
            mode: "nearest",
            intersect: true,
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: "rgba(255,255,255,.7)",
                },
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "Month",
                  fontColor: "white",
                },
                gridLines: {
                  display: false,
                  borderDash: [2],
                  borderDashOffset: [2],
                  color: "rgba(33, 37, 41, 0.3)",
                  zeroLineColor: "rgba(0, 0, 0, 0)",
                  zeroLineBorderDash: [2],
                  zeroLineBorderDashOffset: [2],
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: "rgba(255,255,255,.7)",
                  beginAtZero: true,
                  stepSize: 1
                },
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "Number of Users",
                  fontColor: "white",
                },
                gridLines: {
                  borderDash: [3],
                  borderDashOffset: [3],
                  drawBorder: false,
                  color: "rgba(255, 255, 255, 0.15)",
                  zeroLineColor: "rgba(33, 37, 41, 0)",
                  zeroLineBorderDash: [2],
                  zeroLineBorderDashOffset: [2],
                },
              },
            ],
          },
        },
      };

      var ctx = document.getElementById("line-chart").getContext("2d");
      window.myLine = new Chart.Chart(ctx, config);
    }
  }, [users, loading]);

  // Calculate global statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'Active').length;
  const inactiveUsers = users.filter(user => user.status !== 'Active').length;
  const activePercentage = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: 'white' }}>Loading user data...</div>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                Overview
              </h6>
              <h2 className="text-white text-xl font-semibold">User Status Trends</h2>
            </div>
            <div className="relative w-auto pl-4 flex-initial">
              <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-red-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">


          {/* Chart */}
          <div className="relative h-350-px">
            <canvas id="line-chart"></canvas>
          </div>
        </div>
      </div>
    </>
  );
}