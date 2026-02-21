import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

// Composant Chat principal
const ChatApp = () => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("68a74cb39942df4bd1019e3a"); // Utilisateur connecté (admin par exemple)
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Charger les utilisateurs au montage
  useEffect(() => {
    fetchUsers();
    testConnection();
  }, []);

  // Charger les messages quand un utilisateur est sélectionné
  useEffect(() => {
    if (currentUserId && selectedUserId) {
      fetchMessages();
    }
  }, [currentUserId, selectedUserId]);

  // Test de connexion backend
  const testConnection = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/health`);
      console.log("🟢 Backend connecté:", res.data);
    } catch (error) {
      console.error("🔴 Backend non accessible:", error);
      setError("Backend non accessible - Vérifiez que le serveur tourne sur le port 5000");
    }
  };

  // Récupérer la liste des utilisateurs
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      console.log("👥 Utilisateurs récupérés:", res.data);
      
      if (res.data && Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (res.data.data && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else {
        // Si pas d'API utilisateurs, créer des utilisateurs fictifs pour test
        setUsers([
          { _id: "68a74cb39942df4bd1019e3a", username: "Admin", email: "admin@test.com" },
          { _id: "68a74ccb9942df4bd1019e3c", username: "User1", email: "user1@test.com" },
          { _id: "68a74ccb9942df4bd1019e3d", username: "User2", email: "user2@test.com" }
        ]);
      }
    } catch (error) {
      console.error("Erreur récupération utilisateurs:", error);
      // Utilisateurs fictifs pour test
      setUsers([
        { _id: "68a74cb39942df4bd1019e3a", username: "Admin", email: "admin@test.com" },
        { _id: "68a74ccb9942df4bd1019e3c", username: "User1", email: "user1@test.com" },
        { _id: "68a74ccb9942df4bd1019e3d", username: "User2", email: "user2@test.com" }
      ]);
    }
  };

  // Récupérer les messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("🔄 Chargement des messages entre:", currentUserId, "et", selectedUserId);
      
      const res = await axios.get(`${API_URL}/chat/messages/${currentUserId}/${selectedUserId}`);
      
      console.log("📨 Réponse API:", res.data);
      
      if (res.data.success) {
        console.log("✅ Messages reçus:", res.data.data.length, "messages");
        setMessages(res.data.data);
      } else {
        console.error("❌ Échec récupération:", res.data.message);
        setError("Erreur lors du chargement des messages");
      }
    } catch (error) {
      console.error("❌ Erreur réseau lors du chargement des messages:", error);
      setError(`Impossible de charger les messages: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Envoyer un message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    try {
      setError("");
      
      console.log("📤 Envoi message:", {
        senderId: currentUserId,
        receiverId: selectedUserId,
        message: newMessage,
      });
      
      const res = await axios.post(`${API_URL}/chat/send`, {
        senderId: currentUserId,
        receiverId: selectedUserId,
        message: newMessage,
      });

      console.log("📨 Réponse envoi:", res.data);

      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.data]);
        setNewMessage("");
      } else {
        setError(`Erreur lors de l'envoi: ${res.data.message}`);
      }
    } catch (error) {
      console.error("❌ Erreur réseau lors de l'envoi du message:", error);
      setError(`Impossible d'envoyer le message: ${error.response?.data?.message || error.message}`);
    }
  };

  // Supprimer un message
  const deleteMessage = async (messageId) => {
    try {
      const res = await axios.delete(`${API_URL}/chat/delete/${messageId}`);
      
      if (res.data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        console.log("✅ Message supprimé");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la suppression:", error);
      setError("Impossible de supprimer le message");
    }
  };

  // Formater l'heure
  const formatTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    } catch {
      return "";
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      fontFamily: "Arial, sans-serif" 
    }}>
      {/* Sidebar - Liste des utilisateurs */}
      <div style={{
        width: "300px",
        background: "#f8f9fa",
        borderRight: "1px solid #e9ecef",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{
          padding: "20px",
          borderBottom: "1px solid #e9ecef",
          background: "#fff"
        }}>
          <h3 style={{ margin: 0, color: "#333" }}>💬 Chat</h3>
          <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#666" }}>
            Utilisateur connecté: Admin
          </p>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto" }}>
          <h4 style={{ padding: "15px 20px 10px", margin: 0, fontSize: "14px", color: "#666" }}>
            UTILISATEURS
          </h4>
          
          {users.filter(user => user._id !== currentUserId).map(user => (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUserId(user._id);
                setError("");
              }}
              style={{
                padding: "15px 20px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
                background: selectedUserId === user._id ? "#e3f2fd" : "white",
                transition: "background-color 0.2s"
              }}
            >
              <div style={{ fontWeight: "500", color: "#333" }}>
                {user.username || "Utilisateur"}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                {user.email || "email@exemple.com"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {!selectedUserId ? (
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#666"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>💬</div>
            <h2 style={{ margin: 0 }}>Sélectionnez un utilisateur</h2>
            <p>Choisissez un utilisateur dans la liste pour commencer une conversation</p>
          </div>
        ) : (
          <>
            {/* En-tête de conversation */}
            <div style={{
              padding: "20px",
              background: "#fff",
              borderBottom: "1px solid #e9ecef",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <h3 style={{ margin: 0 }}>
                  {users.find(u => u._id === selectedUserId)?.username || "Utilisateur"}
                </h3>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  ID: {selectedUserId}
                </div>
              </div>
              <button
                onClick={fetchMessages}
                style={{
                  padding: "8px 16px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                🔄 Actualiser
              </button>
            </div>

            {/* Messages d'erreur */}
            {error && (
              <div style={{
                padding: "10px 20px",
                background: "#ffebee",
                color: "#c62828",
                borderBottom: "1px solid #ffcdd2"
              }}>
                ⚠️ {error}
                <button 
                  onClick={() => setError("")}
                  style={{ 
                    marginLeft: "10px", 
                    background: "none", 
                    border: "none", 
                    color: "#c62828",
                    cursor: "pointer" 
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Zone des messages */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              background: "#f8f9fa"
            }}>
              {loading ? (
                <div style={{ 
                  textAlign: "center", 
                  color: "#666", 
                  padding: "40px" 
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
                  Chargement des messages...
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  if (!msg.sender || !msg.receiver) {
                    return (
                      <div key={msg._id} style={{ 
                        textAlign: "center", 
                        padding: "10px", 
                        color: "#999", 
                        fontStyle: "italic" 
                      }}>
                        Message avec données corrompues
                      </div>
                    );
                  }

                  const isMyMessage = msg.sender._id === currentUserId;

                  return (
                    <div
                      key={msg._id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isMyMessage ? "flex-end" : "flex-start",
                        margin: "15px 0",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "70%",
                          padding: "12px 16px",
                          borderRadius: "18px",
                          background: isMyMessage ? "#007bff" : "#fff",
                          color: isMyMessage ? "white" : "#333",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          position: "relative",
                          border: isMyMessage ? "none" : "1px solid #e9ecef"
                        }}
                      >
                        <div style={{ wordBreak: "break-word" }}>
                          {msg.message}
                        </div>
                        
                        {isMyMessage && (
                          <button
                            onClick={() => deleteMessage(msg._id)}
                            style={{
                              position: "absolute",
                              top: "-8px",
                              right: "-8px",
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              background: "#dc3545",
                              color: "white",
                              border: "none",
                              fontSize: "11px",
                              cursor: "pointer",
                              opacity: "0",
                              transition: "opacity 0.2s"
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = "1"}
                            onMouseLeave={(e) => e.target.style.opacity = "0"}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      
                      <div style={{ 
                        fontSize: "11px", 
                        color: "#888", 
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <span>{msg.sender.username || "Utilisateur"}</span>
                        <span>•</span>
                        <span>{formatTime(msg.createdAt)}</span>
                        {msg.isRead && isMyMessage && (
                          <span style={{ color: "#007bff" }}>✓✓</span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ 
                  textAlign: "center", 
                  color: "#aaa", 
                  padding: "40px" 
                }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>💭</div>
                  <h3>Aucun message pour le moment</h3>
                  <p>Commencez la conversation en écrivant votre premier message !</p>
                </div>
              )}
            </div>

            {/* Zone de saisie */}
            <form 
              onSubmit={handleSend}
              style={{
                padding: "20px",
                background: "#fff",
                borderTop: "1px solid #e9ecef",
                display: "flex",
                gap: "10px"
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tapez votre message..."
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "25px",
                  outline: "none",
                  fontSize: "14px"
                }}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                style={{
                  padding: "12px 24px",
                  background: newMessage.trim() ? "#007bff" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  cursor: newMessage.trim() ? "pointer" : "not-allowed",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                Envoyer
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatApp;