package com.autodromo.gestao_corrida.controller;

import com.autodromo.gestao_corrida.model.Pista;
import com.autodromo.gestao_corrida.repository.PistaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/pistas")
public class PistaController {

    @Autowired
    private PistaRepository repository;

    @GetMapping
    public List<Pista> listarTodas() {
        return repository.findAll();
    }

    @PostMapping
    public Pista criar(@RequestBody Pista pista) {
        return repository.save(pista);
    }

    @PutMapping("/{id}")
    public Pista atualizar(@PathVariable Long id, @RequestBody Pista dados) {
        Pista pista = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pista não encontrada."));

        pista.setNome(dados.getNome());
        pista.setExtensaoMetros(dados.getExtensaoMetros());
        pista.setRecordeTempo(dados.getRecordeTempo());
        pista.setRecordePiloto(dados.getRecordePiloto());

        return repository.save(pista);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pista não encontrada.");
        }
        repository.deleteById(id);
    }
}
