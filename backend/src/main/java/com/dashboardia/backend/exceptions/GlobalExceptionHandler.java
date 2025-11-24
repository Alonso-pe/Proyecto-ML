package com.dashboardia.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, Object>> manejarValidacionFallida(MethodArgumentNotValidException ex) {
        log.error("Error de validación: {}", ex.getMessage(), ex);
        
        List<String> errores = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(campoError -> campoError.getField() + ": " + campoError.getDefaultMessage())
            .collect(Collectors.toList());

        return construirRespuestaError(HttpStatus.BAD_REQUEST, "Datos inválidos", errores);
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<Map<String, Object>> manejarNoEncontrado(NotFoundException ex) {
        log.error("Recurso no encontrado: {}", ex.getMessage(), ex);
        return construirRespuestaError(HttpStatus.NOT_FOUND, "No encontrado", ex.getMessage());
    }

    @ExceptionHandler(AlreadyVotedException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<Map<String, Object>> manejarVotoExistente(AlreadyVotedException ex) {
        log.error("Intento de voto duplicado: {}", ex.getMessage(), ex);
        return construirRespuestaError(HttpStatus.CONFLICT, "Conflicto", ex.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, Object>> manejarSolicitudInvalida(BadRequestException ex) {
        log.error("Solicitud inválida: {}", ex.getMessage(), ex);
        return construirRespuestaError(HttpStatus.BAD_REQUEST, "Solicitud incorrecta", ex.getMessage());
    }

    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<Map<String, Object>> manejarErrorAutenticacion(AuthenticationException ex) {
        log.error("Error de autenticación: {}", ex.getMessage(), ex);
        return construirRespuestaError(HttpStatus.UNAUTHORIZED, "No autorizado", 
            "Credenciales inválidas o token expirado");
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<Map<String, Object>> manejarAccesoDenegado(AccessDeniedException ex) {
        log.error("Acceso denegado: {}", ex.getMessage(), ex);
        return construirRespuestaError(HttpStatus.FORBIDDEN, "Acceso denegado", 
            "No tienes permiso para acceder a este recurso");
    }

    @ExceptionHandler(TokenRefreshException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<Map<String, Object>> manejarErrorToken(TokenRefreshException ex) {
        log.error("Error con el token de refresco: {}", ex.getMessage(), ex);
        return construirRespuestaError(HttpStatus.FORBIDDEN, "Token inválido", ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Map<String, Object>> manejarErrorGeneral(Exception ex) {
        log.error("Error interno del servidor: {}", ex.getMessage(), ex);
        return construirRespuestaError(
            HttpStatus.INTERNAL_SERVER_ERROR, 
            "Error interno del servidor", 
            "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde."
        );
    }

    private ResponseEntity<Map<String, Object>> construirRespuestaError(
            HttpStatus estado, String error, Object mensaje) {
        
        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("estado", estado.value());
        respuesta.put("error", error);
        respuesta.put("mensaje", mensaje);
        
        return new ResponseEntity<>(respuesta, estado);
    }
}