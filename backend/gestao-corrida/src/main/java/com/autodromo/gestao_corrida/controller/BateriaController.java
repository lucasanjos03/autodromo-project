package com.autodromo.gestao_corrida.controller;

import com.autodromo.gestao_corrida.model.Bateria;
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
}