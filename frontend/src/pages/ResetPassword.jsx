import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strength, setStrength] = useState({ label: '', color: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useParams();

  const checkStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: 'Weak', color: 'red' };
    if (score === 3 || score === 4) return { label: 'Medium', color: 'orange' };
    if (score === 5) return { label: 'Strong', color: 'green' };
    return { label: '', color: '' };
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    setStrength(checkStrength(pwd));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { newPassword },
        { headers: { Authorization: '' } } 
      );
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.msg?.join(' ') || 'Reset failed');
    }
  };

  if (success) {
    return (
      <div className="d-flex flex-column align-items-center" style={{ background: "#f7f6fd", minHeight: "100vh", paddingTop: 48 }}>
        <div className="card shadow p-4" style={{ minWidth: 400, maxWidth: 500 }}>
          <h2 className="text-center fw-bold mb-3">Password Reset Successful ✅</h2>
          <p className="text-center text-muted mb-4">Redirecting you to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center" style={{ background: "#f7f6fd", minHeight: "100vh", paddingTop: 48 }}>
      <div className="card shadow p-4" style={{ minWidth: 400, maxWidth: 500 }}>
        <h2 className="text-center fw-bold mb-3">Set New Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              required
            />
            {newPassword && (
              <div className="mt-1">
                <small style={{ color: strength.color, fontWeight: 600 }}>{strength.label} Password</small>
                <div
                  style={{
                    height: '5px',
                    backgroundColor: strength.color,
                    width:
                      strength.label === 'Weak' ? '33%' :
                      strength.label === 'Medium' ? '66%' : '100%',
                    transition: 'width 0.3s'
                  }}
                />
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <button
            type="submit"
            className="btn w-100"
            style={{ background: "#d1aaff", color: "#fff", fontWeight: 500 }}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
