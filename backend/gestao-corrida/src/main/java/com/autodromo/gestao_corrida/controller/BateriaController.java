package com.autodromo.gestao_corrida.controller;

import com.autodromo.gestao_corrida.model.Bateria;
import com.autodromo.gestao_corrida.model.Piloto;
import com.autodromo.gestao_corrida.repository.BateriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/baterias")
public class BateriaController {

    @Autowired
    private BateriaRepository repository;

    @GetMapping // Quando você acessar localhost:8080/baterias metodo get
    public List<Bateria> listarTodas() {
        return repository.findAll();
    }
    @PostMapping("/{id}/pilotos") // Define o caminho /baterias/{id}/pilotos
    public Bateria adicionarPiloto(@PathVariable Long id, @RequestBody Piloto piloto) {
        // 1. Busca a bateria pelo ID que veio na URL
        Bateria bateria = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bateria não encontrada"));

        // 2. Associa o piloto à bateria encontrada
        piloto.setBateria(bateria);

        // 3. Adiciona o piloto na lista da bateria (importante para o JPA entender o vínculo)
        bateria.getPilotos().add(piloto);

        // 4. Salva a bateria (como o cascade está configurado, ele salva o piloto junto)
        return repository.save(bateria);
    }
}