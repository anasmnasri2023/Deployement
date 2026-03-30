import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/bookings";
const USERS_API_URL = "http://localhost:5000/users/getAllUsers"; // Aligné avec Users.js
const COURSES_API_URL = "http://localhost:5000/courses";

// Custom icon components
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

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState({ users: false, courses: false });
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    courseId: "",
    bookingDate: "",
    status: "en attente",
  });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load users
  const fetchUsers = async () => {
    try {
      console.log("📡 Attempting to load users...");
      const res = await axios.get(USERS_API_URL);
      console.log("👥 Users loaded:", res.data);
      if (Array.isArray(res.data.UserList)) {
        const adaptedUsers = res.data.UserList.map(user => ({
          _id: user._id,
          username: user.username,
          email: user.email,
        }));
        setUsers(adaptedUsers);
        setDataLoaded(prev => ({ ...prev, users: true }));
      } else {
        console.error("❌ Unexpected users data structure:", res.data);
        setUsers([]);
      }
    } catch (err) {
      console.error("❌ Error loading users:", err);
      console.error("Details:", err.response?.data || err.message);
      setUsers([]);
    }
  };

  // Load courses
  const fetchCourses = async () => {
    try {
      console.log("📡 Attempting to load courses...");
      const res = await axios.get(COURSES_API_URL);
      console.log("📚 Courses loaded:", res.data);
      if (Array.isArray(res.data)) {
        setCourses(res.data);
        setDataLoaded(prev => ({ ...prev, courses: true }));
      } else if (res.data && Array.isArray(res.data.courses)) {
        setCourses(res.data.courses);
        setDataLoaded(prev => ({ ...prev, courses: true }));
      } else {
        console.error("❌ Unexpected courses data structure:", res.data);
        setCourses([]);
      }
    } catch (err) {
      console.error("❌ Error loading courses:", err);
      console.error("Details:", err.response?.data || err.message);
      setCourses([]);
    }
  };

  // Load all bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      console.log("📋 Bookings loaded:", res.data);
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Error loading bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial loading
  useEffect(() => {
    const loadAllData = async () => {
      console.log("🚀 Starting data loading...");
      setLoading(true);
      try {
        await Promise.all([
          fetchUsers(),
          fetchCourses()
        ]);
        await fetchBookings();
        console.log("✅ All data loaded");
      } catch (error) {
        console.error("❌ General error during loading:", error);
      }
    };
    loadAllData();
  }, []);

  // Debug: Display data state
  useEffect(() => {
    console.log("📊 Current data state:");
    console.log("- Users:", users.length, users);
    console.log("- Courses:", courses.length, courses);
    console.log("- Bookings:", bookings.length, bookings);
    console.log("- Data loaded:", dataLoaded);
  }, [users, courses, bookings, dataLoaded]);

  // Get user name
  const getUserName = (userId) => {
    if (typeof userId === 'object' && userId?.username) {
      return userId.username;
    }
    if (typeof userId === 'object' && userId?.name) {
      return userId.name;
    }
    if (typeof userId === 'object' && userId?.email) {
      return userId.email;
    }
    const user = users.find(u => u._id === userId || u.id === userId);
    if (user) {
      return user.username || user.name || user.email || "User";
    }
    return userId || "Unknown User";
  };

  // Get course title
  const getCourseTitle = (courseId) => {
    if (typeof courseId === 'object' && courseId?.title) {
      return courseId.title;
    }
    if (typeof courseId === 'object' && courseId?.name) {
      return courseId.name;
    }
    const course = courses.find(c => c._id === courseId || c.id === courseId);
    if (course) {
      return course.title || course.name || "Course";
    }
    return courseId || "Unknown Course";
  };

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or edit a booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.courseId || !formData.bookingDate) {
      alert("Please fill all required fields");
      return;
    }
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, formData);
        alert("Booking updated successfully!");
      } else {
        await axios.post(API_BASE_URL, formData);
        alert("Booking added successfully!");
      }
      setFormData({ userId: "", courseId: "", bookingDate: "", status: "en attente" });
      setEditingId(null);
      setShowModal(false);
      fetchBookings();
    } catch (err) {
      console.error("Error saving:", err);
      alert("Error saving booking: " + (err.response?.data?.message || err.message));
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        alert("Booking deleted successfully!");
        fetchBookings();
      } catch (err) {
        console.error("Error deleting:", err);
        alert("Error deleting booking");
      }
    }
  };

  // Start editing
  const handleEdit = (booking) => {
    setFormData({
      userId: booking.userId?._id || booking.userId,
      courseId: booking.courseId?._id || booking.courseId,
      bookingDate: booking.bookingDate ? booking.bookingDate.split("T")[0] : "",
      status: booking.status,
    });
    setEditingId(booking._id);
    setShowModal(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ userId: "", courseId: "", bookingDate: "", status: "en attente" });
    setEditingId(null);
    setShowModal(false);
  };

  // Open modal to add
  const handleAddNew = () => {
    setFormData({ userId: "", courseId: "", bookingDate: "", status: "en attente" });
    setEditingId(null);
    setShowModal(true);
  };

  // Show booking details
  const showDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  // Refresh users manually
  const handleRefreshUsers = () => {
    fetchUsers();
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Inline styles
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
    buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' },
    cancelButton: { padding: '12px 24px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#374151', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
    saveButton: { padding: '12px 24px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
    table: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' },
    tableHeader: { backgroundColor: '#f7fafc', padding: '12px', textAlign: 'left', fontWeight: '600', color: '#2d3748', border: '1px solid #e2e8f0' },
    tableCell: { padding: '12px', border: '1px solid #e2e8f0' },
    actionButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '8px', margin: '0 4px', borderRadius: '4px' },
    debugInfo: {
      backgroundColor: '#f0f9ff',
      border: '1px solid #bae6fd',
      borderRadius: '8px',
      padding: '12px',
      margin: '10px 0',
      fontSize: '14px',
      color: '#0369a1'
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
    },
    bookingInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    bookingName: {
      fontWeight: '600',
      color: '#2d3748'
    }
  };

  // Loading display
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column' }}>
          <div style={{ fontSize: '18px', marginBottom: '20px' }}>Loading data...</div>
          <div style={styles.debugInfo}>
            <div>Users loaded: {dataLoaded.users ? '✅' : '⏳'} ({users.length})</div>
            <div>Courses loaded: {dataLoaded.courses ? '✅' : '⏳'} ({courses.length})</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Debug info */}
      <div style={styles.debugInfo}>
        <strong>Debug Info:</strong> Users: {users.length} | Courses: {courses.length} | Bookings: {bookings.length}
      </div>

      {/* Header with Add Reservation button */}
      <div style={styles.header}>
        <h2 style={styles.title}>Booking Management</h2>
        <button
          style={{ ...styles.addButton, backgroundColor: '#4a5568' }}
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
          Add Reservation
        </button>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingId ? "Edit Reservation" : "Add New Reservation"}
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
                    User ({users.length} available{users.length > 1 ? 's' : ''})
                  </label>
                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  >
                    <option value="">Select a user</option>
                    {users.length === 0 ? (
                      <option value="" disabled>No users available</option>
                    ) : (
                      users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.username || user.email || `User ${user._id}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Course ({courses.length} available{courses.length > 1 ? 's' : ''})
                  </label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.length === 0 ? (
                      <option value="" disabled>No courses available</option>
                    ) : (
                      courses.map((course) => (
                        <option key={course._id || course.id} value={course._id || course.id}>
                          {course.title || course.name || `Course ${course._id}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Booking Date</label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="en attente">en attente</option>
                    <option value="confirmé">confirmé</option>
                    <option value="annulé">annulé</option>
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

      {/* Details Modal */}
      {showDetailModal && selectedBooking && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Booking Details</h3>
              <button
                style={styles.closeButton}
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedBooking(null);
                }}
                onMouseOver={(e) => e.target.style.color = '#6b7280'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}
              >
                <CloseIcon />
              </button>
            </div>

            <div style={styles.form}>
              <div style={styles.bookingInfo}>
                <div>
                  <div style={styles.bookingName}>{getUserName(selectedBooking.userId)}</div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>{getCourseTitle(selectedBooking.courseId)}</div>
                </div>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <p><strong>ID:</strong> {selectedBooking._id}</p>
                <p><strong>User:</strong> {getUserName(selectedBooking.userId)}</p>
                <p><strong>Course:</strong> {getCourseTitle(selectedBooking.courseId)}</p>
                <p><strong>Booking Date:</strong> {new Date(selectedBooking.bookingDate).toLocaleDateString('en-US')}</p>
                <p><strong>Status:</strong> {selectedBooking.status}</p>
                <p><strong>Creation Date:</strong> {new Date(selectedBooking.createdAt || selectedBooking.bookingDate).toLocaleDateString('en-US')}</p>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedBooking(null);
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
              <th style={styles.tableHeader}>Course</th>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ ...styles.tableCell, textAlign: 'center', color: '#6b7280' }}>
                  No bookings found
                </td>
              </tr>
            ) : (
              currentBookings.map((booking) => (
                <tr key={booking._id} style={{ backgroundColor: 'white' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  <td style={styles.tableCell}>{getUserName(booking.userId)}</td>
                  <td style={styles.tableCell}>{getCourseTitle(booking.courseId)}</td>
                  <td style={styles.tableCell}>
                    {new Date(booking.bookingDate).toLocaleDateString('en-US')}
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: booking.status === 'confirmé' ? '#dcfce7' : 
                                      booking.status === 'annulé' ? '#fee2e2' : '#fef3c7',
                      color: booking.status === 'confirmé' ? '#166534' : 
                             booking.status === 'annulé' ? '#dc2626' : '#d97706'
                    }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(booking)}
                      style={{ ...styles.actionButton, color: '#3182ce' }}
                      title="Edit"
                      onMouseOver={(e) => e.target.style.backgroundColor = '#cec7feff'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => showDetails(booking)}
                      style={{ ...styles.actionButton, color: '#117239ff' }}
                      title="View Details"
                      onMouseOver={(e) => e.target.style.backgroundColor = '#dbeafe'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <EyeIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(booking._id)}
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