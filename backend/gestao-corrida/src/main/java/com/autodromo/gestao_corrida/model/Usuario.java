package com.autodromo.gestao_corrida.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tb_usuario")
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true)
    private String email;

    private String senha;

    private String role = "CLIENT"; // "CLIENT", "ADMIN"

    private String cpf;

    private String telefone;
}
