package com.autodromo.gestao_corrida.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_bateria")
@Data
public class Bateria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private LocalDateTime horario;

    private String status = "PENDENTE"; // "PENDENTE", "EM_ANDAMENTO", "FINALIZADA"

    private Integer vagasOcupadas = 0;

    @Column(updatable = false)
    private final Integer limiteVagas = 15;

    private Long primeiroLugarId;
    private Long segundoLugarId;
    private Long terceiroLugarId;

    @ManyToOne
    @JoinColumn(name = "pista_id", nullable = true)
    private Pista pista;

    @OneToMany(mappedBy = "bateria", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Piloto> pilotos = new ArrayList<>();
}