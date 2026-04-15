import React, { useState } from 'react';
import axios from 'axios';

function FormularioPiloto({ bateriaId, aoCadastrar }) {
  // Estados para controlar os inputs
  const [nome, setNome] = useState('');
  const [equipe, setEquipe] = useState('');
  const [numero, setNumero] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const novoPiloto = {
      nome: nome,
      equipe: equipe,
      numeroCarro: parseInt(numero)
    };

    axios.post(`http://localhost:8080/baterias/${bateriaId}/pilotos`, novoPiloto)
      .then(response => {
        setNome('');   
        setEquipe('');    
        setNumero(''); 
        
        // Avisa o App.js para atualizar a lista na tela
        aoCadastrar(); 
      })
      .catch(error => {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao salvar piloto.");
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
      <input 
        placeholder="Nome do Piloto" 
        value={nome} 
        onChange={(e) => setNome(e.target.value)} 
        style={inputStyle}
      />
      <input 
        placeholder="Equipe" 
        value={equipe} 
        onChange={(e) => setEquipe(e.target.value)} 
        style={inputStyle}
      />
      <input 
        placeholder="Nº Carro" 
        type="number"
        value={numero} 
        onChange={(e) => setNumero(e.target.value)} 
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle}>Adicionar</button>
    </form>
  );
}

// Estilos simples para manter o alinhamento
const inputStyle = { marginRight: '5px', padding: '5px' };
const buttonStyle = { padding: '5px 10px', cursor: 'pointer' };

export default FormularioPiloto;