import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PainelTV() {
  const [baterias, setBaterias] = useState([]);

  const buscarDados = () => {
    axios.get('http://localhost:8080/baterias')
      .then(res => setBaterias(res.data))
      .catch(err => console.error("Erro ao buscar dados da TV", err));
  };

  useEffect(() => {
    buscarDados();
    
    // Polling de 5 segundos
    const interval = setInterval(buscarDados, 5000);
    
    return () => clearInterval(interval); // Limpa o intervalo ao fechar a tela
  }, []);

  const getPodiumLabel = (bateria, pilotoId) => {
    if (bateria.primeiroLugarId === pilotoId) return "🥇 1º";
    if (bateria.segundoLugarId === pilotoId) return "🥈 2º";
    if (bateria.terceiroLugarId === pilotoId) return "🥉 3º";
    return null;
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f0f0f', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, color: '#e63946', textTransform: 'uppercase', letterSpacing: '4px' }}>🏁 Live Timing</h1>
        <div style={{ width: '100px', height: '4px', backgroundColor: '#e63946', margin: '10px auto' }}></div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        {baterias.map(b => (
          <div key={b.id} style={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)', 
            padding: '20px', 
            borderRadius: '15px',
            borderLeft: `8px solid ${b.status === 'EM_ANDAMENTO' ? '#28a745' : b.status === 'FINALIZADA' ? '#6c757d' : '#ffc107'}`,
            boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#f1faee' }}>{b.nome}</h2>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: b.status === 'EM_ANDAMENTO' ? '#00ff00' : 'yellow' }}>
                    {b.status === 'EM_ANDAMENTO' ? '• EM CURSO' : b.status}
                </span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #444', textAlign: 'left', color: '#888', fontSize: '0.8rem' }}>
                  <th style={{ padding: '8px' }}>CARRO</th>
                  <th style={{ padding: '8px' }}>PILOTO</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>RESULTADO</th>
                </tr>
              </thead>
              <tbody>
                {b.pilotos && b.pilotos
                  .sort((a, b) => a.numeroCarro - b.numeroCarro) // Ordenação por Número do Carro
                  .map(p => {
                    const podium = getPodiumLabel(b, p.id);
                    return (
                      <tr key={p.id} style={{ 
                        borderBottom: '1px solid #333',
                        backgroundColor: podium ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                        fontSize: '1.1rem'
                      }}>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#e63946' }}>#{p.numeroCarro}</td>
                        <td style={{ padding: '12px' }}>{p.nome}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#ffd700' }}>
                            {podium || ""}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            
            {(!b.pilotos || b.pilotos.length === 0) && (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>Aguardando pilotos...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PainelTV;