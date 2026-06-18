import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('usuario_sessao');
    if (session) {
      setUsuario(JSON.parse(session));
    }
  }, []);

  const loginUser = (userSession) => {
    localStorage.setItem('usuario_sessao', JSON.stringify(userSession));
    setUsuario(userSession);
  };

  const logoutUser = () => {
    localStorage.removeItem('usuario_sessao');
    setUsuario(null);
  };

  return (
    <Router>
      <Navbar usuario={usuario} logout={logoutUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={usuario ? <Navigate to="/dashboard" /> : <Login onLogin={loginUser} />} />
        <Route path="/dashboard" element={usuario ? <ClientDashboard usuario={usuario} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={usuario && (usuario.role || '').toUpperCase() === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function Navbar({ usuario, logout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🏁 KART<span>PRO</span>
      </Link>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        
        {usuario && (
          <>
            <Link to="/dashboard" className="navbar-link">Meu Painel</Link>
            {(usuario.role || '').toUpperCase() === 'ADMIN' && (
              <Link to="/admin" className="navbar-link" style={{ color: '#ffc107', fontWeight: 'bold' }}>Admin Terminal</Link>
            )}
          </>
        )}

        {usuario ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '0.9rem', color: '#a0a0ab' }}>Olá, <strong>{usuario.nome}</strong></span>
            <button onClick={handleLogout} className="btn-nav-action" style={{ backgroundColor: '#333' }}>Sair</button>
          </div>
        ) : (
          <Link to="/login" className="btn-nav-action">Entrar / Cadastrar</Link>
        )}
      </div>
    </nav>
  );
}

export default App;