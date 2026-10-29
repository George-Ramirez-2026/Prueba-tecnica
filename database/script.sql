CREATE DATABASE IF NOT EXISTS prueba_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE prueba_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    username       VARCHAR(50)  NOT NULL,
    email          VARCHAR(100) NOT NULL,
    password       VARCHAR(100) NOT NULL,           -- hash BCrypt
    estado         BOOLEAN      NOT NULL DEFAULT TRUE,
    fecha_creacion DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_usuarios_username UNIQUE (username),
    CONSTRAINT uq_usuarios_email    UNIQUE (email)
);
-- El usuario inicial (admin / Admin123*) lo crea la API al arrancar si la tabla está vacía.
