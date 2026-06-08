import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import CardBateria from '../components/CardBaterias';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('baterias');

  // Datasets
  const [baterias, setBaterias] = useState([]);
  const [pistas, setPistas] = useState([]);
  const [karts, setKarts] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [eventos, setEventos] = useState([]);

  // Form states
  const [bateriaForm, setBateriaForm] = useState({ nome: '', horario: '', pistaId: '' });
  const [pistaForm, setPistaForm] = useState({ id: null, nome: '', extensaoMetros: '', recordeTempo: '', recordePiloto: '' });
  const [kartForm, setKartForm] = useState({ id: null, numero: '', modelo: '', status: 'DISPONIVEL' });
  const [eventoForm, setEventoForm] = useState({ id: null, nome: '', dataHora: '', descricao: '', precoInscricao: '', limiteParticipantes: '' });

  // Load datasets
  const loadBaterias = () => axios.get('http://localhost:8080/baterias').then(res => setBaterias(res.data)).catch(err => console.error(err));
  const loadPistas = () => axios.get('http://localhost:8080/pistas').then(res => setPistas(res.data)).catch(err => console.error(err));
  const loadKarts = () => axios.get('http://localhost:8080/karts').then(res => setKarts(res.data)).catch(err => console.error(err));
  const loadUsuarios = () => axios.get('http://localhost:8080/usuarios').then(res => setUsuarios(res.data)).catch(err => console.error(err));
  const loadEventos = () => axios.get('http://localhost:8080/eventos').then(res => setEventos(res.data)).catch(err => console.error(err));

  useEffect(() => {
    loadBaterias();
    loadPistas();
    loadKarts();
    loadUsuarios();
    loadEventos();
  }, []);

  // --- Baterias CRUD handlers ---
  const handleBateriaSubmit = (e) => {
    e.preventDefault();
    if (!bateriaForm.nome || !bateriaForm.horario) {
      Swal.fire('Aviso', 'Preencha o nome e horário da bateria.', 'warning');
      return;
    }

    axios.post('http://localhost:8080/baterias', bateriaForm)
      .then(() => {
        Swal.fire('Criada!', 'Bateria agendada com sucesso.', 'success');
        setBateriaForm({ nome: '', horario: '', pistaId: '' });
        loadBaterias();
      })
      .catch(err => Swal.fire('Erro', 'Erro ao criar bateria.', 'error'));
  };

  // --- Pistas CRUD handlers ---
  const handlePistaSubmit = (e) => {
    e.preventDefault();
    if (!pistaForm.nome || !pistaForm.extensaoMetros) {
      Swal.fire('Aviso', 'Nome e extensão são obrigatórios.', 'warning');
      return;
    }

    const payload = {
      nome: pistaForm.nome,
      extensaoMetros: parseInt(pistaForm.extensaoMetros),
      recordeTempo: pistaForm.recordeTempo ? parseFloat(pistaForm.recordeTempo) : null,
      recordePiloto: pistaForm.recordePiloto || ''
    };

    if (pistaForm.id) {
      // Editar
      axios.put(`http://localhost:8080/pistas/${pistaForm.id}`, payload)
        .then(() => {
          Swal.fire('Atualizada!', 'Pista editada com sucesso.', 'success');
          setPistaForm({ id: null, nome: '', extensaoMetros: '', recordeTempo: '', recordePiloto: '' });
          loadPistas();
          loadBaterias(); // Update pista names in batteries
        })
        .catch(err => Swal.fire('Erro', 'Erro ao editar pista.', 'error'));
    } else {
      // Criar
      axios.post('http://localhost:8080/pistas', payload)
        .then(() => {
          Swal.fire('Criada!', 'Pista cadastrada com sucesso.', 'success');
          setPistaForm({ id: null, nome: '', extensaoMetros: '', recordeTempo: '', recordePiloto: '' });
          loadPistas();
        })
        .catch(err => Swal.fire('Erro', 'Erro ao cadastrar pista.', 'error'));
    }
  };

  const deletePista = (id) => {
    Swal.fire({
      title: 'Deletar Pista?',
      text: 'Baterias ligadas a ela ficarão sem pista definida.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Deletar'
    }).then(result => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/pistas/${id}`)
          .then(() => {
            Swal.fire('Excluída!', 'Pista deletada com sucesso.', 'success');
            loadPistas();
            loadBaterias();
          });
      }
    });
  };

  // --- Karts CRUD handlers ---
  const handleKartSubmit = (e) => {
    e.preventDefault();
    if (!kartForm.numero || !kartForm.modelo) {
      Swal.fire('Aviso', 'Número e modelo são obrigatórios.', 'warning');
      return;
    }

    const payload = {
      numero: parseInt(kartForm.numero),
      modelo: kartForm.modelo,
      status: kartForm.status
    };

    if (kartForm.id) {
      axios.put(`http://localhost:8080/karts/${kartForm.id}`, payload)
        .then(() => {
          Swal.fire('Atualizado!', 'Kart editado.', 'success');
          setKartForm({ id: null, numero: '', modelo: '', status: 'DISPONIVEL' });
          loadKarts();
        });
    } else {
      axios.post('http://localhost:8080/karts', payload)
        .then(() => {
          Swal.fire('Cadastrado!', 'Novo kart inserido na frota.', 'success');
          setKartForm({ id: null, numero: '', modelo: '', status: 'DISPONIVEL' });
          loadKarts();
        });
    }
  };

  const deleteKart = (id) => {
    axios.delete(`http://localhost:8080/karts/${id}`).then(() => {
      Swal.fire('Excluído!', 'Kart removido da frota.', 'success');
      loadKarts();
    });
  };

  // --- Eventos CRUD handlers ---
  const handleEventoSubmit = (e) => {
    e.preventDefault();
    if (!eventoForm.nome || !eventoForm.dataHora) {
      Swal.fire('Aviso', 'Preencha o nome e data/hora do evento.', 'warning');
      return;
    }

    const payload = {
      nome: eventoForm.nome,
      dataHora: eventoForm.dataHora,
      descricao: eventoForm.descricao,
      precoInscricao: eventoForm.precoInscricao ? parseFloat(eventoForm.precoInscricao) : 0,
      limiteParticipantes: eventoForm.limiteParticipantes ? parseInt(eventoForm.limiteParticipantes) : 30
    };

    if (eventoForm.id) {
      axios.put(`http://localhost:8080/eventos/${eventoForm.id}`, payload)
        .then(() => {
          Swal.fire('Atualizado!', 'Evento editado.', 'success');
          setEventoForm({ id: null, nome: '', dataHora: '', descricao: '', precoInscricao: '', limiteParticipantes: '' });
          loadEventos();
        });
    } else {
      axios.post('http://localhost:8080/eventos', payload)
        .then(() => {
          Swal.fire('Agendado!', 'Novo evento criado.', 'success');
          setEventoForm({ id: null, nome: '', dataHora: '', descricao: '', precoInscricao: '', limiteParticipantes: '' });
          loadEventos();
        });
    }
  };

  const deleteEvento = (id) => {
    axios.delete(`http://localhost:8080/eventos/${id}`).then(() => {
      Swal.fire('Deletado!', 'Evento removido.', 'success');
      loadEventos();
    });
  };

  // --- Users Role modification ---
  const toggleUserRole = (id, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'CLIENT' : 'ADMIN';
    axios.patch(`http://localhost:8080/usuarios/${id}/role`, { role: newRole })
      .then(() => {
        Swal.fire('Atualizado!', `Usuário agora é ${newRole}.`, 'success');
        loadUsuarios();
      });
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h3 style={{ fontFamily: 'Orbitron', color: '#e63946', margin: '0 0 20px 0', textAlign: 'center', letterSpacing: '1px' }}>🛠️ CONTROLE</h3>
        <button className={`admin-sidebar-btn ${activeTab === 'baterias' ? 'active' : ''}`} onClick={() => setActiveTab('baterias')}>🏎️ Baterias</button>
        <button className={`admin-sidebar-btn ${activeTab === 'pistas' ? 'active' : ''}`} onClick={() => setActiveTab('pistas')}>🗺️ Pistas</button>
        <button className={`admin-sidebar-btn ${activeTab === 'karts' ? 'active' : ''}`} onClick={() => setActiveTab('karts')}>🚗 Frota Karts</button>
        <button className={`admin-sidebar-btn ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => setActiveTab('usuarios')}>👥 Clientes</button>
        <button className={`admin-sidebar-btn ${activeTab === 'eventos' ? 'active' : ''}`} onClick={() => setActiveTab('eventos')}>🏆 Eventos</button>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        
        {/* TABS: BATERIAS */}
        {activeTab === 'baterias' && (
          <div>
            <h2 style={{ fontFamily: 'Orbitron', margin: '0 0 25px 0' }}>GERENCIAR BATERIAS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
              
              {/* Form Baterias */}
              <div className="glass-card">
                <h4 style={{ fontFamily: 'Orbitron', margin: '0 0 20px 0' }}>📆 AGENDAR BATERIA</h4>
                <form onSubmit={handleBateriaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Nome da Corrida</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Treino Noturno Livre" 
                      value={bateriaForm.nome} 
                      onChange={e => setBateriaForm({...bateriaForm, nome: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Horário</label>
                    <input 
                      type="datetime-local" 
                      className="form-input" 
                      value={bateriaForm.horario} 
                      onChange={e => setBateriaForm({...bateriaForm, horario: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pista</label>
                    <select 
                      className="form-input" 
                      value={bateriaForm.pistaId} 
                      onChange={e => setBateriaForm({...bateriaForm, pistaId: e.target.value})}
                    >
                      <option value="">Selecione a Pista</option>
                      {pistas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>Agendar</button>
                </form>
              </div>

              {/* Cards List */}
              <div>
                {baterias.length > 0 ? (
                  baterias.map(b => (
                    <CardBateria key={b.id} bateria={b} aoAtualizar={loadBaterias} pistas={pistas} />
                  ))
                ) : (
                  <p style={{ color: '#a0a0ab' }}>Nenhuma bateria agendada no momento.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TABS: PISTAS */}
        {activeTab === 'pistas' && (
          <div>
            <h2 style={{ fontFamily: 'Orbitron', margin: '0 0 25px 0' }}>CONFIGURAR PISTAS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
              
              {/* Form Pistas */}
              <div className="glass-card">
                <h4 style={{ fontFamily: 'Orbitron', margin: '0 0 20px 0' }}>{pistaForm.id ? '📝 EDITAR PISTA' : '🗺️ NOVA PISTA'}</h4>
                <form onSubmit={handlePistaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Nome da Pista</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Interlagos Kart" 
                      value={pistaForm.nome} 
                      onChange={e => setPistaForm({...pistaForm, nome: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Extensão (metros)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="Ex: 850" 
                      value={pistaForm.extensaoMetros} 
                      onChange={e => setPistaForm({...pistaForm, extensaoMetros: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tempo Recorde (segundos)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-input" 
                      placeholder="Ex: 42.58" 
                      value={pistaForm.recordeTempo} 
                      onChange={e => setPistaForm({...pistaForm, recordeTempo: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Piloto Recordista</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Ayrton Senna" 
                      value={pistaForm.recordePiloto} 
                      onChange={e => setPistaForm({...pistaForm, recordePiloto: e.target.value})}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Salvar</button>
                    {pistaForm.id && (
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => setPistaForm({ id: null, nome: '', extensaoMetros: '', recordeTempo: '', recordePiloto: '' })}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Table Pistas */}
              <div className="glass-card" style={{ padding: '10px' }}>
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th className="leaderboard-th">Pista</th>
                      <th className="leaderboard-th">Extensão</th>
                      <th className="leaderboard-th">Recorde</th>
                      <th className="leaderboard-th">Recordista</th>
                      <th className="leaderboard-th" style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pistas.map(p => (
                      <tr key={p.id} className="leaderboard-row">
                        <td className="leaderboard-td" style={{ fontWeight: 'bold' }}>{p.nome}</td>
                        <td className="leaderboard-td">{p.extensaoMetros}m</td>
                        <td className="leaderboard-td" style={{ color: '#ffc107' }}>{p.recordeTempo ? `${p.recordeTempo}s` : '---'}</td>
                        <td className="leaderboard-td">{p.recordePiloto || '---'}</td>
                        <td className="leaderboard-td" style={{ textAlign: 'right' }}>
                          <button onClick={() => setPistaForm(p)} className="btn-secondary" style={{ padding: '4px 8px', marginRight: '5px', fontSize: '0.8rem' }}>Editar</button>
                          <button onClick={() => deletePista(p.id)} className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.8rem', backgroundColor: '#dc3545' }}>Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TABS: KARTS */}
        {activeTab === 'karts' && (
          <div>
            <h2 style={{ fontFamily: 'Orbitron', margin: '0 0 25px 0' }}>GERENCIAR FROTA DE KARTS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
              
              {/* Form Karts */}
              <div className="glass-card">
                <h4 style={{ fontFamily: 'Orbitron', margin: '0 0 20px 0' }}>{kartForm.id ? '📝 EDITAR KART' : '🚗 CADASTRAR KART'}</h4>
                <form onSubmit={handleKartSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Número do Kart</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="Ex: 14" 
                      value={kartForm.numero} 
                      onChange={e => setKartForm({...kartForm, numero: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Modelo / Motorização</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Honda 13HP GX390" 
                      value={kartForm.modelo} 
                      onChange={e => setKartForm({...kartForm, modelo: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select 
                      className="form-input" 
                      value={kartForm.status} 
                      onChange={e => setKartForm({...kartForm, status: e.target.value})}
                    >
                      <option value="DISPONIVEL">Disponível para Corrida</option>
                      <option value="MANUTENCAO">Em Manutenção</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Salvar</button>
                    {kartForm.id && (
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => setKartForm({ id: null, numero: '', modelo: '', status: 'DISPONIVEL' })}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Table Karts */}
              <div className="glass-card" style={{ padding: '10px' }}>
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th className="leaderboard-th">Nº Kart</th>
                      <th className="leaderboard-th">Modelo</th>
                      <th className="leaderboard-th">Status</th>
                      <th className="leaderboard-th" style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {karts.map(k => (
                      <tr key={k.id} className="leaderboard-row">
                        <td className="leaderboard-td" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#e63946' }}>#{k.numero}</td>
                        <td className="leaderboard-td">{k.modelo}</td>
                        <td className="leaderboard-td">
                          <span style={{ 
                            padding: '3px 8px', 
                            borderRadius: '12px', 
                            fontSize: '0.75rem', 
                            backgroundColor: k.status === 'DISPONIVEL' ? 'rgba(40,167,69,0.15)' : 'rgba(220,53,69,0.15)',
                            color: k.status === 'DISPONIVEL' ? '#28a745' : '#dc3545'
                          }}>
                            {k.status}
                          </span>
                        </td>
                        <td className="leaderboard-td" style={{ textAlign: 'right' }}>
                          <button onClick={() => setKartForm(k)} className="btn-secondary" style={{ padding: '4px 8px', marginRight: '5px', fontSize: '0.8rem' }}>Editar</button>
                          <button onClick={() => deleteKart(k.id)} className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.8rem', backgroundColor: '#dc3545' }}>Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TABS: CLIENTES */}
        {activeTab === 'usuarios' && (
          <div>
            <h2 style={{ fontFamily: 'Orbitron', margin: '0 0 25px 0' }}>CLIENTES & USUÁRIOS</h2>
            <div className="glass-card" style={{ padding: '10px' }}>
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th className="leaderboard-th">Nome</th>
                    <th className="leaderboard-th">Email</th>
                    <th className="leaderboard-th">CPF</th>
                    <th className="leaderboard-th">Telefone</th>
                    <th className="leaderboard-th">Permissões</th>
                    <th className="leaderboard-th" style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id} className="leaderboard-row">
                      <td className="leaderboard-td" style={{ fontWeight: 'bold' }}>{u.nome}</td>
                      <td className="leaderboard-td">{u.email}</td>
                      <td className="leaderboard-td">{u.cpf || '---'}</td>
                      <td className="leaderboard-td">{u.telefone || '---'}</td>
                      <td className="leaderboard-td">
                        <span style={{ 
                          padding: '3px 8px', 
                          borderRadius: '12px', 
                          fontSize: '0.75rem', 
                          backgroundColor: u.role === 'ADMIN' ? 'rgba(255,193,7,0.15)' : 'rgba(255,255,255,0.05)',
                          color: u.role === 'ADMIN' ? '#ffc107' : '#a0a0ab'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td className="leaderboard-td" style={{ textCombineUpright: 'right', textAlign: 'right' }}>
                        <button 
                          onClick={() => toggleUserRole(u.id, u.role)} 
                          className="btn-secondary" 
                          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        >
                          Alterar para {u.role === 'ADMIN' ? 'CLIENT' : 'ADMIN'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TABS: EVENTOS */}
        {activeTab === 'eventos' && (
          <div>
            <h2 style={{ fontFamily: 'Orbitron', margin: '0 0 25px 0' }}>ORGANIZAR EVENTOS & TORNEIOS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
              
              {/* Form Eventos */}
              <div className="glass-card">
                <h4 style={{ fontFamily: 'Orbitron', margin: '0 0 20px 0' }}>{eventoForm.id ? '📝 EDITAR EVENTO' : '🏆 NOVO EVENTO'}</h4>
                <form onSubmit={handleEventoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Nome do Evento</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Grande Prêmio de Outono" 
                      value={eventoForm.nome} 
                      onChange={e => setEventoForm({...eventoForm, nome: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Data e Hora</label>
                    <input 
                      type="datetime-local" 
                      className="form-input" 
                      value={eventoForm.dataHora} 
                      onChange={e => setEventoForm({...eventoForm, dataHora: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Descrição</label>
                    <textarea 
                      className="form-input" 
                      style={{ minHeight: '60px', fontFamily: 'inherit' }}
                      placeholder="Ex: Torneio fechado com baterias qualificatórias..." 
                      value={eventoForm.descricao} 
                      onChange={e => setEventoForm({...eventoForm, descricao: e.target.value})}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">Inscrição (R$)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="Ex: 120.00" 
                        value={eventoForm.precoInscricao} 
                        onChange={e => setEventoForm({...eventoForm, precoInscricao: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Máx. Pilotos</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="Ex: 24" 
                        value={eventoForm.limiteParticipantes} 
                        onChange={e => setEventoForm({...eventoForm, limiteParticipantes: e.target.value})}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Salvar</button>
                    {eventoForm.id && (
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => setEventoForm({ id: null, nome: '', dataHora: '', descricao: '', precoInscricao: '', limiteParticipantes: '' })}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List Eventos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {eventos.map(ev => (
                  <div key={ev.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', fontFamily: 'Orbitron', color: '#ffc107' }}>{ev.nome}</h4>
                      <p style={{ margin: '3px 0', fontSize: '0.85rem', color: '#a0a0ab' }}>{ev.descricao}</p>
                      <p style={{ margin: '3px 0', fontSize: '0.85rem' }}>
                        🕒 {new Date(ev.dataHora).toLocaleString('pt-BR')} | Inscrição: <strong style={{ color: '#28a745' }}>R$ {ev.precoInscricao?.toFixed(2)}</strong>
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setEventoForm(ev)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Editar</button>
                      <button onClick={() => deleteEvento(ev.id)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#dc3545' }}>Excluir</button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;
