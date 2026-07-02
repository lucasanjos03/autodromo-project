package com.autodromo.gestao_corrida;

import com.autodromo.gestao_corrida.model.*;
import com.autodromo.gestao_corrida.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PistaRepository pistaRepository;

    @Autowired
    private KartRepository kartRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed default Admin
        if (usuarioRepository.findByEmail("admin@kartpro.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador KartPro");
            admin.setEmail("admin@kartpro.com");
            admin.setSenha("admin123");
            admin.setRole("ADMIN");
            admin.setCpf("000.000.000-00");
            admin.setTelefone("(11) 99999-9999");
            usuarioRepository.save(admin);
            System.out.println(">>> SEED: Usuário Admin criado (admin@kartpro.com / admin123)");
        }

        // 2. Seed default Client (Optional, for easy testing)
        if (usuarioRepository.findByEmail("piloto@kartpro.com").isEmpty()) {
            Usuario client = new Usuario();
            client.setNome("Ayrton Silva");
            client.setEmail("piloto@kartpro.com");
            client.setSenha("piloto123");
            client.setRole("CLIENT");
            client.setCpf("111.111.111-11");
            client.setTelefone("(11) 88888-8888");
            usuarioRepository.save(client);
            System.out.println(">>> SEED: Usuário Piloto criado (piloto@kartpro.com / piloto123)");
        }

        // 3. Seed Pistas if none exist
        if (pistaRepository.count() == 0) {
            Pista p1 = new Pista();
            p1.setNome("Pista Interlagos Speed");
            p1.setExtensaoMetros(1200);
            p1.setRecordeTempo(42.58);
            p1.setRecordePiloto("Ayrton Silva");
            pistaRepository.save(p1);

            Pista p2 = new Pista();
            p2.setNome("Pista Monza Kart");
            p2.setExtensaoMetros(950);
            p2.setRecordeTempo(37.45);
            p2.setRecordePiloto("Claudio Leme");
            pistaRepository.save(p2);

            System.out.println(">>> SEED: Pistas padrão adicionadas");
        }

        // 4. Seed Karts if none exist
        if (kartRepository.count() == 0) {
            for (int num : new int[]{7, 12, 14, 27, 44}) {
                Kart k = new Kart();
                k.setNumero(num);
                k.setModelo("Honda GX390 13HP");
                k.setStatus("DISPONIVEL");
                kartRepository.save(k);
            }
            System.out.println(">>> SEED: Frota de karts padrão adicionada");
        }

        // 5. Seed Eventos if none exist
        if (eventoRepository.count() == 0) {
            Evento e1 = new Evento();
            e1.setNome("Copa Outono Speed Kart");
            e1.setDataHora(LocalDateTime.now().plusDays(10));
            e1.setDescricao("Campeonato amador aberto para todos os pilotos entusiastas da velocidade. Premiação em troféus e brindes!");
            e1.setPrecoInscricao(120.00);
            e1.setLimiteParticipantes(24);
            eventoRepository.save(e1);
            System.out.println(">>> SEED: Evento padrão adicionado");
        }
    }
}
