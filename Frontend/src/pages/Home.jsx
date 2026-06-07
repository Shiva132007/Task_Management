import { Link, Navigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to Task Management</h1>
        <p>Stay organized and manage your tasks efficiently</p>
        
        <div className="button-group">
          <Link to="/login" className="cta-button login-btn">
            Login
          </Link>
          <Link to="/register" className="cta-button register-btn">
            Register
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Create Tasks</h3>
            <p>Easily create and organize your tasks</p>
          </div>
          <div className="feature-card">
            <h3>Track Progress</h3>
            <p>Monitor your task completion in real-time</p>
          </div>
          <div className="feature-card">
            <h3>Secure</h3>
            <p>Your data is protected with JWT authentication</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
