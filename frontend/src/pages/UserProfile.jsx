import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser)._id : null;

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    axios.get(`http://localhost:5000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data.data);
        setForm({ name: res.data.data.name, email: res.data.data.email, password: '' });
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.msg || 'Failed to load profile.');
        setLoading(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.clear();
          navigate('/login');
        }
      });
  }, [token, userId, navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async e => {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);

    try {
      const updateData = {
        name: form.name,
        email: form.email,
      };
      if (form.password) {
        updateData.password = form.password;
      }

      const res = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
      setEditMode(false);
      setMsg('Profile updated successfully!');
      setForm(prevForm => ({ ...prevForm, password: '' }));
    } catch (err) {
      setError(err.response?.data?.msg || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.clear();
      navigate('/signup');
    } catch (err) {
      setError(err.response?.data?.msg || 'Delete failed.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{
        minHeight: "100vh",
        background: "#f7f8fa"
      }}>
        <div className="text-center">
          <div className="spinner-border" style={{ color: "#a259ff" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{
        minHeight: "100vh",
        background: "#f7f8fa"
      }}>
        <div className="alert alert-danger text-center shadow-sm" role="alert" style={{ maxWidth: "400px" }}>
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{
        minHeight: "100vh",
        background: "#f7f8fa"
      }}>
        <div className="alert alert-warning text-center shadow-sm" role="alert" style={{ maxWidth: "400px" }}>
          User profile could not be loaded.
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{
      minHeight: "100vh",
      background: "#f7f8fa"
    }}>
      <div className="card shadow-sm border-0" style={{
        width: "100%",
        maxWidth: "400px",
        borderRadius: "1.25rem"
      }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div className="mx-auto mb-3" style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "#a259ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <i className="bi bi-person-fill text-white" style={{ fontSize: "2rem" }}></i>
            </div>
            <h2 className="fw-bold mb-1" style={{ color: "#a259ff" }}>Welcome, {user.name.split(' ')[0]}</h2>
            <div className="text-muted mb-2" style={{ fontSize: "1rem" }}>Manage your account details</div>
          </div>
          {msg && <div className="alert alert-success">{msg}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!editMode ? (
            <>
              <div className="mb-4">
                <div className="mb-2">
                  <span className="text-muted">Full Name</span>
                  <div className="fs-5 fw-bold">{user.name}</div>
                </div>
                <div className="mb-2">
                  <span className="text-muted">Email</span>
                  <div className="fs-6">{user.email}</div>
                </div>

              </div>
              <div className="d-grid gap-2 mb-2">
                <button className="btn rounded-pill" style={{ background: "#a259ff", color: "#fff" }} onClick={() => setEditMode(true)}>
                  <i className="bi bi-pencil-fill me-2"></i> Edit Profile
                </button>
                <button className="btn rounded-pill border" style={{ color: "#a259ff", borderColor: "#a259ff" }} onClick={handleDelete}>
                  <i className="bi bi-trash-fill me-2"></i> Delete Account
                </button>
              </div>

            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label fw-bold">Full Name</label>
                <input name="name" className="form-control form-control-lg" value={form.name} onChange={handleChange} required autoFocus />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input name="email" type="email" className="form-control form-control-lg" value={form.email} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold">New Password <span className="text-muted">(optional)</span></label>
                <input name="password" type="password" className="form-control form-control-lg" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current password" />
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-dark rounded-pill" type="submit">
                  <i className="bi bi-save-fill me-2"></i> Save Changes
                </button>
                <button className="btn btn-outline-dark rounded-pill" type="button" onClick={() => {
                  setEditMode(false);
                  setForm({ name: user.name, email: user.email, password: '' });
                }}>
                  <i className="bi bi-x-circle-fill me-2"></i> Cancel
                </button>
              </div>
            </form>
          )}
          <hr className="my-4" />
          <div className="d-grid">
            <button
              className="btn btn-dark rounded-pill"  style={{ background: "#a259ff", color: "#fff" }}
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
            >
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
