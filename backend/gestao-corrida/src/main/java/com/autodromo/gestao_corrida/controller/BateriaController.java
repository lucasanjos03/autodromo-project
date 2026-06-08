package com.autodromo.gestao_corrida.controller;

import com.autodromo.gestao_corrida.model.Bateria;
import com.autodromo.gestao_corrida.model.Piloto;
import com.autodromo.gestao_corrida.model.Pista;
import com.autodromo.gestao_corrida.model.Usuario;
import com.autodromo.gestao_corrida.repository.BateriaRepository;
import com.autodromo.gestao_corrida.repository.PistaRepository;
import com.autodromo.gestao_corrida.repository.UsuarioRepository;
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

    @Autowired
    private PistaRepository pistaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Bateria> listarTodas() {
        return repository.findAll();
    }

    @PostMapping
    public Bateria criar(@RequestBody Map<String, Object> payload) {
        Bateria bateria = new Bateria();
        bateria.setNome((String) payload.get("nome"));
        
        if (payload.get("horario") != null) {
            bateria.setHorario(java.time.LocalDateTime.parse((String) payload.get("horario")));
        } else {
            bateria.setHorario(java.time.LocalDateTime.now());
        }

        if (payload.get("pistaId") != null) {
            Long pistaId = Long.valueOf(payload.get("pistaId").toString());
            Pista pista = pistaRepository.findById(pistaId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pista não encontrada"));
            bateria.setPista(pista);
        }

        bateria.setStatus("PENDENTE");
        bateria.setVagasOcupadas(0);
        return repository.save(bateria);
    }

    @PutMapping("/{id}")
    public Bateria atualizar(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Bateria bateria = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bateria não encontrada"));

        bateria.setNome((String) payload.get("nome"));
        
        if (payload.get("horario") != null) {
            bateria.setHorario(java.time.LocalDateTime.parse((String) payload.get("horario")));
        }

        if (payload.containsKey("pistaId")) {
            if (payload.get("pistaId") != null) {
                Long pistaId = Long.valueOf(payload.get("pistaId").toString());
                Pista pista = pistaRepository.findById(pistaId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pista não encontrada"));
                bateria.setPista(pista);
            } else {
                bateria.setPista(null);
            }
        }

        if (payload.get("status") != null) {
            bateria.setStatus((String) payload.get("status"));
        }

        return repository.save(bateria);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bateria não encontrada");
        }
        repository.deleteById(id);
    }

    @PostMapping("/{id}/pilotos")
    public Bateria adicionarPiloto(@PathVariable Long id, @RequestBody Piloto piloto) {
        Bateria bateria = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bateria não encontrada"));

        if (!"PENDENTE".equals(bateria.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Não é possível adicionar pilotos em uma bateria " + bateria.getStatus());
        }

        if (bateria.getPilotos().size() >= bateria.getLimiteVagas()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A bateria já está lotada!");
        }

        // Check if user is associated
        if (piloto.getUsuario() != null && piloto.getUsuario().getId() != null) {
            Usuario usuario = usuarioRepository.findById(piloto.getUsuario().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário associado não encontrado"));
            piloto.setUsuario(usuario);
        }

        piloto.setBateria(bateria);
        bateria.getPilotos().add(piloto);
        bateria.setVagasOcupadas(bateria.getPilotos().size());

        return repository.save(bateria);
    }

    @DeleteMapping("/{bateriaId}/pilotos/{pilotoId}")
    public Bateria removerPiloto(@PathVariable Long bateriaId, @PathVariable Long pilotoId) {
        Bateria bateria = repository.findById(bateriaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bateria não encontrada"));

        bateria.getPilotos().removeIf(p -> p.getId().equals(pilotoId));
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