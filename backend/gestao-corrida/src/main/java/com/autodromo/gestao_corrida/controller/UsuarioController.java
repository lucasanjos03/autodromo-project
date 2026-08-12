package com.autodromo.gestao_corrida.controller;

import com.autodromo.gestao_corrida.model.Usuario;
import com.autodromo.gestao_corrida.repository.UsuarioRepository;
import com.autodromo.gestao_corrida.security.CustomUserDetails;
import com.autodromo.gestao_corrida.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
// CORS is now handled by SecurityConfig, but we can keep it here or remove.
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public Usuario registrar(@RequestBody Usuario usuario) {
        if (repository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email já cadastrado.");
        }
        
        // Hashea a senha antes de salvar
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        
        return repository.save(usuario);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String senha = credentials.get("senha");

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, senha)
            );
            
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            Usuario usuario = userDetails.getUsuario();
            
            String jwtToken = jwtUtil.generateToken(userDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtToken);
            response.put("usuario", usuario); // Pode mandar os dados para facilitar o front
            
            return response;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha incorretos.");
        }
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
