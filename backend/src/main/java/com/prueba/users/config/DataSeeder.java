package com.prueba.users.config;

import com.prueba.users.entity.User;
import com.prueba.users.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Crea el usuario inicial admin / Admin123* si la tabla está vacía. */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedAdmin(UserRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (repo.count() == 0) {
                User u = new User();
                u.setUsername("admin");
                u.setEmail("admin@example.com");
                u.setPassword(encoder.encode("Admin123*"));
                u.setEstado(true);
                repo.save(u);
            }
        };
    }
}
