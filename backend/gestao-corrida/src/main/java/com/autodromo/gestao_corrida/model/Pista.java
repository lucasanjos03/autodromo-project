package com.autodromo.gestao_corrida.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tb_pista")
@Data
public class Pista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private Integer extensaoMetros;

    private Double recordeTempo; // e.g., 42.15 seconds

    private String recordePiloto; // Name of the record holder
}
