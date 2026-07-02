package com.autodromo.gestao_corrida.controller;

import com.autodromo.gestao_corrida.model.Usuario;
import com.autodromo.gestao_corrida.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @PostMapping("/register")
    public Usuario registrar(@RequestBody Usuario usuario) {
        if (repository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email já cadastrado.");
        }
        // In a real application, you would encode the password. For this learning project, we store it plainly.
        return repository.save(usuario);
    }

    @PostMapping("/login")
    public Usuario login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String senha = credentials.get("senha");

        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado."));

        if (!usuario.getSenha().equals(senha)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha incorreta.");
        }

        return usuario;
    }

    @GetMapping
    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    @PatchMapping("/{id}/role")
    public Usuario atualizarRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        
        String novaRole = body.get("role");
        if (novaRole != null && ("ADMIN".equals(novaRole) || "CLIENT".equals(novaRole))) {
            usuario.setRole(novaRole);
            return repository.save(usuario);
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role inválida.");
    }
}
