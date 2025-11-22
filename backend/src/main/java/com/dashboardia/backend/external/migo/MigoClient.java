package com.dashboardia.backend.external.migo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
public class MigoClient {

    @Value("${migo.api.token}")
    private String apiToken;

    @Value("${migo.api.url}")
    private String apiUrl;

    private final WebClient webClient;

    public MigoClient() {
        this.webClient = WebClient.builder().build();
    }

    public MigoDniResponse consultarDni(String dni) throws MigoException {
        try {
            return webClient.get()
                    .uri(apiUrl + "/" + dni)
                    .header("Authorization", "Bearer " + apiToken)
                    .retrieve()
                    .bodyToMono(MigoDniResponse.class)
                    .block();
        } catch (WebClientResponseException e) {
            throw new MigoException("Error al consultar DNI: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            throw new MigoException("Error inesperado al consultar DNI: " + e.getMessage());
        }
    }
}
