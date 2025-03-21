package com.sintad.technicaltest.Components;

import com.sintad.technicaltest.Entitys.Usuario;
import com.sintad.technicaltest.Services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class UsuarioInicial implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioInicial.class);

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Verifica si el usuario "admin" ya existe
            usuarioService.loadUserByUsername("admin");
            logger.info("El usuario administrador ya existe.");
        } catch (UsernameNotFoundException e) {
            // Crea un nuevo usuario administrador si no existe
            Usuario admin = new Usuario();
            admin.setNombreUsuario("admin");

            // Genera una contraseña segura y la cifra
            String contrasena = "admin123"; // Cambia esto por una contraseña generada o configurada
            admin.setContrasena(passwordEncoder.encode(contrasena));

            // Guarda el usuario administrador
            usuarioService.crearUsuario(admin);

            logger.info("Usuario administrador creado con nombre de usuario: 'admin' y contraseña predeterminada.");
        }
    }
}