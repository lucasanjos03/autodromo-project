package com.autodromo.gestao_corrida.repository;

import com.autodromo.gestao_corrida.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
}
