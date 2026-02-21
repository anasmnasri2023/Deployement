import React, { useState, useEffect } from "react";

// Custom icons (same as Bookings)
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

const DownloadIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M2.146 2.146a.5.5 0 0 1 .708 0L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854a.5.5 0 0 1 0-.708z"/>
  </svg>
);

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    role: "student"
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const API_BASE_URL = "http://localhost:5000";

  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/getAllUsers`);
      const data = await response.json();
      
      if (response.ok) {
        const adaptedUsers = data.UserList.map(user => ({
          id: user._id,
          name: user.username,
          email: user.email,
          role: user.role,
          age: user.age,
          status: user.isBloked ? "Blocked" : (user.statu ? "Active" : "Inactive"),
          joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          avatar: user.image_User || "https://via.placeholder.com/48",
          cv_User: user.cv_User,
          isBlocked: user.isBloked,
          isDeleted: user.isDeleted
        }));
        setUsers(adaptedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/users/addUserWithRole`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("User added successfully!");
        setFormData({
          username: "",
          email: "",
          password: "",
          age: "",
          role: "student"
        });
        setShowModal(false);
        fetchUsers();
      } else {
        alert("Error adding user");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding user");
    }
  };

  // Delete a user
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/DeleteUserById/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("User deleted successfully!");
          fetchUsers();
        } else {
          alert("Error deleting user");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error deleting user");
      }
    }
  };

  // Download CV
  const handleDownloadCV = async (filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/downloadCV/${filename}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Error downloading CV");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error downloading CV");
    }
  };

  // Show user details
  const showDetails = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      age: "",
      role: "student"
    });
    setEditingId(null);
    setShowModal(false);
  };

  // Open modal to add
  const handleAddNew = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      age: "",
      role: "student"
    });
    setEditingId(null);
    setShowModal(true);
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Inline styles (same as Bookings with pagination styles added)
  const styles = {
    container: {
      padding: '20px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#2d3748',
      margin: 0
    },
    addButton: {
      backgroundColor: '#3182ce',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '600',
      fontSize: '16px',
      transition: 'all 0.2s'
    },
    filters: {
      display: 'flex',
      gap: '16px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    },
    input: {
      width: '100%',
      border: '1px solid #d1d5db',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    searchInput: {
      border: '1px solid #d1d5db',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      width: '300px'
    },
    select: {
      border: '1px solid #d1d5db',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      width: '100%',
      maxWidth: '600px',
      margin: '20px',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px',
      borderBottom: '1px solid #e2e8f0'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2d3748',
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#9ca3af',
      padding: '4px',
      borderRadius: '4px'
    },
    form: {
      padding: '24px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '20px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      paddingTop: '20px',
      borderTop: '1px solid #e2e8f0'
    },
    cancelButton: {
      padding: '12px 24px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      color: '#374151',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '500'
    },
    saveButton: {
      padding: '12px 24px',
      backgroundColor: '#3182ce',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '500'
    },
    table: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    tableHeader: {
      backgroundColor: '#f7fafc',
      padding: '12px',
      textAlign: 'left',
      fontWeight: '600',
      color: '#2d3748',
      border: '1px solid #e2e8f0'
    },
    tableCell: {
      padding: '12px',
      border: '1px solid #e2e8f0'
    },
    actionButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      margin: '0 4px',
      borderRadius: '4px'
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    userName: {
      fontWeight: '600',
      color: '#2d3748'
    },
    userEmail: {
      color: '#6b7280',
      fontSize: '14px'
    },
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div style={{ fontSize: '18px' }}>Loading data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header with Add User button */}
      <div style={styles.header}>
        <h2 style={styles.title}>User Management</h2>
        <button
          style={styles.addButton}
          onClick={handleAddNew}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
        >
          <PlusIcon />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by name or email..."
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          style={styles.select}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <select
          style={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Add New User</h3>
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
                  <label style={styles.label}>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailModal && selectedUser && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>User Details</h3>
              <button
                style={styles.closeButton}
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedUser(null);
                }}
                onMouseOver={(e) => e.target.style.color = '#6b7280'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}
              >
                <CloseIcon />
              </button>
            </div>

            <div style={styles.form}>
              <div style={styles.userInfo}>
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  style={styles.avatar}
                />
                <div>
                  <div style={styles.userName}>{selectedUser.name}</div>
                  <div style={styles.userEmail}>{selectedUser.email}</div>
                </div>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <p><strong>ID:</strong> {selectedUser.id}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Age:</strong> {selectedUser.age} years</p>
                <p><strong>Status:</strong> {selectedUser.status}</p>
                <p><strong>Join Date:</strong> {new Date(selectedUser.joinDate).toLocaleDateString('en-US')}</p>
                {selectedUser.cv_User && (
                  <p>
                    <strong>CV:</strong> 
                    <button
                      onClick={() => handleDownloadCV(selectedUser.cv_User)}
                      style={{ marginLeft: '8px', color: '#3182ce', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Download
                    </button>
                  </p>
                )}
              </div>

              <div style={styles.buttonGroup}>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedUser(null);
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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>User</th>
              <th style={styles.tableHeader}>Role</th>
              <th style={styles.tableHeader}>Age</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Join Date</th>
              <th style={styles.tableHeader}>CV</th>
              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ ...styles.tableCell, textAlign: 'center', color: '#6b7280' }}>
                  No users found
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id} style={{ backgroundColor: 'white' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  <td style={styles.tableCell}>
                    <div style={styles.userInfo}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={styles.avatar}
                      />
                      <div>
                        <div style={styles.userName}>{user.name}</div>
                        <div style={styles.userEmail}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: user.role === 'admin' ? '#ddd6fe' : 
                                      user.role === 'teacher' ? '#dbeafe' : '#dcfce7',
                      color: user.role === 'admin' ? '#7c3aed' : 
                             user.role === 'teacher' ? '#2563eb' : '#166534'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={styles.tableCell}>{user.age} years</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: user.status === 'Active' ? '#dcfce7' : 
                                      user.status === 'Blocked' ? '#fee2e2' : '#fef3c7',
                      color: user.status === 'Active' ? '#166534' : 
                             user.status === 'Blocked' ? '#dc2626' : '#d97706'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    {new Date(user.joinDate).toLocaleDateString('en-US')}
                  </td>
                  <td style={styles.tableCell}>
                    {user.cv_User ? (
                      <button
                        onClick={() => handleDownloadCV(user.cv_User)}
                        style={{ ...styles.actionButton, color: '#3182ce' }}
                        title="Download CV"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#dbeafe'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <DownloadIcon />
                      </button>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>No CV</span>
                    )}
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                    <button
                      onClick={() => showDetails(user)}
                      style={{ ...styles.actionButton, color: '#117239ff' }}
                      title="View Details"
                      onMouseOver={(e) => e.target.style.backgroundColor = '#dbeafe'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <EyeIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{ ...styles.actionButton, color: '#dc2626' }}
                      title="Delete"
                      onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>Items per page:</span>
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
            Page {currentPage} of {totalPages}
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
    </div>
  );
}