package com.sintad.technicaltest.Security;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import com.sintad.technicaltest.Utils.JwtUtil;

@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    public JwtChannelInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        try {
            // Uso StompHeaderAccessor para acceder a los encabezados STOMP
            StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtil.validateToken(token)) {
                    return message; // Token válido, permite el mensaje
                }
            }

            throw new IllegalArgumentException("Token JWT inválido o ausente");
        } catch (Exception e) {
            throw new IllegalArgumentException("Error al procesar el token JWT: " + e.getMessage(), e);
        }
    }
}