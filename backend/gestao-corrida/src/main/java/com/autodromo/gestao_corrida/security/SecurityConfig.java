package com.autodromo.gestao_corrida.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Desabilita CSRF, pois estamos usando JWT
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Aplicação stateless
            .authorizeHttpRequests(auth -> auth
                // Permitir todas as requisições de preflight OPTIONS
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Rotas públicas (login e registro)
                .requestMatchers(HttpMethod.POST, "/usuarios/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/usuarios/register").permitAll()
                
                // Rotas GET podem ser públicas para exibir tabelas
                .requestMatchers(HttpMethod.GET, "/karts/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/pistas/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/baterias/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/eventos/**").permitAll()
                
                // Rotas que alteram dados requerem permissão ADMIN
                .requestMatchers(HttpMethod.POST, "/karts/**", "/pistas/**", "/baterias/**", "/eventos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/karts/**", "/pistas/**", "/baterias/**", "/eventos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/karts/**", "/pistas/**", "/baterias/**", "/eventos/**").hasRole("ADMIN")
                
                // Gerenciamento de usuários
                .requestMatchers(HttpMethod.GET, "/usuarios/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/usuarios/*/role").hasRole("ADMIN")
                
                // Qualquer outra requisição precisa de autenticação
                .anyRequest().authenticated()
            );

        // Adiciona o filtro JWT antes do filtro padrão de autenticação do Spring
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://127.0.0.1:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
