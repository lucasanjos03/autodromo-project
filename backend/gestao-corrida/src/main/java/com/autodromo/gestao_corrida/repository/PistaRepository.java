package com.autodromo.gestao_corrida.repository;

import com.autodromo.gestao_corrida.model.Pista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PistaRepository extends JpaRepository<Pista, Long> {
}
