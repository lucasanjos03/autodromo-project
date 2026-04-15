import React from 'react';
import FormularioPiloto from './FormularioPiloto';

function CardBateria({ bateria, aoAtualizar }) {
  return (
    <div style={cardStyle}>
      <h3>🏎️ {bateria.nome || "Corrida sem Nome"}</h3>
      <p><strong>Status:</strong> {bateria.status}</p>
      <p><strong>Vagas:</strong> {bateria.vagasOcupadas} / {bateria.limiteVagas}</p>
      
      <h5>Pilotos Inscritos:</h5>
      {bateria.pilotos && bateria.pilotos.length > 0 ? (
        <ul>
          {bateria.pilotos.map(p => (
            <li key={p.id}>{p.nome} - Carro #{p.numeroCarro}</li>
          ))}
        </ul>
      ) : (
        <p style={{ color: 'gray' }}>Nenhum piloto inscrito.</p>
      )}

      <hr />
      {/* Aqui o formulário entra sem mudar o estilo de cima */}
      <FormularioPiloto bateriaId={bateria.id} aoCadastrar={aoAtualizar} />
    </div>
  );
}

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '15px',
  margin: '10px 0',
  backgroundColor: '#f9f9f9'
};

export default CardBateria;