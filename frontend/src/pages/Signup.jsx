

import React, { useState } from 'react';
import axios from 'axios';
import { registerUser } from '../api/api';

function Signup() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    });

    const [errors, setErrors] = useState([]);
    const [strength, setStrength] = useState({ label: '', color: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors([]);
        if (e.target.name === 'password') {
            setStrength(checkStrength(e.target.value));
        }
    };

    function getPasswordValidationErrors(password) {
        const errors = [];
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long.");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password must include at least one lowercase letter.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must include at least one uppercase letter.");
        }
        if (!/\d/.test(password)) {
            errors.push("Password must include at least one digit.");
        }
        if (!/[\W_]/.test(password)) {
            errors.push("Password must include at least one special character.");
        }
        return errors;
    }

    // Password strength checker (same as ResetPassword)
    function checkStrength(password) {
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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const localErrors = [];

        if (form.password !== form.confirmPassword) {
            localErrors.push('Passwords do not match.');
        }

        const passwordErrors = getPasswordValidationErrors(form.password);
        if (passwordErrors.length > 0) {
            localErrors.push(...passwordErrors);
        }

        if (localErrors.length > 0) {
            setErrors(localErrors);
            return;
        }

        try {
            const payload = {
                name: `${form.firstName} ${form.lastName}`.trim(),
                email: form.email,
                password: form.password,
                role: form.role
            };

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, payload);
            alert(response.data.msg[0]);

            setForm({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: ''
            });

            setStrength({ label: '', color: '' });
            setErrors([]);

        } catch (err) {
            const messages = err.response?.data?.msg;
            if (Array.isArray(messages)) {
                setErrors(messages);
            } else {
                setErrors(['Signup failed. Please try again.']);
            }
        }
    };

    return (
        <div className="d-flex flex-column align-items-center" style={{ background: "#f0f0f0", minHeight: "100vh", paddingTop: 48 }}>
            <div className="d-flex align-items-center justify-content-center mb-3" style={{ gap: 12 }}>

                <h2 className="fw-bold mb-0" style={{ fontSize: "4rem", fontFamily: "lobster", background: "linear-gradient(rgb(0, 0, 0), #a259ff)", WebkitBackgroundClip: "text", color: "transparent" }}>Eventify</h2>
   
            </div>
            <div className="card shadow p-4" style={{ minWidth: 400, maxWidth: 500 , marginTop: 10 }}>
                <h4 className="text-center mb-2">Sign Up </h4>
                <p className="text-center  mb-4" style={{ fontSize: "1rem", color: "#a259ff" }}>
                    Join Eventify to start planning amazing events
                </p>

                {errors.length > 0 && (
                    <div className="alert alert-danger">
                        <ul className="mb-0">
                            {errors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col">
                            <label className="form-label fw-semibold">First Name</label>
                            <input
                                className="form-control"
                                
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col">
                            <label className="form-label fw-semibold">Last Name</label>
                            <input
                                className="form-control"
                              
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                            className="form-control"
                         
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Account Type</label>
                        <select
                            className="form-select"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select account type</option>
                            <option value="user">User</option>
                            <option value="provider">Service Provider</option>
                            <option value="venue">Venue Owner</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Password</label>
                        <input
                            className="form-control"
                            placeholder="Create a password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        {form.password && (
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
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Confirm Password</label>
                        <input
                            className="form-control"
                            placeholder="Confirm your password"
                            name="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button className="btn btn-dark w-100 mb-2" type="submit" style={{ background: "#a259ff", borderColor: "white" }}>
                        Create Account
                    </button>
                </form>
                <div className="text-center mt-3">
                    <span className="text-muted">Already have an account? </span>
                    <a href="/login" className="fw-semibold text-decoration-none"  style={{ color: "#a259ff" }}>Sign in</a>
                </div>
            </div>
        </div>
    );
}

export default Signup;