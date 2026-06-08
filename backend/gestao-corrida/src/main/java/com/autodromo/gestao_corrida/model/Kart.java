package com.autodromo.gestao_corrida.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tb_kart")
@Data
public class Kart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer numero;

    private String modelo;

    private String status = "DISPONIVEL"; // "DISPONIVEL", "MANUTENCAO"
}
