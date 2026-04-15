import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardBateria from './components/CardBaterias'; 

function App() {
  const [baterias, setBaterias] = useState([]);
  
  const carregarDados = () => {
    axios.get('http://localhost:8080/baterias')
      .then(res => setBaterias(res.data));
  };
  // Busca os dados na API
  useEffect(() => {
    axios.get('http://localhost:8080/baterias')
      .then(response => setBaterias(response.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '40px'}}>
      <h1>🏁 Gestão de Baterias</h1>
      <div>
        {baterias.map(item => (
          // Usamos o componente e passamos os dados via prop "bateria"
          <CardBateria key={item.id} bateria={item} aoAtualizar={carregarDados} />
        ))}
      </div>
    </div>
  );
}

export default App;