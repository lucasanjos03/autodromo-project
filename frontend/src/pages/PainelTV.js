import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PainelTV() {
  const [baterias, setBaterias] = useState([]);

  useEffect(() => {
    const buscarDados = () => {
      axios.get('http://localhost:8080/baterias')
        .then(res => setBaterias(res.data));
    };
    
    buscarDados();
    // Aqui poderiamos colocar um setInterval para a TV atualizar sozinha a cada 30s
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ textAlign: 'center', borderBottom: '2px solid red' }}>🏁 QUADRO DE CORRIDAS</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {baterias.map(b => (
          <div key={b.id} style={{ border: '1px solid #444', padding: '15px', borderRadius: '10px' }}>
            <h2>{b.nome}</h2>
            <p>STATUS: <span style={{ color: b.status === 'EM_ANDAMENTO' ? '#00ff00' : 'yellow' }}>{b.status}</span></p>
            <ul>
              {b.pilotos.map(p => (
                <li key={p.id} style={{ fontSize: '1.2rem' }}>{p.numeroCarro} - {p.nome}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PainelTV;