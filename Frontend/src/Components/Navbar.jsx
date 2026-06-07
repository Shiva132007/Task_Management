import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    ));
  } catch {
    return null;
  }
};

const Navbar = () => {
  const { pathname } = useLocation();
  const token = localStorage.getItem('token');
  const decoded = parseJwt(token);
  const userName = decoded?.user?.name || decoded?.name || 'TaskMaster';
  const showAuthLinks = pathname === '/login' || pathname === '/register';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to={token ? '/dashboard' : '/login'} className="navbar-brand">
          <div className="brand-mark">TM</div>
          <div className="brand-copy">
            <span className="brand-title">TaskManager</span>
            <span className="brand-subtitle">Modern task workflow</span>
          </div>
        </Link>

        <div className="navbar-actions">
          {showAuthLinks ? (
            <div className="nav-links">
              <Link className={`nav-link ${pathname === '/login' ? 'active' : ''}`} to="/login">
                Login
              </Link>
              <Link className={`nav-link nav-cta ${pathname === '/register' ? 'active' : ''}`} to="/register">
                Get started
              </Link>
            </div>
          ) : (
            <div className="profile-chip">
              <div className="profile-avatar">{userName.charAt(0)}</div>
              <div>
                <span className="profile-note">Signed in as</span>
                <span className="profile-name">{userName}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;