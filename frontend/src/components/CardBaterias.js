import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormularioPiloto from './FormularioPiloto';

function CardBateria({ bateria, aoAtualizar, pistas = [] }) {
  const currentStatus = bateria.status || 'PENDENTE';

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

  const deletarBateria = () => {
    Swal.fire({
      title: 'Excluir Bateria?',
      text: "Isso removerá a bateria e todos os pilotos associados permanentemente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e63946',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/baterias/${bateria.id}`)
          .then(() => {
            Swal.fire('Deletada!', 'A bateria foi excluída.', 'success');
            aoAtualizar();
          })
          .catch(err => Swal.fire('Erro!', 'Erro ao excluir bateria.', 'error'));
      }
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
    <div className="glass-card" style={{ borderLeft: `6px solid ${currentStatus === 'EM_ANDAMENTO' ? '#28a745' : currentStatus === 'FINALIZADA' ? '#6c757d' : '#ffc107'}`, marginBottom: '25px', position: 'relative' }}>

      {/* Botão de Excluir Bateria Completa */}
      <button
        onClick={deletarBateria}
        style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem' }}
        title="Excluir Bateria"
      >
        🗑️
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight: '30px' }}>
        <h3 style={{ fontFamily: 'Orbitron', margin: 0 }}>🏎️ {bateria.nome || "Corrida sem Nome"}</h3>
        <span className={`status-badge ${currentStatus.toLowerCase().replace('_', '-')}`}>{currentStatus}</span>
      </div>

      <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#a0a0ab', display: 'flex', gap: '20px' }}>
        <p style={{ margin: 0 }}><strong>Horário:</strong> {new Date(bateria.horario).toLocaleString('pt-BR')}</p>
        <p style={{ margin: 0 }}><strong>Pista:</strong> {bateria.pista ? bateria.pista.nome : 'Pista Geral'}</p>
        <p style={{ margin: 0 }}><strong>Vagas:</strong> {bateria.pilotos?.length || 0} / {bateria.limiteVagas}</p>
      </div>

      <div style={{ margin: '15px 0', display: 'flex', gap: '10px' }}>
        <button onClick={() => alterarStatus('EM_ANDAMENTO')} disabled={currentStatus !== 'PENDENTE'} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem', textTransform: 'none' }}>
          ▶️ Iniciar Corrida
        </button>
        <button onClick={() => alterarStatus('FINALIZADA')} disabled={currentStatus !== 'EM_ANDAMENTO'} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
          🏁 Finalizar
        </button>
      </div>

      <h5 style={{ margin: '15px 0 5px 0', textTransform: 'uppercase', fontSize: '0.8rem', color: '#a0a0ab', letterSpacing: '1px' }}>Pilotos Inscritos:</h5>
      {bateria.pilotos && bateria.pilotos.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
          {bateria.pilotos.map(p => (
            <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #2a2a35', backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <span>#{p.numeroCarro} - {p.nome} {p.usuario && <span style={{ fontSize: '0.75rem', color: '#ffc107', marginLeft: '5px' }}>(Registrado)</span>}</span>
              <button onClick={() => removerPiloto(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }} title="Remover Piloto">❌</button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: 'gray', fontSize: '0.9rem', margin: '5px 0 15px 0' }}>Nenhum piloto inscrito.</p>
      )}

      {currentStatus === 'FINALIZADA' && (
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: 'rgba(255, 193, 7, 0.05)', borderRadius: '8px', border: '1px solid rgba(255, 193, 7, 0.2)' }}>
          <h6 style={{ margin: '0 0 10px 0', color: '#ffc107', fontSize: '0.9rem', fontFamily: 'Orbitron' }}>🏆 REGISTRAR PODIO:</h6>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select
              value={podio.primeiroLugarId}
              onChange={e => setPodio({ ...podio, primeiroLugarId: e.target.value })}
              style={{ padding: '6px', borderRadius: '4px', backgroundColor: '#121216', color: 'white', border: '1px solid #2a2a35' }}
            >
              <option value="">1º Lugar</option>
              {bateria.pilotos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <select
              value={podio.segundoLugarId}
              onChange={e => setPodio({ ...podio, segundoLugarId: e.target.value })}
              style={{ padding: '6px', borderRadius: '4px', backgroundColor: '#121216', color: 'white', border: '1px solid #2a2a35' }}
            >
              <option value="">2º Lugar</option>
              {bateria.pilotos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <select
              value={podio.terceiroLugarId}
              onChange={e => setPodio({ ...podio, terceiroLugarId: e.target.value })}
              style={{ padding: '6px', borderRadius: '4px', backgroundColor: '#121216', color: 'white', border: '1px solid #2a2a35' }}
            >
              <option value="">3º Lugar</option>
              {bateria.pilotos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <button onClick={salvarPodio} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#ffc107', color: 'black' }}>Salvar Pódio</button>
          </div>
        </div>
      )}

      {currentStatus === 'PENDENTE' && (
        <div style={{ marginTop: '15px' }}>
          <hr style={{ border: 'none', height: '1px', backgroundColor: '#2a2a35', margin: '15px 0' }} />
          <FormularioPiloto bateriaId={bateria.id} aoCadastrar={aoAtualizar} />
        </div>
      )}
    </div>
  );
}

export default CardBateria;
