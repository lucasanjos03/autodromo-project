package com.autodromo.gestao_corrida.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity             // Isso diz ao JPA para criar uma tabela no Postgres
@Table(name = "tb_bateria")
@Data               // O Lombok cria Getters, Setters e ToString sozinho
public class Bateria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime horario;

    private String status; // "AGENDADA", "EM_CURSO", "FINALIZADA"

    private Integer vagasOcupadas = 0;

    @Column(updatable = false)
    private final Integer limiteVagas = 15;

    public void setHorario(LocalDateTime now) {
    }

    public void setStatus(String agendada) {
    }
}