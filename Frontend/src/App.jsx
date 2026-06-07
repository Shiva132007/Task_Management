import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import ProtectRoute from './Components/ProtectedRoute.jsx';
import Navbar from './Components/Navbar.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">
        <ToastContainer
          theme="colored"
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          pauseOnHover
          draggable
        />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectRoute>
                <Dashboard />
              </ProtectRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
