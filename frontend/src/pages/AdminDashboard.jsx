


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const primaryPurple = '#a259ff';
const darkPurple = '#8c4ad0';


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }, [token]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('http://localhost:5000/api/users/admin', config);
      setUsers(data.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response && err.response.status === 401) {
        setError('Unauthorized: Please log in as an administrator.');
        navigate('/login');
      } else if (err.response && err.response.status === 403) {
        setError('Access Denied: You do not have admin privileges.');
        navigate('/');
      } else {
        setError('Failed to fetch users. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [config, navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://5000/api/users/admin/add', formData, config);
      alert('User added successfully!');
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      console.error('Error adding user:', err);
      alert(err.response?.data?.msg || 'Failed to add user.');
    }
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const updateData = {
      name: formData.name,
      email: formData.email,
      role: formData.role
    };
    if (formData.password) {
      updateData.password = formData.password;
    }

    try {
      await axios.put(`http://localhost:5000/api/users/${currentUser._id}`, updateData, config);
      alert('User updated successfully!');
      setShowEditModal(false);
      setFormData({ name: '', email: '', password: '', role: 'user' });
      setCurrentUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      alert(err.response?.data?.msg || 'Failed to update user.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
        alert('User deleted successfully!');
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        alert(err.response?.data?.msg || 'Failed to delete user.');
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: primaryPurple }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2" style={{ color: primaryPurple }}>Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center" style={{ color: primaryPurple }}>Admin Dashboard</h1>

      <button
        type="button"
        className="btn mb-3 shadow-sm"
        style={{ backgroundColor: primaryPurple, color: 'white' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkPurple}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryPurple}
        onClick={() => setShowAddModal(true)}
      >
        <i className="bi bi-person-plus me-2"></i> Add New User
      </button>

      {users.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          No users found.
        </div>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded">
          <table className="table table-striped table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col" className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td><small className="text-muted">{user._id.substring(0, 8)}...</small></td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge px-2 py-1 rounded-pill`}
                      style={{
                        backgroundColor:
                          user.role === 'admin'
                            ? '#dc3545'
                            : user.role === 'provider'
                              ? primaryPurple
                              : user.role === 'venue'
                                ? '#198754'
                                : '#6c757d'
                        , color: 'white'
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-sm me-2"
                      style={{
                        color: primaryPurple,
                        borderColor: primaryPurple,
                        background: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = primaryPurple;
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = primaryPurple;
                      }}
                      onClick={() => handleEditClick(user)}
                    >
                      <i className="bi bi-pencil"></i> Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={user.role === 'admin'}
                      title={user.role === 'admin' ? "Cannot delete admin users" : ""}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header text-white" style={{ backgroundColor: primaryPurple }}>
                <h5 className="modal-title">Add New User</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddUser}>
                  <div className="mb-3">
                    <label htmlFor="addName" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="addName"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="addEmail" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="addEmail"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="addPassword" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="addPassword"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="addRole" className="form-label">Role</label>
                    <select
                      className="form-select"
                      id="addRole"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="user">User</option>
                      <option value="provider">Provider</option>
                      <option value="venue">Venue</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowAddModal(false)}>Cancel</button>
                    <button
                      type="submit"
                      className="btn"
                      style={{ backgroundColor: primaryPurple, color: 'white' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkPurple}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryPurple}
                    >
                      Add User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header text-white" style={{ backgroundColor: primaryPurple }}>
                <h5 className="modal-title">Edit User: {currentUser?.name}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateUser}>
                  <div className="mb-3">
                    <label htmlFor="editName" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editName"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editEmail" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="editEmail"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editPassword" className="form-label">New Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      className="form-control"
                      id="editPassword"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editRole" className="form-label">Role</label>
                    <select
                      className="form-select"
                      id="editRole"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="user">User</option>
                      <option value="provider">Provider</option>
                      <option value="venue">Venue</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowEditModal(false)}>Cancel</button>
                    <button
                      type="submit"
                      className="btn"
                      style={{ backgroundColor: primaryPurple, color: 'white' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkPurple}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryPurple}
                    >
                      Update User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
