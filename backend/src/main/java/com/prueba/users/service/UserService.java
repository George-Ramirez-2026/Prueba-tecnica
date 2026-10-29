package com.prueba.users.service;

import com.prueba.users.dto.UserRequest;
import com.prueba.users.dto.UserResponse;
import com.prueba.users.entity.User;
import com.prueba.users.exception.ApiException;
import com.prueba.users.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public UserResponse create(UserRequest req) {
        if (req.password() == null || req.password().isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria");
        }
        if (repo.existsByUsername(req.username())) {
            throw new ApiException(HttpStatus.CONFLICT, "El username ya existe");
        }
        if (repo.existsByEmail(req.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "El email ya existe");
        }
        User u = new User();
        u.setUsername(req.username());
        u.setEmail(req.email());
        u.setPassword(encoder.encode(req.password()));
        u.setEstado(req.estado() == null || req.estado());
        return UserResponse.from(repo.save(u));
    }

    public List<UserResponse> findAll() {
        return repo.findAll().stream().map(UserResponse::from).toList();
    }

    public UserResponse findById(Long id) {
        return UserResponse.from(getOrThrow(id));
    }

    public UserResponse update(Long id, UserRequest req) {
        User u = getOrThrow(id);
        if (repo.existsByUsernameAndIdNot(req.username(), id)) {
            throw new ApiException(HttpStatus.CONFLICT, "El username ya existe");
        }
        if (repo.existsByEmailAndIdNot(req.email(), id)) {
            throw new ApiException(HttpStatus.CONFLICT, "El email ya existe");
        }
        u.setUsername(req.username());
        u.setEmail(req.email());
        if (req.password() != null && !req.password().isBlank()) {
            u.setPassword(encoder.encode(req.password()));
        }
        if (req.estado() != null) u.setEstado(req.estado());
        return UserResponse.from(repo.save(u));
    }

    public void delete(Long id) {
        repo.delete(getOrThrow(id));
    }

    private User getOrThrow(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }
}
