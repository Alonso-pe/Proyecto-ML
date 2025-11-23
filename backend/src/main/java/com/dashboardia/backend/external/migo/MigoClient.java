package com.dashboardia.backend.external.migo;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import reactor.util.retry.Retry;

@Service
public class MigoClient {

    private final String apiToken;
    private final String authHeaderName;
    private final WebClient webClient;

    @Autowired
    public MigoClient(org.springframework.web.reactive.function.client.WebClient.Builder webClientBuilder,
            @Value("${migo.api.token}") String apiToken,
            @Value("${migo.api.url}") String apiUrl,
            @Value("${migo.api.auth-header:Authorization}") String authHeaderName) {
        this.apiToken = apiToken;
        this.authHeaderName = authHeaderName;

        // Configure client with reasonable timeouts; baseUrl set to apiUrl so we can
        // use path templates
        this.webClient = webClientBuilder.baseUrl(apiUrl).build();
    }

    // Backward-compatible constructor for tests or callers that provide only
    // webClientBuilder, token and base URL.
    public MigoClient(org.springframework.web.reactive.function.client.WebClient.Builder webClientBuilder,
            String apiToken,
            String apiUrl) {
        this(webClientBuilder, apiToken, apiUrl, "Authorization");
    }

    public MigoDniResponse consultarDni(String dni) throws MigoException {
        // According to Migo docs, the endpoint expects a POST with JSON body { token,
        // dni }
        try {
            java.util.Map<String, String> payload = java.util.Map.of("token", this.apiToken, "dni", dni);

            MigoDniResponse resp = webClient.post()
                    .uri("")
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .header("Accept", "application/json")
                    .header("User-Agent", "Proyecto-ML-Backend/1.0")
                    .bodyValue(payload)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError(), r -> r.bodyToMono(String.class)
                            .map(body -> new MigoException("Client error from Migo: " + body)))
                    .onStatus(status -> status.is5xxServerError(), r -> r.bodyToMono(String.class)
                            .map(body -> new MigoException("Server error from Migo: " + body)))
                    .bodyToMono(MigoDniResponse.class)
                    .block(Duration.ofSeconds(8));

            if (resp != null) {
                return resp;
            }
            throw new MigoException("Empty response from Migo");
        } catch (WebClientResponseException wre) {
            int status = wre.getRawStatusCode();
            String body = "";
            try {
                body = wre.getResponseBodyAsString();
            } catch (Exception ignore) {
            }
            throw new MigoException("Migo response error (" + status + "): " + body);
        } catch (Exception e) {
            throw new MigoException("Error al consultar DNI: " + e.getMessage());
        }
    }
}
