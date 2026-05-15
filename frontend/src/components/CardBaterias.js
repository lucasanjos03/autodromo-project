import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormularioPiloto from './FormularioPiloto';

function CardBateria({ bateria, aoAtualizar }) {

  const [podio, setPodio] = useState({
    primeiroLugarId: bateria.primeiroLugarId || '',
    segundoLugarId: bateria.segundoLugarId || '',
    terceiroLugarId: bateria.terceiroLugarId || ''
  });

  const alterarStatus = (novoStatus) => {
    axios.patch(`http://localhost:8080/baterias/${bateria.id}/status`, novoStatus, {
      headers: { "Content-Type": "text/plain" }
    })
    .then(() => {
      Swal.fire({
        title: 'Status Atualizado!',
        text: `Bateria agora está ${novoStatus}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      aoAtualizar(); 
    })
    .catch(err => {
        console.error("Erro ao mudar status", err);
        Swal.fire('Erro!', 'Não foi possível alterar o status.', 'error');
    });
  };

  const removerPiloto = (pilotoId) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/baterias/${bateria.id}/pilotos/${pilotoId}`)
          .then(() => {
            Swal.fire('Removido!', 'O piloto foi removido da bateria.', 'success');
            aoAtualizar();
          })
          .catch(err => Swal.fire('Erro!', 'Erro ao remover piloto.', 'error'));
      }
    });
  };

  const salvarPodio = () => {
    axios.patch(`http://localhost:8080/baterias/${bateria.id}/podio`, podio)
      .then(() => {
        Swal.fire('Sucesso!', 'Pódio definido com sucesso!', 'success');
        aoAtualizar();
      })
      .catch(err => Swal.fire('Erro!', 'Erro ao salvar pódio.', 'error'));
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>🏎️ {bateria.nome || "Corrida sem Nome"}</h3>
        <span style={{ 
            padding: '4px 8px', 
            borderRadius: '12px', 
            fontSize: '0.8rem', 
            backgroundColor: bateria.status === 'EM_ANDAMENTO' ? '#28a745' : bateria.status === 'FINALIZADA' ? '#6c757d' : '#ffc107',
            color: 'white'
        }}>
            {bateria.status}
        </span>
      </div>
      
      <p><strong>Vagas:</strong> {bateria.pilotos?.length || 0} / {bateria.limiteVagas}</p>
      
      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => alterarStatus('EM_ANDAMENTO')} disabled={bateria.status !== 'PENDENTE'} style={btnStart}>
          ▶️ Iniciar Corrida
        </button>
        <button onClick={() => alterarStatus('FINALIZADA')} disabled={bateria.status !== 'EM_ANDAMENTO'} style={btnEnd}>
          🏁 Finalizar
        </button>
      </div>

      <h5>Pilotos Inscritos:</h5>
      {bateria.pilotos && bateria.pilotos.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {bateria.pilotos.map(p => (
            <li key={p.id} style={pilotoItemStyle}>
              <span>#{p.numeroCarro} - {p.nome}</span>
              <button onClick={() => removerPiloto(p.id)} style={btnDelete} title="Remover Piloto">🗑️</button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: 'gray' }}>Nenhum piloto inscrito.</p>
      )}

      {bateria.status === 'FINALIZADA' && (
        <div style={podioContainer}>
          <hr />
          <h6>🏆 Definir Pódio:</h6>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <select value={podio.primeiroLugarId} onChange={e => setPodio({...podio, primeiroLugarId: e.target.value})} style={selectStyle}>
              <option value="">1º Lugar</option>
              {bateria.pilotos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <select value={podio.segundoLugarId} onChange={e => setPodio({...podio, segundoLugarId: e.target.value})} style={selectStyle}>
              <option value="">2º Lugar</option>
              {bateria.pilotos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <select value={podio.terceiroLugarId} onChange={e => setPodio({...podio, terceiroLugarId: e.target.value})} style={selectStyle}>
              <option value="">3º Lugar</option>
              {bateria.pilotos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <button onClick={salvarPodio} style={btnSavePodio}>Salvar Pódio</button>
          </div>
        </div>
      )}

      {bateria.status === 'PENDENTE' && (
        <>
          <hr />
          <FormularioPiloto bateriaId={bateria.id} aoCadastrar={aoAtualizar} />
        </>
      )}
    </div>
  );
}

// Estilos
const cardStyle = { border: '1px solid #ddd', borderRadius: '12px', padding: '20px', margin: '15px 0', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };
const btnStart = { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const btnEnd = { backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', marginLeft: '10px', fontWeight: 'bold' };
const btnDelete = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' };
const pilotoItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #eee' };
const podioContainer = { marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '8px' };
const selectStyle = { padding: '5px', borderRadius: '4px', border: '1px solid #ccc' };
const btnSavePodio = { marginTop: '10px', backgroundColor: '#ffc107', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

export default CardBateria;
