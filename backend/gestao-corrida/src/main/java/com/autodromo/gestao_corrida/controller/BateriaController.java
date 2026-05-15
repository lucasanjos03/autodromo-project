package com.autodromo.gestao_corrida.controller;

import com.autodromo.gestao_corrida.model.Bateria;
import com.autodromo.gestao_corrida.model.Piloto;
import com.autodromo.gestao_corrida.repository.BateriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/baterias")
public class BateriaController {

    @Autowired
    private BateriaRepository repository;

    @GetMapping
    public List<Bateria> listarTodas() {
        return repository.findAll();
    }

    @PostMapping("/{id}/pilotos")
    public Bateria adicionarPiloto(@PathVariable Long id, @RequestBody Piloto piloto) {
        Bateria bateria = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bateria não encontrada"));

        // Regra de Negócio: Impedir cadastro se não estiver PENDENTE
        if (!"PENDENTE".equals(bateria.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Não é possível adicionar pilotos em uma bateria " + bateria.getStatus());
        }

        // Regra de Negócio: Validar limite de vagas
        if (bateria.getPilotos().size() >= bateria.getLimiteVagas()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A bateria já está lotada!");
        }

        piloto.setBateria(bateria);
        bateria.getPilotos().add(piloto);
        
        // Atualiza o contador de vagas ocupadas
        bateria.setVagasOcupadas(bateria.getPilotos().size());

        return repository.save(bateria);
    }

    @DeleteMapping("/{bateriaId}/pilotos/{pilotoId}")
    public Bateria removerPiloto(@PathVariable Long bateriaId, @PathVariable Long pilotoId) {
        Bateria bateria = repository.findById(bateriaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bateria não encontrada"));

        // Remove o piloto da lista (o orphanRemoval=true no model cuidará da exclusão no banco)
        bateria.getPilotos().removeIf(p -> p.getId().equals(pilotoId));
        
        // Atualiza o contador
        bateria.setVagasOcupadas(bateria.getPilotos().size());

        return repository.save(bateria);
    }

    @PatchMapping("/{id}/status")
    public Bateria atualizarStatus(@PathVariable Long id, @RequestBody String novoStatus) {
        Bateria bateria = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bateria não encontrada"));

        String statusLimpo = novoStatus.replace("\"", "").trim();
        bateria.setStatus(statusLimpo);
        return repository.save(bateria);
    }

    @PatchMapping("/{id}/podio")
    public Bateria definirPodio(@PathVariable Long id, @RequestBody Map<String, Long> podio) {
        Bateria bateria = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bateria não encontrada"));

        if (!"FINALIZADA".equals(bateria.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A bateria precisa estar FINALIZADA para definir o pódio.");
        }

        bateria.setPrimeiroLugarId(podio.get("primeiroLugarId"));
        bateria.setSegundoLugarId(podio.get("segundoLugarId"));
        bateria.setTerceiroLugarId(podio.get("terceiroLugarId"));

        return repository.save(bateria);
    }
}