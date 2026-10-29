package com.prueba.users.dto;

import com.prueba.users.entity.User;

import java.time.LocalDateTime;

public record UserResponse(Long id, String username, String email, Boolean estado, LocalDateTime fechaCreacion) {
    public static UserResponse from(User u) {
        return new UserResponse(u.getId(), u.getUsername(), u.getEmail(), u.getEstado(), u.getFechaCreacion());
    }
}
