package com.autodromo.gestao_corrida.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        // Extrai o token do header se ele começar com "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwtToken);
            } catch (Exception e) {
                logger.warn("Token JWT inválido ou expirado.");
            }
        }

        // Se encontrou um usuário e ele ainda não está autenticado no contexto
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = this.customUserDetailsService.loadUserByUsername(username);

            // Valida o token
            if (jwtUtil.validateToken(jwtToken, userDetails)) {

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Define o usuário como autenticado
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        
        // Continua a cadeia de filtros
        filterChain.doFilter(request, response);
    }
}
