import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardBateria from '../components/CardBaterias'; 

function AdminBaterias() {
  const [baterias, setBaterias] = useState([]);

  // Função para buscar os dados do Java
  const carregarBaterias = () => {
    axios.get('http://localhost:8080/baterias')
      .then(response => {
        setBaterias(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar baterias:", error);
      });
  };

  // Carrega ao abrir a página
  useEffect(() => {
    carregarBaterias();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>🛠️ Painel Administrativo</h1>
      <p>Gerencie as baterias, adicione pilotos e altere o status das corridas.</p>
      
      <div className="lista-baterias">
        {baterias.map(bateria => (
          <CardBateria 
            key={bateria.id} 
            bateria={bateria} 
            aoAtualizar={carregarBaterias} 
          />
        ))}
      </div>
    </div>
  );
}

export default AdminBaterias;