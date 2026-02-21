import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/courses";
const TEACHERS_API_URL = "http://localhost:5000/users";

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

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "",
    level: "beginner",
    duration: "",
    price: "",
    teacherId: "",
    status: "disponible",
  });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load teachers/users
  const fetchTeachers = async () => {
    try {
      const res = await axios.get(TEACHERS_API_URL);
      setTeachers(res.data);
    } catch (err) {
      console.error("Error loading teachers:", err);
    }
  };

  // Load all courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      console.log("Data received:", res.data);
      setCourses(res.data);
    } catch (err) {
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        fetchTeachers(),
        fetchCourses()
      ]);
    };
    loadAllData();
  }, []);

  // Function to get teacher name
  const getTeacherName = (teacherId) => {
    if (typeof teacherId === 'object' && teacherId?.username) {
      return teacherId.username;
    }
    if (typeof teacherId === 'object' && teacherId?.name) {
      return teacherId.name;
    }
    const teacher = teachers.find(t => t._id === teacherId);
    return teacher ? (teacher.username || teacher.name || teacher.email) : teacherId || "Unknown Teacher";
  };

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or edit a course
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
      };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, courseData);
        alert("Course updated successfully!");
      } else {
        await axios.post(API_BASE_URL, courseData);
        alert("Course added successfully!");
      }
      setFormData({ 
        title: "", 
        description: "", 
        language: "", 
        level: "beginner", 
        duration: "", 
        price: "", 
        teacherId: "",
        status: "disponible" 
      });
      setEditingId(null);
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      console.error("Error saving:", err);
      alert("Error saving course");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        alert("Course deleted successfully!");
        fetchCourses();
      } catch (err) {
        console.error("Error deleting:", err);
        alert("Error deleting course");
      }
    }
  };

  // Start editing
  const handleEdit = (course) => {
    setFormData({
      title: course.title || "",
      description: course.description || "",
      language: course.language || "",
      level: course.level || "beginner",
      duration: course.duration || "",
      price: course.price || "",
      teacherId: course.teacherId?._id || course.teacherId || "",
      status: course.status || "disponible",
    });
    setEditingId(course._id);
    setShowModal(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ 
      title: "", 
      description: "", 
      language: "", 
      level: "beginner", 
      duration: "", 
      price: "", 
      teacherId: "",
      status: "disponible" 
    });
    setEditingId(null);
    setShowModal(false);
  };

  // Open modal to add
  const handleAddNew = () => {
    setFormData({ 
      title: "", 
      description: "", 
      language: "", 
      level: "beginner", 
      duration: "", 
      price: "", 
      teacherId: "",
      status: "disponible" 
    });
    setEditingId(null);
    setShowModal(true);
  };

  // Show course details
  const showDetails = (course) => {
    setSelectedCourse(course);
    setShowDetailModal(true);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Inline styles to ensure display
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
    input: {
      width: '100%',
      border: '1px solid #d1d5db',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      border: '1px solid #d1d5db',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box',
      resize: 'vertical',
      minHeight: '100px'
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
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500'
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
    courseInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    courseName: {
      fontWeight: '600',
      color: '#2d3748'
    },
    courseDescription: {
      color: '#6b7280',
      fontSize: '14px'
    }
  };

  // Function to get status badge style
  const getStatusBadge = (status) => {
    let backgroundColor, color;
    switch (status) {
      case 'disponible':
        backgroundColor = '#dcfce7';
        color = '#166534';
        break;
      case 'réservé':
        backgroundColor = '#fef3c7';
        color = '#d97706';
        break;
      case 'terminé':
        backgroundColor = '#fee2e2';
        color = '#dc2626';
        break;
      default:
        backgroundColor = '#f3f4f6';
        color = '#374151';
    }
    return { ...styles.statusBadge, backgroundColor, color };
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
      {/* Header with Add Course button */}
      <div style={styles.header}>
        <h2 style={styles.title}>Course Management</h2>
        <button
          style={styles.addButton}
          onClick={handleAddNew}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
        >
          <PlusIcon />
          Add Course
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingId ? "Edit Course" : "Add New Course"}
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

            {/* Modal Content */}
            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Course title"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Language</label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Course language"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Duration (hours)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Duration in hours"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Price (TND)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Price in TND"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Teacher</label>
                  <select
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.username || teacher.name || teacher.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="réservé">Réservé</option>
                    <option value="terminé">Terminé</option>
                  </select>
                </div>

                <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder="Course description"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
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
      {showDetailModal && selectedCourse && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Course Details</h3>
              <button
                style={styles.closeButton}
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedCourse(null);
                }}
                onMouseOver={(e) => e.target.style.color = '#6b7280'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}
              >
                <CloseIcon />
              </button>
            </div>

            <div style={styles.form}>
              <div style={styles.courseInfo}>
                <div>
                  <div style={styles.courseName}>{selectedCourse.title}</div>
                  <div style={styles.courseDescription}>{selectedCourse.description || "No description"}</div>
                </div>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <p><strong>ID:</strong> {selectedCourse._id}</p>
                <p><strong>Language:</strong> {selectedCourse.language}</p>
                <p><strong>Level:</strong> {selectedCourse.level}</p>
                <p><strong>Duration:</strong> {selectedCourse.duration} hours</p>
                <p><strong>Price:</strong> {selectedCourse.price} TND</p>
                <p><strong>Teacher:</strong> {getTeacherName(selectedCourse.teacherId)}</p>
                <p><strong>Status:</strong> {selectedCourse.status}</p>
                <p><strong>Creation Date:</strong> {new Date(selectedCourse.createdAt || selectedCourse.updatedAt).toLocaleDateString('en-US')}</p>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedCourse(null);
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
              <th style={styles.tableHeader}>Title</th>
              <th style={styles.tableHeader}>Language</th>
              <th style={styles.tableHeader}>Level</th>
              <th style={styles.tableHeader}>Duration</th>
              <th style={styles.tableHeader}>Price</th>
              <th style={styles.tableHeader}>Teacher</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ ...styles.tableCell, textAlign: 'center', color: '#6b7280' }}>
                  No courses found
                </td>
              </tr>
            ) : (
              currentCourses.map((course) => (
                <tr key={course._id} style={{ backgroundColor: 'white' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  <td style={styles.tableCell}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#2d3748' }}>
                        {course.title}
                      </div>
                      {course.description && (
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#6b7280', 
                          maxWidth: '200px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap',
                          marginTop: '4px'
                        }}>
                          {course.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    {course.language}
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{ textTransform: 'capitalize' }}>
                      {course.level}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    {course.duration}h
                  </td>
                  <td style={styles.tableCell}>
                    {course.price}TND
                  </td>
                  <td style={styles.tableCell}>
                    {getTeacherName(course.teacherId)}
                  </td>
                  <td style={styles.tableCell}>
                    <span style={getStatusBadge(course.status)}>
                      {course.status}
                    </span>
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(course)}
                      style={{ ...styles.actionButton, color: '#3182ce' }}
                      title="Edit"
                      onMouseOver={(e) => e.target.style.backgroundColor = '#cec7feff'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => showDetails(course)}
                      style={{ ...styles.actionButton, color: '#117239ff' }}
                      title="View Details"
                      onMouseOver={(e) => e.target.style.backgroundColor = '#dbeafe'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <EyeIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
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