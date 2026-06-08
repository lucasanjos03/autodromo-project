import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function ClientDashboard({ usuario }) {
  const [minhasBaterias, setMinhasBaterias] = useState([]);
  const [bateriasDisponiveis, setBateriasDisponiveis] = useState([]);
  const [pistas, setPistas] = useState([]);

  const carregarDados = () => {
    // Buscar baterias
    axios.get('http://localhost:8080/baterias')
      .then(res => {
        const todas = res.data;

        // Filtrar minhas baterias (onde eu sou um piloto)
        const minhas = todas.filter(b => 
          b.pilotos && b.pilotos.some(p => p.usuario && p.usuario.id === usuario.id)
        );
        setMinhasBaterias(minhas);

        // Filtrar baterias públicas disponíveis para inscrição (PENDENTES e onde eu ainda NÃO estou inscrito)
        const disponiveis = todas.filter(b => 
          (b.status || 'PENDENTE') === 'PENDENTE' && 
          b.pilotos.length < b.limiteVagas &&
          (!b.pilotos || !b.pilotos.some(p => p.usuario && p.usuario.id === usuario.id))
        );
        setBateriasDisponiveis(disponiveis);
      })
      .catch(err => console.error("Erro ao buscar baterias", err));

    // Buscar pistas
    axios.get('http://localhost:8080/pistas')
      .then(res => setPistas(res.data))
      .catch(err => console.error("Erro ao buscar pistas", err));
  };

  useEffect(() => {
    carregarDados();
  }, [usuario]);

  const inscreverEmBateria = (bateriaId) => {
    Swal.fire({
      title: 'Inscrição de Piloto',
      text: 'Digite o número do carro (1 a 99) que deseja correr nesta bateria:',
      input: 'number',
      inputPlaceholder: 'Nº do Carro',
      showCancelButton: true,
      confirmButtonText: 'Confirmar Inscrição',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || value < 1 || value > 99) {
          return 'Por favor digite um número válido entre 1 e 99!';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const numeroCarro = parseInt(result.value);

        const novoPiloto = {
          nome: usuario.nome,
          equipe: 'Cliente',
          numeroCarro: numeroCarro,
          usuario: {
            id: usuario.id
          }
        };

        axios.post(`http://localhost:8080/baterias/${bateriaId}/pilotos`, novoPiloto)
          .then(() => {
            Swal.fire('Inscrição confirmada!', 'Você foi registrado para a corrida com sucesso.', 'success');
            carregarDados();
          })
          .catch(err => {
            console.error(err);
            const msg = err.response?.data?.message || 'Erro ao realizar inscrição.';
            Swal.fire('Erro!', msg, 'error');
          });
      }
    });
  };

  const getPosicaoMinha = (bateria) => {
    if ((bateria.status || 'PENDENTE') !== 'FINALIZADA') return '---';
    const meuPiloto = bateria.pilotos.find(p => p.usuario && p.usuario.id === usuario.id);
    if (!meuPiloto) return '---';
    
    if (bateria.primeiroLugarId === meuPiloto.id) return '🥇 1º Lugar';
    if (bateria.segundoLugarId === meuPiloto.id) return '🥈 2º Lugar';
    if (bateria.terceiroLugarId === meuPiloto.id) return '🥉 3º Lugar';
    return '🏁 Participou';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0c', padding: '40px' }}>
      
      {/* Header do Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '2px solid #2a2a35', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'Orbitron', margin: 0, letterSpacing: '1px' }}>PAINEL DO PILOTO</h1>
          <p style={{ color: '#a0a0ab', margin: '5px 0 0 0' }}>Gerencie suas baterias, confira estatísticas e marque novos treinos.</p>
        </div>
        <div style={{ backgroundColor: '#18181f', padding: '10px 20px', borderRadius: '8px', border: '1px solid #2a2a35' }}>
          <span style={{ color: '#a0a0ab', fontSize: '0.85rem' }}>CATEGORIA:</span>
          <strong style={{ display: 'block', color: '#e63946' }}>AMADOR PRO</strong>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '45px' }}>
        <div className="glass-card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#e63946' }}></div>
          <span style={{ color: '#a0a0ab', fontSize: '0.85rem', textTransform: 'uppercase' }}>Corridas Corridas</span>
          <h2 style={{ fontFamily: 'Orbitron', fontSize: '2.5rem', margin: '10px 0 0 0', color: '#f1faee' }}>{minhasBaterias.length}</h2>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#ffc107' }}></div>
          <span style={{ color: '#a0a0ab', fontSize: '0.85rem', textTransform: 'uppercase' }}>Pódios Conquistados</span>
          <h2 style={{ fontFamily: 'Orbitron', fontSize: '2.5rem', margin: '10px 0 0 0', color: '#ffc107' }}>
            {minhasBaterias.filter(b => {
              const meuPiloto = b.pilotos.find(p => p.usuario && p.usuario.id === usuario.id);
              return meuPiloto && (b.primeiroLugarId === meuPiloto.id || b.segundoLugarId === meuPiloto.id || b.terceiroLugarId === meuPiloto.id);
            }).length}
          </h2>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#28a745' }}></div>
          <span style={{ color: '#a0a0ab', fontSize: '0.85rem', textTransform: 'uppercase' }}>Próximos Treinos</span>
          <h2 style={{ fontFamily: 'Orbitron', fontSize: '2.5rem', margin: '10px 0 0 0', color: '#28a745' }}>
            {minhasBaterias.filter(b => (b.status || 'PENDENTE') !== 'FINALIZADA').length}
          </h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        
        {/* Lado Esquerdo: Minhas Corridas e Inscrição */}
        <div>
          
          {/* Minhas Corridas */}
          <div className="glass-card" style={{ marginBottom: '30px' }}>
            <h3 style={{ fontFamily: 'Orbitron', margin: '0 0 20px 0', borderBottom: '1px solid #2a2a35', paddingBottom: '10px' }}>
              🏎️ MINHA AGENDA & HISTÓRICO
            </h3>
            {minhasBaterias.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {minhasBaterias.map(b => (
                  <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', backgroundColor: '#121216', borderRadius: '8px', border: '1px solid #2a2a35' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0' }}>{b.nome}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#a0a0ab' }}>
                        📅 {new Date(b.horario).toLocaleString('pt-BR')} | Pista: {b.pista ? b.pista.nome : 'Geral'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span className={`status-badge ${(b.status || 'PENDENTE').toLowerCase().replace('_', '-')}`}>{b.status || 'PENDENTE'}</span>
                      <strong style={{ color: '#ffc107' }}>{getPosicaoMinha(b)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#a0a0ab', textAlign: 'center', padding: '20px 0' }}>Você ainda não participou de nenhuma corrida.</p>
            )}
          </div>

          {/* Reservar Novas Baterias */}
          <div className="glass-card">
            <h3 style={{ fontFamily: 'Orbitron', margin: '0 0 20px 0', borderBottom: '1px solid #2a2a35', paddingBottom: '10px' }}>
              📅 INSCREVER-SE EM NOVAS BATERIAS
            </h3>
            {bateriasDisponiveis.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {bateriasDisponiveis.map(b => (
                  <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#121216', borderRadius: '8px', border: '1px solid #2a2a35' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0' }}>{b.nome}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#a0a0ab' }}>
                        🕒 {new Date(b.horario).toLocaleString('pt-BR')} | Pista: {b.pista ? b.pista.nome : 'Geral'}
                      </p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#e63946' }}>
                        Vagas Restantes: {b.limiteVagas - b.pilotos.length}
                      </p>
                    </div>
                    <button onClick={() => inscreverEmBateria(b.id)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      Inscrever-se
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#a0a0ab', textAlign: 'center', padding: '20px 0' }}>Nenhuma nova bateria disponível no momento.</p>
            )}
          </div>

        </div>

        {/* Lado Direito: Quadro de Líderes Local */}
        <div>
          <div className="glass-card">
            <h3 style={{ fontFamily: 'Orbitron', margin: '0 0 20px 0', borderBottom: '1px solid #2a2a35', paddingBottom: '10px' }}>
              🏆 RECORDES
            </h3>
            {pistas.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {pistas.map(p => (
                  <div key={p.id} style={{ padding: '12px', backgroundColor: '#121216', borderRadius: '8px', border: '1px solid #2a2a35' }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#ffc107' }}>{p.nome}</h4>
                    <p style={{ margin: '3px 0', fontSize: '0.85rem', color: '#a0a0ab' }}>
                      Recordista: <strong>{p.recordePiloto || '---'}</strong>
                    </p>
                    <p style={{ margin: '3px 0', fontSize: '0.85rem', color: '#e63946', fontWeight: 'bold' }}>
                      Tempo: {p.recordeTempo ? `${p.recordeTempo}s` : '---'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#a0a0ab', textAlign: 'center' }}>Carregando recordes...</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default ClientDashboard;
