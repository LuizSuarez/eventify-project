import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to send reset link.');
        }
    };

    if (submitted) {
        return (
            <div className="d-flex flex-column align-items-center" style={{ background: "#f7f6fd", minHeight: "100vh", paddingTop: 48 }}>
               
                <div className="card shadow p-4" style={{ minWidth: 400, maxWidth: 500 }}>
                    <div className="text-center mb-3">
                        <div style={{
                            width: 64, height: 64, background: "#eafbe7", borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto"
                        }}>
                            <span style={{ color: "#4bb543", fontSize: 36 }}>✔</span>
                        </div>
                    </div>
                    <h2 className="text-center mb-2 fw-bold">Check Your Email</h2>
                    <p className="text-center text-muted mb-4" style={{ fontSize: "1.1rem" }}>
                        We've sent a password reset link to your email address
                    </p>
                    <div className="mb-4 p-3 border rounded bg-light d-flex align-items-center" style={{ fontSize: "1.05rem" }}>
                        <span className="me-2" style={{ fontSize: 22 }}>✉️</span>
                        If you don't see the email in your inbox, check your spam folder. The link will expire in 24 hours.
                    </div>
                    <div className="text-center text-muted mb-2" style={{ fontSize: "1.05rem" }}>
                        Didn't receive the email?
                    </div>
                    <button className="btn w-100 mb-3" style={{ background: "#d1aaff", color: "#fff", fontWeight: 500 }}
                        onClick={() => { setSubmitted(false); setEmail(''); }}>
                        Try Again
                    </button>
                    <div className="text-center">
                        <a href="/login" style={{ color: "#a259ff", textDecoration: "none", fontWeight: 500 }}>
                            Back to Login
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column align-items-center" style={{ background: "#f7f6fd", minHeight: "100vh", paddingTop: 48 }}>
           
            <div className="card shadow p-4" style={{ minWidth: 400, maxWidth: 500 }}>
                <h2 className="text-center mb-2 fw-bold">Forgot Password?</h2>
                <p className="text-center text-muted mb-4" style={{ fontSize: "1.1rem" }}>
                    Enter your email address and we'll send you a link to reset your password
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email Address</label>
                        <input
                            className="form-control"
                            placeholder="Enter your email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <button
                        className="btn w-100 mb-3"
                        style={{ background: "#d1aaff", color: "#fff", fontWeight: 500, fontSize: "1.1rem" }}
                        type="submit"
                    >
                        Send Reset Link
                    </button>
                </form>
                <div className="text-center mt-3">
                    <a href="/login" style={{ color: "#a259ff", textDecoration: "none", fontWeight: 500 }}>
                        <span style={{ fontSize: 18, marginRight: 6 }}>←</span> Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;