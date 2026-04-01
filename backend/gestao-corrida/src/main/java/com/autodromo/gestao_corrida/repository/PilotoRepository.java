package com.autodromo.gestao_corrida.repository;

import com.autodromo.gestao_corrida.model.Piloto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PilotoRepository extends JpaRepository<Piloto, Long> {
}