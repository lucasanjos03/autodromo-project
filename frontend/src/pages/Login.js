import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !senha || (isRegister && !nome)) {
      Swal.fire('Campos obrigatórios!', 'Por favor, preencha todos os campos.', 'warning');
      return;
    }

    if (isRegister) {
      // Registrar
      axios.post('http://localhost:8080/usuarios/register', { nome, email, senha, cpf, telefone })
        .then(res => {
          Swal.fire({
            title: 'Cadastro Realizado!',
            text: 'Agora você pode entrar com sua conta.',
            icon: 'success',
            confirmButtonText: 'Entrar Agora'
          }).then(() => {
            setIsRegister(false);
            setSenha('');
          });
        })
        .catch(err => {
          console.error(err);
          const msg = err.response?.data?.message || 'Erro ao realizar cadastro.';
          Swal.fire('Erro!', msg, 'error');
        });
    } else {
      // Login
      axios.post('http://localhost:8080/usuarios/login', { email, senha })
        .then(res => {
          Swal.fire({
            title: 'Bem-vindo de volta!',
            text: `Olá, ${res.data.nome}!`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          onLogin(res.data);
        })
        .catch(err => {
          console.error(err);
          const msg = err.response?.data?.message || 'Email ou senha incorretos.';
          Swal.fire('Erro!', msg, 'error');
        });
    }
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 75px)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#0a0a0c',
      background: 'radial-gradient(circle at center, rgba(230, 57, 70, 0.1) 0%, rgba(10, 10, 12, 0) 60%), #0a0a0c',
      padding: '20px'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontFamily: 'Orbitron', fontSize: '2rem', margin: '0 0 10px 0', letterSpacing: '1px' }}>
            {isRegister ? 'CRIAR CONTA' : 'ÁREA DE ACESSO'}
          </h2>
          <p style={{ color: '#a0a0ab', fontSize: '0.9rem' }}>
            {isRegister ? 'Cadastre-se para agendar suas corridas!' : 'Entre para ver suas estatísticas e agendar treinos.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: Lucas Silva" 
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="seuemail@exemplo.com" 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
          </div>

          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">CPF</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="000.000.000-00" 
                  value={cpf}
                  onChange={e => setCpf(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Telefone</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="(00) 00000-0000" 
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                />
              </div>
            </>
          )}

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }}>
            {isRegister ? 'Finalizar Cadastro' : 'Entrar no Sistema'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem', color: '#a0a0ab' }}>
          {isRegister ? (
            <span>Já tem uma conta? <button onClick={() => setIsRegister(false)} style={toggleBtnStyle}>Entre aqui</button></span>
          ) : (
            <span>Novo no kartódromo? <button onClick={() => setIsRegister(true)} style={toggleBtnStyle}>Crie uma conta</button></span>
          )}
        </div>
      </div>
    </div>
  );
}

const toggleBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#e63946',
  fontWeight: 'bold',
  cursor: 'pointer',
  padding: 0,
  fontSize: '0.9rem',
  textDecoration: 'underline'
};

export default Login;
