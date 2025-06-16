
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);

      // Save token and user in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      alert(`Welcome ${res.data.user.name} (${res.data.user.role})`);

      // Redirect based on role
      const role = res.data.user.role;
      if (role === 'admin') navigate('/dashboard/admin');
      else if (role === 'user') navigate('/dashboard/user');
      else if (role === 'provider') navigate('/dashboard/provider');
      else if (role === 'venue') navigate('/dashboard/venue');
      else navigate('/unauthorized');

      setForm({ email: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100" style={{ background: "#f0f0f0" }}>
      <div className="d-flex align-items-center justify-content-center mb-3" style={{ marginTop: 10, gap: 12 }}>
        <h2 className="fw-bold mb-0" style={{ fontSize: "4rem", fontFamily: "lobster", background: "linear-gradient(rgb(0, 0, 0), #a259ff)", WebkitBackgroundClip: "text", color: "transparent" }}>Eventify</h2>
      </div>
      <div className="card shadow p-4" style={{ minWidth: 370, maxWidth: 400, marginTop: 10}}>
        <h4 className="text-center mb-2">Sign in</h4>
        <p className="text-center  mb-4" style={{ color: "#a259ff" }}>Enter your email and password to access your account</p>
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
          <button className="btn btn-dark w-100 mb-3" type="submit" style={{ background: "#a259ff", borderColor: "white"}}>
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
            <Link to="/signup" className="fw-semibold text-decoration-none"  style={{ color: "#a259ff" }}>
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
