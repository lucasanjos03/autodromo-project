import React from 'react';
import axios from 'axios'; // Não esqueça de importar o axios aqui também!
import FormularioPiloto from './FormularioPiloto';

function CardBateria({ bateria, aoAtualizar }) {

  // A FUNÇÃO FICA AQUI: Antes do return
  const alterarStatus = (novoStatus) => {
    axios.patch(`http://localhost:8080/baterias/${bateria.id}/status`, novoStatus, {
      headers: { "Content-Type": "text/plain" }
    })
    .then(() => {
      aoAtualizar(); 
    })
    .catch(err => console.error("Erro ao mudar status", err));
  };

  // O VISUAL FICA AQUI: Dentro do return
  return (
    <div style={cardStyle}>
      <h3>🏎️ {bateria.nome || "Corrida sem Nome"}</h3>
      <p><strong>Status:</strong> {bateria.status}</p>
      <p><strong>Vagas:</strong> {bateria.vagasOcupadas} / {bateria.limiteVagas}</p>
      
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => alterarStatus('EM_ANDAMENTO')} disabled={bateria.status === 'EM_ANDAMENTO'} style={btnStart}>
          ▶️ Iniciar
        </button>
        <button onClick={() => alterarStatus('FINALIZADA')} style={btnEnd}>
          🏁 Finalizar
        </button>
      </div>

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
      <FormularioPiloto bateriaId={bateria.id} aoCadastrar={aoAtualizar} />
    </div>
  );
}

// Estilos para não poluir o código acima
const cardStyle = { border: '1px solid #ccc', borderRadius: '8px', padding: '15px', margin: '10px 0', backgroundColor: '#f9f9f9' };
const btnStart = { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
const btnEnd = { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginLeft: '5px' };

export default CardBateria;

