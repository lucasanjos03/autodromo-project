package com.autodromo.gestao_corrida;

import com.autodromo.gestao_corrida.model.Bateria;
import com.autodromo.gestao_corrida.model.Piloto;
import com.autodromo.gestao_corrida.repository.BateriaRepository;
import com.autodromo.gestao_corrida.repository.PilotoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class GestaoCorridaApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestaoCorridaApplication.class, args);
	}

	@Bean
	CommandLineRunner init(BateriaRepository bateriaRepo, PilotoRepository pilotoRepo) {
		return args -> {
			// 1. Criar um piloto
			Piloto p1 = new Piloto();
			p1.setNome("Ayrton Senna");
			p1.setEquipe("McLaren");
			p1.setNumeroCarro(12);

			// 2. Criar uma bateria e adicionar o piloto nela
			Bateria b1 = new Bateria();
			b1.setNome("GP de Interlagos");
			b1.setPilotos(List.of(p1)); // Vincula o piloto à bateria

			bateriaRepo.save(b1);
			System.out.println("✅ Dados de teste carregados com sucesso!");
		};
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