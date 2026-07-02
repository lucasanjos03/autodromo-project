package com.autodromo.gestao_corrida.controller;

import com.autodromo.gestao_corrida.model.Evento;
import com.autodromo.gestao_corrida.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/eventos")
public class EventoController {

    @Autowired
    private EventoRepository repository;

    @GetMapping
    public List<Evento> listarTodos() {
        return repository.findAll();
    }

    @PostMapping
    public Evento criar(@RequestBody Evento evento) {
        return repository.save(evento);
    }

    @PutMapping("/{id}")
    public Evento atualizar(@PathVariable Long id, @RequestBody Evento dados) {
        Evento evento = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado."));

        evento.setNome(dados.getNome());
        evento.setDataHora(dados.getDataHora());
        evento.setDescricao(dados.getDescricao());
        evento.setPrecoInscricao(dados.getPrecoInscricao());
        evento.setLimiteParticipantes(dados.getLimiteParticipantes());

        return repository.save(evento);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado.");
        }
        repository.deleteById(id);
    }
}
