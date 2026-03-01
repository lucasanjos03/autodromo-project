package com.autodromo.gestao_corrida;

import com.autodromo.gestao_corrida.model.Bateria;
import com.autodromo.gestao_corrida.repository.BateriaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@SpringBootApplication
public class GestaoCorridaApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestaoCorridaApplication.class, args);
	}

	@Bean
	CommandLineRunner run(BateriaRepository repository) {
		return args -> {
			Bateria b = new Bateria();
			b.setStatus("AGENDADA");
			b.setHorario(LocalDateTime.now());

			repository.save(b);
			System.out.println("✅ Bateria de teste salva no banco com sucesso!");
		};
	}
}