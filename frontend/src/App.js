import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [baterias, setBaterias] = useState([]);

  // Busca os dados na API
  useEffect(() => {
    axios.get('http://localhost:8080/baterias')
      .then(response => {
        setBaterias(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar baterias:", error);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🏎️ Painel do Autódromo (React)</h1>
      <hr />
      <ul>
        {baterias.map(bateria => (
          <li key={bateria.id}>
            <strong>{bateria.nome || "Sem nome"}</strong> - Status: {bateria.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;