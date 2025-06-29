import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    phoneNo: '',
    address: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  // Save data to localStorage whenever students array changes
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      rollNo: '',
      phoneNo: '',
      address: ''
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.rollNo || !formData.phoneNo || !formData.address) {
      alert('Please fill in all fields');
      return;
    }

    if (isEditing) {
      // Update existing student
      setStudents(prev => prev.map(student => 
        student.id === editingId 
          ? { ...formData, id: editingId }
          : student
      ));
    } else {
      // Add new student
      const newStudent = {
        ...formData,
        id: Date.now().toString()
      };
      setStudents(prev => [...prev, newStudent]);
    }
    
    resetForm();
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      phoneNo: student.phoneNo,
      address: student.address
    });
    setEditingId(student.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(prev => prev.filter(student => student.id !== id));
      if (editingId === id) {
        resetForm();
      }
    }
  };

  const getStats = () => {
    return {
      total: students.length,
      withPhone: students.filter(s => s.phoneNo).length,
      withAddress: students.filter(s => s.address).length
    };
  };

  const stats = getStats();

  // Add search filter function
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <h1>🎓 Student Management System</h1>
        <p>Professional Student Management Todo List</p>
        
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="btn btn-secondary"
          style={{ marginTop: '16px' }}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.withPhone}</div>
          <div className="stat-label">With Phone</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.withAddress}</div>
          <div className="stat-label">With Address</div>
        </div>
      </div>

      {/* Student Form */}
      <div className="card">
        <h2>{isEditing ? '✏️ Edit Student' : '➕ Add New Student'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Student Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter student name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Roll Number *</label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter roll number"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter address"
                required
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>

      {/* Students List */}
      <div className="card">
        <h2>📚 Students List ({filteredStudents.length})</h2>
        
        {/* Search Bar */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="🔍 Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ maxWidth: '400px' }}
          />
        </div>
        
        {students.length === 0 ? (
          <div className="empty-state">
            <h3>No students added yet</h3>
            <p>Add your first student using the form above!</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <h3>🔍 No matching students found</h3>
            <p>Try adjusting your search terms or clear the search to see all students.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="btn btn-secondary"
              style={{ marginTop: '16px' }}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="students-list">
            {filteredStudents.map((student) => (
              <div key={student.id} className="student-item">
                <div className="student-header">
                  <div className="student-name">{student.name}</div>
                  <div className="student-roll">Roll: {student.rollNo}</div>
                </div>
                <div className="student-details">
                  <div className="student-detail">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{student.phoneNo}</span>
                  </div>
                  <div className="student-detail">
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{student.address}</span>
                  </div>
                </div>
                <div className="student-actions">
                  <button
                    onClick={() => handleEdit(student)}
                    className="btn btn-success"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="btn btn-danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 