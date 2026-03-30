// CardPageVisits.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API_BASE_URL = "http://localhost:5000/courses";

export default function CardPageVisits() {
  const [data, setData] = useState([]);

  // Couleurs pour les statuts
  const COLORS = {
    disponible: "#22c55e", // vert
    réservé: "#facc15",    // jaune
    terminé: "#ef4444",    // rouge
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(API_BASE_URL);

        // Compter les cours par statut
        const statusCount = res.data.reduce(
          (acc, course) => {
            const status = course.status || "inconnu";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          },
          {}
        );

        // Transformer en tableau pour le piechart
        const formattedData = Object.keys(statusCount).map((key) => ({
          name: key,
          value: statusCount[key],
        }));

        setData(formattedData);
      } catch (err) {
        console.error("Erreur lors du chargement des cours:", err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="bg-white shadow rounded-2xl p-6 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
Course statistics by status      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500 text-center">Aucune donnée disponible</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || "#9ca3af"} // gris par défaut si inconnu
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} cours`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
