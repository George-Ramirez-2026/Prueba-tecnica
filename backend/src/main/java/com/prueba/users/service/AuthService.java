package com.prueba.users.service;

import com.prueba.users.dto.LoginRequest;
import com.prueba.users.dto.LoginResponse;
import com.prueba.users.entity.User;
import com.prueba.users.exception.ApiException;
import com.prueba.users.repository.UserRepository;
import com.prueba.users.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository repo, PasswordEncoder encoder, JwtService jwt) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public LoginResponse login(LoginRequest req) {
        User user = repo.findByUsername(req.username())
                .filter(u -> encoder.matches(req.password(), u.getPassword()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos"));
        if (!Boolean.TRUE.equals(user.getEstado())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Usuario inactivo");
        }
        return new LoginResponse(jwt.generateToken(user.getUsername()), user.getUsername(), jwt.getExpirationMs());
    }
}
