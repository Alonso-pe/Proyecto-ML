package com.dashboardia.backend.migo;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class MigoClient {

    // Cambia esta URL y token por los que corresponda si usas la API real de apiamigo
    private static final String API_URL = "https://api.apimigo.example/v1/dni";
    private static final String TOKEN = "TU_TOKEN_AQUI";

    public MigoDniResponse getPersonByDni(String dni) throws MigoException {
        try {
            RestTemplate rest = new RestTemplate();
            String url = UriComponentsBuilder.fromHttpUrl(API_URL)
                    .pathSegment(dni)
                    .queryParam("token", TOKEN)
                    .toUriString();

            MigoDniResponse resp = rest.getForObject(url, MigoDniResponse.class);

            if (resp == null) {
                throw new MigoException("Respuesta vacía de Migo");
            }
            return resp;
        } catch (Exception e) {
            throw new MigoException("Error consultando Migo: " + e.getMessage());
        }
    }
}
