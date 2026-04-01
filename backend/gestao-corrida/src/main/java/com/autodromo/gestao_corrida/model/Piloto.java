package com.autodromo.gestao_corrida.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Piloto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private Integer idade;
    private String equipe;
    private Integer numeroCarro;
}