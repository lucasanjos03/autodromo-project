package com.autodromo.gestao_corrida.repository;

import com.autodromo.gestao_corrida.model.Bateria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BateriaRepository extends JpaRepository<Bateria, Long> {
    // Aqui o Spring já nos dá métodos como save(), findAll(), delete(), etc.
}