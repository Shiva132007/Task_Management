import React, { useState } from 'react';
import API from '../api/axios.js';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post('/auth/login', {
                email,
                password
            });

            localStorage.setItem("token", response.data.token);
            toast.success("Login successful!");
            navigate('/dashboard');
        }
        catch (error) {
            const errorMsg = error.response?.data?.message || "Login failed. Please try again.";
            toast.error(errorMsg);
        }
    };

  return (
    <div className="auth-page">
      <div className="auth-panel glass-panel">
        <div className="auth-hero">
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in to your <span>workspace</span></h1>
          <p className="eyebrow-copy">Stay focused, plan smarter, and ship work faster.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            Sign in
          </button>
        </form>

        <div className="auth-footer">
          <span>New to TaskMaster Pro?</span>
          <Link className="link-button" to="/register">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;