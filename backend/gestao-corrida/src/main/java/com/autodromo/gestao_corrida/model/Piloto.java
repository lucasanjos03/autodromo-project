package com.autodromo.gestao_corrida.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

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

    @ManyToOne
    @JoinColumn(name = "bateria_id")
    @JsonIgnore
    @ToString.Exclude
    private Bateria bateria;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = true)
    private Usuario usuario;
}