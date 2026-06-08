import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [baterias, setBaterias] = useState([]);
  const [pistas, setPistas] = useState([]);

  useEffect(() => {
    // Carregar dados das baterias
    axios.get('http://localhost:8080/baterias')
      .then(res => setBaterias(res.data.filter(b => (b.status || 'PENDENTE') !== 'FINALIZADA')))
      .catch(err => console.error("Erro ao buscar baterias", err));

    // Carregar dados das pistas
    axios.get('http://localhost:8080/pistas')
      .then(res => setPistas(res.data))
      .catch(err => console.error("Erro ao buscar pistas", err));
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0c', color: 'white', paddingBottom: '60px' }}>
      
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Acelere no Limite</h1>
        <p className="hero-subtitle">
          Sinta a verdadeira adrenalina da velocidade no melhor Kartódromo da região. Pistas profissionais, frotas modernas e cronometragem digital em tempo real.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Link to="/login" className="btn-primary">Agendar Bateria</Link>
          <Link to="/tv" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             Ver Live Timing
          </Link>
        </div>
      </section>

      {/* Grid: Informações e Pistas */}
      <div className="grid-container" style={{ padding: '0 40px' }}>
        
        {/* Card Pista 1 */}
        <div className="glass-card">
          <h2 style={{ fontFamily: 'Orbitron', color: '#e63946', margin: '0 0 10px 0' }}>🏎️ PISTA RED BULL</h2>
          <p style={{ color: '#a0a0ab', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Nossa pista principal com mais de 1200 metros de extensão, curvas desafiadoras de alta velocidade e retas ideais para ultrapassagens radicais.
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px', fontSize: '0.9rem' }}>
            <div><strong>Extensão:</strong> <span style={{ color: '#ffc107' }}>1.200m</span></div>
            <div><strong>Dificuldade:</strong> <span style={{ color: '#ffc107' }}>Alta</span></div>
          </div>
        </div>

        {/* Card Preços */}
        <div className="glass-card">
          <h2 style={{ fontFamily: 'Orbitron', color: '#e63946', margin: '0 0 10px 0' }}>💰 PLANOS & PREÇOS</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: '15px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2a2a35', paddingBottom: '5px' }}>
              <span>Bateria Individual (25 min)</span>
              <strong>R$ 90,00</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2a2a35', paddingBottom: '5px' }}>
              <span>Pacote Grupo (mín. 10 pessoas)</span>
              <strong>R$ 80,00 / pessoa</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '5px' }}>
              <span>Campeonato Fechado (Grid Completo)</span>
              <strong>Consultar Admin</strong>
            </li>
          </ul>
        </div>
      </div>

      {/* Leaderboard - Recordes das Pistas */}
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 40px' }}>
        <h2 style={{ fontFamily: 'Orbitron', letterSpacing: '2px', borderBottom: '2px solid #e63946', paddingBottom: '10px', marginBottom: '20px' }}>
          🏆 RECORDES DAS PISTAS
        </h2>
        {pistas.length > 0 ? (
          <div className="glass-card" style={{ padding: '10px' }}>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th className="leaderboard-th">Pista</th>
                  <th className="leaderboard-th">Extensão</th>
                  <th className="leaderboard-th">Melhor Tempo</th>
                  <th className="leaderboard-th">Piloto Recordista</th>
                </tr>
              </thead>
              <tbody>
                {pistas.map(p => (
                  <tr key={p.id} className="leaderboard-row">
                    <td className="leaderboard-td" style={{ fontWeight: 'bold' }}>{p.nome}</td>
                    <td className="leaderboard-td" style={{ color: '#a0a0ab' }}>{p.extensaoMetros}m</td>
                    <td className="leaderboard-td" style={{ color: '#ffc107', fontWeight: 'bold' }}>{p.recordeTempo ? `${p.recordeTempo}s` : '---'}</td>
                    <td className="leaderboard-td">{p.recordePiloto || '---'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#a0a0ab' }}>Nenhuma pista ou recorde cadastrado ainda.</p>
        )}
      </div>

      {/* Baterias Agendadas (Próximos Treinos) */}
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 40px' }}>
        <h2 style={{ fontFamily: 'Orbitron', letterSpacing: '2px', borderBottom: '2px solid #e63946', paddingBottom: '10px', marginBottom: '20px' }}>
          📅 PRÓXIMAS BATERIAS PÚBLICAS
        </h2>
        {baterias.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {baterias.map(b => (
              <div key={b.id} className="glass-card" style={{ borderLeft: '4px solid #ffc107' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{b.nome}</h3>
                  <span className={`status-badge ${(b.status || 'PENDENTE').toLowerCase().replace('_', '-')}`}>{b.status || 'PENDENTE'}</span>
                </div>
                <p style={{ margin: '10px 0', fontSize: '0.9rem', color: '#a0a0ab' }}>
                  🕒 Horário: {new Date(b.horario).toLocaleString('pt-BR')}
                </p>
                <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#a0a0ab' }}>
                  🏎️ Pista: {b.pista ? b.pista.nome : 'Pista Geral'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  <span style={{ fontSize: '0.85rem' }}>Vagas: <strong>{b.pilotos?.length || 0} / {b.limiteVagas}</strong></span>
                  <Link to="/login" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Inscrever-se</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#a0a0ab' }}>Não há baterias públicas agendadas no momento.</p>
        )}
      </div>

    </div>
  );
}

export default Home;
