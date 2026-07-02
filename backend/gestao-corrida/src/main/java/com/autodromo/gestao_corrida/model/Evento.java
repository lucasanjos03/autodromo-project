package com.autodromo.gestao_corrida.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_evento")
@Data
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private LocalDateTime dataHora;

    private String descricao;

    private Double precoInscricao;

    private Integer limiteParticipantes;
}
