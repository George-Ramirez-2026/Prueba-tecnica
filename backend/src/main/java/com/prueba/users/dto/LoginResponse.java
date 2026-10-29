package com.prueba.users.dto;

public record LoginResponse(String token, String username, long expiresInMs) {}
