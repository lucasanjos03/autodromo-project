package com.autodromo.gestao_corrida.controller;

import com.autodromo.gestao_corrida.model.Piloto;
import com.autodromo.gestao_corrida.repository.PilotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/pilotos")
public class PilotoController {

    @Autowired
    private PilotoRepository repository;

    @GetMapping
    public List<Piloto> listarTodos() {
        return repository.findAll();
    }
}
