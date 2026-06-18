import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const formatarData = (dataStr) => {
  if (!dataStr) return 'Não definida';
  const data = new Date(dataStr);
  if (isNaN(data.getTime()) || data.getFullYear() <= 1970) return 'Não definida';
  return data.toLocaleString('pt-BR');
};

function Home() {
  const [baterias, setBaterias] = useState([]);
  const [pistas, setPistas] = useState([]);

  useEffect(() => {
    // Carregar dados das baterias (apenas pendentes e com datas futuras)
    axios.get('http://localhost:8080/baterias')
      .then(res => {
        const agora = new Date();
        const futuras = res.data.filter(b => {
          const isFinalizada = (b.status || 'PENDENTE') === 'FINALIZADA';
          const isPassada = b.horario && new Date(b.horario) < agora;
          return !isFinalizada && !isPassada;
        });
        setBaterias(futuras);
      })
      .catch(err => console.error("Erro ao buscar baterias", err));

    // Carregar dados das pistas
    axios.get('http://localhost:8080/pistas')
      .then(res => setPistas(res.data))
      .catch(err => console.error("Erro ao buscar pistas", err));
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0c', color: 'white', display: 'flex', flexDirection: 'column' }}>
      
      {/* HERO SECTION */}
      <section className="hero-section" style={{
        position: 'relative',
        padding: '100px 20px',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, rgba(230, 57, 70, 0.15) 0%, rgba(10, 10, 12, 0) 70%), #0d0d11',
        borderBottom: '1px solid #1f1f27'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <span style={{ 
            color: '#e63946', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            letterSpacing: '3px',
            fontSize: '0.9rem',
            display: 'inline-block',
            marginBottom: '15px',
            border: '1px solid rgba(230, 57, 70, 0.3)',
            padding: '5px 15px',
            borderRadius: '20px',
            backgroundColor: 'rgba(230, 57, 70, 0.05)'
          }}>
            ⚡ Sinta a Velocidade Máxima
          </span>
          <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: '800', fontFamily: 'Orbitron' }}>
            ACELERE NO KARTÓDROMO <span style={{ color: '#e63946' }}>KARTPRO</span>
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.2rem', color: '#a0a0ab', marginBottom: '40px', lineHeight: '1.7' }}>
            Pistas profissionais homologadas, telemetria digital em tempo real e karts italianos de última geração. Agende sua bateria individual ou traga seu grupo para um campeonato exclusivo!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn-primary" style={{ padding: '15px 35px', fontSize: '1rem' }}>
              Agendar Corrida Now
            </Link>
            <a href="#pistas" className="btn-secondary" style={{ padding: '15px 35px', fontSize: '1rem', textDecoration: 'none' }}>
              Ver Pistas & Recordes
            </a>
          </div>
        </div>

        {/* Floating Quick Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          marginTop: '60px',
          flexWrap: 'wrap',
          borderTop: '1px solid #1f1f27',
          paddingTop: '40px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Orbitron', color: '#e63946', fontSize: '2rem', margin: '0' }}>13 HP</h3>
            <span style={{ color: '#a0a0ab', fontSize: '0.85rem' }}>Motores Honda GX390</span>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid #2a2a35', paddingLeft: '40px' }}>
            <h3 style={{ fontFamily: 'Orbitron', color: '#ffc107', fontSize: '2rem', margin: '0' }}>1.200m</h3>
            <span style={{ color: '#a0a0ab', fontSize: '0.85rem' }}>Extensão do Traçado</span>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid #2a2a35', paddingLeft: '40px' }}>
            <h3 style={{ fontFamily: 'Orbitron', color: '#28a745', fontSize: '2rem', margin: '0' }}>100%</h3>
            <span style={{ color: '#a0a0ab', fontSize: '0.85rem' }}>Telemetria de F1</span>
          </div>
        </div>
      </section>

      {/* DETALHES DOS SERVIÇOS */}
      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontFamily: 'Orbitron', letterSpacing: '2px', color: '#fff' }}> O QUE OFERECEMOS</h2>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#e63946', margin: '15px auto 0 auto' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          
          <div className="glass-card" style={{ padding: '30px', position: 'relative' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🏎️</div>
            <h3 style={{ fontFamily: 'Orbitron', color: '#e63946', margin: '0 0 10px 0' }}>Corridas Avulsas</h3>
            <p style={{ color: '#a0a0ab', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Baterias individuais de 25 minutos com briefing de segurança, macacão, capacete e relatório impresso com os tempos de volta detalhados.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '30px', position: 'relative' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🏆</div>
            <h3 style={{ fontFamily: 'Orbitron', color: '#e63946', margin: '0 0 10px 0' }}>Campeonatos Fechados</h3>
            <p style={{ color: '#a0a0ab', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Organize grids de largada exclusivos para seus amigos ou equipe. Formato profissional com treino livre, tomada de tempos e pódio com espumante.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '30px', position: 'relative' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>💼</div>
            <h3 style={{ fontFamily: 'Orbitron', color: '#e63946', margin: '0 0 10px 0' }}>Corporativos & Team Building</h3>
            <p style={{ color: '#a0a0ab', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Proporcione uma experiência eletrizante para seus colaboradores. Estrutura completa de eventos corporativos, coffee break e área vip climatizada.
            </p>
          </div>

        </div>
      </section>

      {/* PISTAS & RECORDES SECTION */}
      <section id="pistas" style={{ padding: '80px 40px', backgroundColor: '#0c0c10', borderTop: '1px solid #1f1f27', borderBottom: '1px solid #1f1f27' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <span style={{ color: '#e63946', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>Traçados Técnicos</span>
              <h2 style={{ fontFamily: 'Orbitron', fontSize: '2.2rem', margin: '10px 0 20px 0' }}>NOSSAS PISTAS</h2>
              <p style={{ color: '#a0a0ab', lineHeight: '1.7', marginBottom: '25px' }}>
                Possuímos 2 pistas ativas projetadas por pilotos profissionais para testar ao máximo suas habilidades. Curvas fechadas em formato "S", curvas de alta e retas longas de aceleração máxima esperam por você.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e63946' }}></div>
                  <span><strong>Asfalto Especial:</strong> Máxima aderência e segurança em todas as condições climáticas.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e63946' }}></div>
                  <span><strong>Segurança Avançada:</strong> Barreiras de pneus revestidas de borracha especial.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e63946' }}></div>
                  <span><strong>Cronometragem AMB IT:</strong> Sensores digitais precisos até a milésima de segundo.</span>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: 'Orbitron', fontSize: '1.4rem', color: '#ffc107', marginBottom: '20px' }}>
                🏆 RECORDES ATUAIS DAS PISTAS
              </h3>
              {pistas.length > 0 ? (
                <div className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
                  <table className="leaderboard-table">
                    <thead>
                      <tr>
                        <th className="leaderboard-th">Pista</th>
                        <th className="leaderboard-th">Tamanho</th>
                        <th className="leaderboard-th">Melhor Tempo</th>
                        <th className="leaderboard-th">Piloto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pistas.map(p => (
                        <tr key={p.id} className="leaderboard-row">
                          <td className="leaderboard-td" style={{ fontWeight: 'bold' }}>{p.nome}</td>
                          <td className="leaderboard-td" style={{ color: '#a0a0ab' }}>{p.extensaoMetros}m</td>
                          <td className="leaderboard-td" style={{ color: '#ffc107', fontWeight: 'bold' }}>{p.recordeTempo ? `${p.recordeTempo}s` : '---'}</td>
                          <td className="leaderboard-td">{p.recordePiloto || '---'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: '#a0a0ab' }}>Nenhuma pista ou recorde disponível no momento.</p>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* PRÓXIMAS BATERIAS & INSCRIÇÃO RÁPIDA */}
      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: '#e63946', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>Treinos Agendados</span>
          <h2 style={{ fontFamily: 'Orbitron', letterSpacing: '2px', color: '#fff', marginTop: '10px' }}>PRÓXIMAS CORRIDAS</h2>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#e63946', margin: '15px auto 0 auto' }}></div>
        </div>

        {baterias.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
            {baterias.map(b => (
              <div key={b.id} className="glass-card" style={{ borderLeft: '4px solid #ffc107', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'Orbitron' }}>{b.nome}</h3>
                    <span className={`status-badge ${(b.status || 'PENDENTE').toLowerCase().replace('_', '-')}`}>{b.status || 'PENDENTE'}</span>
                  </div>
                  <p style={{ margin: '15px 0 5px 0', fontSize: '0.9rem', color: '#a0a0ab' }}>
                    🕒 Horário: <strong>{formatarData(b.horario)}</strong>
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#a0a0ab' }}>
                    🏎️ Pista: <strong>{b.pista ? b.pista.nome : 'Pista Geral'}</strong>
                  </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #1f1f27', paddingTop: '15px' }}>
                  <span style={{ fontSize: '0.85rem' }}>Vagas: <strong>{b.pilotos?.length || 0} / {b.limiteVagas}</strong></span>
                  <Link to="/login" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Inscrever-se</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: '#a0a0ab', marginBottom: '20px' }}>Não há baterias públicas com vagas disponíveis para inscrição imediata.</p>
            <Link to="/login" className="btn-primary">Criar Nova Corrida</Link>
          </div>
        )}
      </section>

      {/* PLANOS DE PREÇOS */}
      <section style={{ padding: '80px 40px', backgroundColor: '#0c0c10', borderTop: '1px solid #1f1f27' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '50px' }}>
            <span style={{ color: '#e63946', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>Valores Competitivos</span>
            <h2 style={{ fontFamily: 'Orbitron', letterSpacing: '2px', color: '#fff', marginTop: '10px' }}>PLANOS & TARIFAS</h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: '#e63946', margin: '15px auto 0 auto' }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            
            {/* Plano Individual */}
            <div className="glass-card" style={{ padding: '40px 30px', border: '1px solid #2a2a35' }}>
              <h4 style={{ fontFamily: 'Orbitron', margin: '0 0 10px 0', fontSize: '1.2rem' }}>Bateria Individual</h4>
              <p style={{ color: '#a0a0ab', fontSize: '0.9rem', marginBottom: '20px' }}>Para pilotos que desejam correr sozinhos ou se juntar a baterias abertas.</p>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#e63946', fontFamily: 'Orbitron', marginBottom: '20px' }}>
                R$ 120<span style={{ fontSize: '1rem', color: '#a0a0ab' }}> / 30 min</span>
              </div>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#a0a0ab', textAlign: 'left' }}>
                <li>✔️ Macacão e capacete inclusos</li>
                <li>✔️ Telemetria completa impressa</li>
                <li>✔️ Briefing de pilotagem</li>
                <li>✔️ Pista compartilhada</li>
              </ul>
              <Link to="/login" className="btn-primary" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>Agendar Bateria</Link>
            </div>

            {/* Plano Grupo */}
            <div className="glass-card" style={{ padding: '40px 30px', border: '2px solid #e63946', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#e63946', color: 'white', padding: '3px 15px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Popular</div>
              <h4 style={{ fontFamily: 'Orbitron', margin: '0 0 10px 0', fontSize: '1.2rem' }}>Pacote Grupo</h4>
              <p style={{ color: '#a0a0ab', fontSize: '0.9rem', marginBottom: '20px' }}>Exclusivo para grupos e amigos com grid de largada dedicado.</p>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#e63946', fontFamily: 'Orbitron', marginBottom: '20px' }}>
                R$ 95<span style={{ fontSize: '1rem', color: '#a0a0ab' }}> / por piloto</span>
              </div>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#a0a0ab', textAlign: 'left' }}>
                <li>✔️ Mínimo de 10 pilotos</li>
                <li>✔️ Traçado de pista exclusivo</li>
                <li>✔️ 5min treinos + 20min corrida</li>
                <li>✔️ Pódio para os 3 melhores</li>
              </ul>
              <Link to="/login" className="btn-primary" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>Reservar Grupo</Link>
            </div>

            {/* Plano Exclusivo */}
            <div className="glass-card" style={{ padding: '40px 30px', border: '1px solid #2a2a35' }}>
              <h4 style={{ fontFamily: 'Orbitron', margin: '0 0 10px 0', fontSize: '1.2rem' }}>Campeonato Fechado</h4>
              <p style={{ color: '#a0a0ab', fontSize: '0.9rem', marginBottom: '20px' }}>Campeonatos empresariais com regulamento e pódio profissional.</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#e63946', fontFamily: 'Orbitron', marginBottom: '20px', padding: '8px 0' }}>
                Sob Consulta
              </div>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#a0a0ab', textAlign: 'left' }}>
                <li>✔️ Cronometragem dedicada</li>
                <li>✔️ Diretor de prova exclusivo</li>
                <li>✔️ Troféus e medalhas inclusos</li>
                <li>✔️ Cobertura fotográfica</li>
              </ul>
              <Link to="/login" className="btn-primary" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', backgroundColor: '#333', color: '#fff' }}>Falar Conosco</Link>
            </div>

          </div>
        </div>
      </section>

      {/* RICH FOOTER SECTION */}
      <footer style={{
        marginTop: 'auto',
        backgroundColor: '#070709',
        borderTop: '1px solid #1f1f27',
        padding: '60px 40px 20px 40px',
        color: '#a0a0ab',
        fontSize: '0.9rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            
            {/* Coluna 1: Racetrack Info */}
            <div>
              <h3 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.2rem', marginBottom: '20px' }}>
                🏁 KART<span style={{ color: '#e63946' }}>PRO</span>
              </h3>
              <p style={{ lineHeight: '1.6', color: '#71717a' }}>
                A maior arena de velocidade e adrenalina do estado. Traçados modernos e frota de alta qualidade para garantir a melhor experiência esportiva.
              </p>
            </div>

            {/* Coluna 2: Working Hours */}
            <div>
              <h4 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1rem', marginBottom: '20px' }}>FUNCIONAMENTO</h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '10px', color: '#71717a' }}>
                <li>Terça a Sexta: <span style={{ color: '#a0a0ab' }}>14:00 - 22:00</span></li>
                <li>Sábado e Domingo: <span style={{ color: '#a0a0ab' }}>09:00 - 23:00</span></li>
                <li>Feriados: <span style={{ color: '#a0a0ab' }}>10:00 - 20:00</span></li>
                <li style={{ color: '#e63946', fontWeight: 'bold' }}>Segundas: Fechado para manutenção</li>
              </ul>
            </div>

            {/* Coluna 3: Links rápidos */}
            <div>
              <h4 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1rem', marginBottom: '20px' }}>LINKS ÚTEIS</h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link to="/login" style={{ color: '#71717a', textDecoration: 'none' }}>Área do Piloto</Link></li>
                <li><a href="#pistas" style={{ color: '#71717a', textDecoration: 'none' }}>Pistas & Layouts</a></li>
                <li><Link to="/login" style={{ color: '#71717a', textDecoration: 'none' }}>Reservar Horário</Link></li>
                <li><Link to="/login" style={{ color: '#71717a', textDecoration: 'none' }}>Regulamento Interno</Link></li>
              </ul>
            </div>

            {/* Coluna 4: Localização */}
            <div>
              <h4 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1rem', marginBottom: '20px' }}>CONTATO & ENDEREÇO</h4>
              <address style={{ fontStyle: 'normal', lineHeight: '1.6', color: '#71717a' }}>
                📍 Av. Ayrton Senna, 1500<br />
                Parque das Pistas, São Paulo - SP<br />
                📞 (11) 4002-8922<br />
                📧 contato@kartpro.com.br
              </address>
            </div>

          </div>

          <div style={{
            borderTop: '1px solid #1f1f27',
            paddingTop: '20px',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: '#71717a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <span>© {new Date().getFullYear()} KartPro Autódromo. Todos os direitos reservados.</span>
            <span>Desenvolvido com Spring Boot & React</span>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default Home;
