package com.autodromo.gestao_corrida.controller;

import com.autodromo.gestao_corrida.model.Kart;
import com.autodromo.gestao_corrida.repository.KartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/karts")
public class KartController {

    @Autowired
    private KartRepository repository;

    @GetMapping
    public List<Kart> listarTodos() {
        return repository.findAll();
    }

    @PostMapping
    public Kart criar(@RequestBody Kart kart) {
        return repository.save(kart);
    }

    @PutMapping("/{id}")
    public Kart atualizar(@PathVariable Long id, @RequestBody Kart dados) {
        Kart kart = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kart não encontrado."));

        kart.setNumero(dados.getNumero());
        kart.setModelo(dados.getModelo());
        kart.setStatus(dados.getStatus());

        return repository.save(kart);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Kart não encontrado.");
        }
        repository.deleteById(id);
    }
}
