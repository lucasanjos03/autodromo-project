package com.autodromo.gestao_corrida.controller;

import com.autodromo.gestao_corrida.repository.BateriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // Atenção: Aqui é @Controller, não @RestController!
public class PaginaController {

    @Autowired
    private BateriaRepository repository;

    @GetMapping("/") // Quando acessar a raiz do site
    public String home(Model model) {
        model.addAttribute("baterias", repository.findAll());
        return "index";
    }
}