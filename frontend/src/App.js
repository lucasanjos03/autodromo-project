import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminBaterias from './pages/AdminBaterias';
import PainelTV from './pages/PainelTV';

function App() {
  return (
    <Router>
      <nav style={navStyle}>
        <Link to="/admin" style={linkStyle}>Painel Admin</Link>
        <Link to="/tv" style={linkStyle}>Painel TV Público</Link>
      </nav>

      <Routes>
        {/* Quando o usuário digitar /admin no navegador */}
        <Route path="/admin" element={<AdminBaterias />} />
        
        {/* Quando o usuário digitar /tv no navegador */}
        <Route path="/tv" element={<PainelTV />} />

        {/* Rota padrão (Home) */}
        <Route path="/" element={<h1 style={{textAlign: 'center'}}>Escolha um painel acima para começar.</h1>} />
      </Routes>
    </Router>
  );
}

// Estilos rápidos para o menu
const navStyle = {
  padding: '10px',
  backgroundColor: '#333',
  display: 'flex',
  gap: '20px',
  justifyContent: 'center'
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 'bold'
};

export default App;