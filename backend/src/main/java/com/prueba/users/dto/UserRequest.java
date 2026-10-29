package com.prueba.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** password es obligatorio al crear; al editar, si viene vacío se conserva la actual. */
public record UserRequest(
        @NotBlank @Size(min = 3, max = 50) String username,
        @NotBlank @Email @Size(max = 100) String email,
        @Size(min = 6, max = 72) String password,
        Boolean estado) {}
