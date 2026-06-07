import React, { useState } from 'react';
import API from '../api/axios.js';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel glass-panel">
        <div className="auth-hero">
          <p className="eyebrow">Get started</p>
          <h1>Create your <span>account</span></h1>
          <p className="eyebrow-copy">Bring your tasks and collaboration into one modern dashboard.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary auth-btn" type="submit">
            Create account
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link className="link-button" to="/login">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;