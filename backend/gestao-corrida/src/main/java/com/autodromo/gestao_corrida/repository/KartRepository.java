package com.autodromo.gestao_corrida.repository;

import com.autodromo.gestao_corrida.model.Kart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KartRepository extends JpaRepository<Kart, Long> {
}
