import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/api';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(form);
      const { success, token, user, msg } = response.data;

      if (!success) {
        alert(msg || 'Login failed. Please try again.');
        return;
      }

      // Save token & user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert(`Welcome ${user.name} (${user.role})`);

      // Navigate based on role
      switch (user.role) {
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'user':
          navigate('/dashboard/user');
          break;
        case 'provider':
          navigate('/dashboard/provider');
          break;
        case 'venue':
          navigate('/dashboard/venue');
          break;
        default:
          navigate('/unauthorized');
      }

      setForm({ email: '', password: '' });

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Login failed due to server error');
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100" style={{ background: "#f0f0f0" }}>
      <div className="d-flex align-items-center justify-content-center mb-3" style={{ marginTop: 10, gap: 12 }}>
        <h2 className="fw-bold mb-0" style={{ fontSize: "4rem", fontFamily: "lobster", background: "linear-gradient(rgb(0, 0, 0), #a259ff)", WebkitBackgroundClip: "text", color: "transparent" }}>Eventify</h2>
      </div>
      <div className="card shadow p-4" style={{ minWidth: 370, maxWidth: 400, marginTop: 10 }}>
        <h4 className="text-center mb-2">Sign in</h4>
        <p className="text-center mb-4" style={{ color: "#a259ff" }}>
          Enter your email and password to access your account
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              className="form-control"
              placeholder="Enter your email"
              name="email"
              type="email"
              autoComplete="username"
              onChange={handleChange}
              value={form.email}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              className="form-control"
              placeholder="Enter your password"
              name="password"
              type="password"
              autoComplete="current-password"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>
          <button className="btn btn-dark w-100 mb-3" type="submit" style={{ background: "#a259ff", borderColor: "white" }}>
            Sign In
          </button>
        </form>
        <div className="text-center">
          <Link to="/forgot-password" className="text-muted" style={{ fontSize: "0.95rem" }}>
            Forgot your password?
          </Link>
        </div>
        <div className="text-center mt-2">
          <span className="text-muted" style={{ fontSize: "1rem" }}>
            Don't have an account?{' '}
            <Link to="/signup" className="fw-semibold text-decoration-none" style={{ color: "#a259ff" }}>
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
