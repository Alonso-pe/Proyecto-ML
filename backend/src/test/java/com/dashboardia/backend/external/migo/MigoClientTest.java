package com.dashboardia.backend.external.migo;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;

public class MigoClientTest {

    private MockWebServer server;

    @BeforeEach
    void setUp() throws Exception {
        server = new MockWebServer();
        server.start();
    }

    @AfterEach
    void tearDown() throws Exception {
        server.shutdown();
    }

    @Test
    void consultarDni_success() throws Exception {
        String json = "{\"dni\":\"12345678\",\"nombre\":\"Juan\",\"apellido\":\"Perez\",\"direccion\":\"Lima\"}";
        server.enqueue(new MockResponse().setBody(json).setHeader("Content-Type", "application/json"));

        String baseUrl = server.url("/api/v1/dni").toString();

        WebClient.Builder builder = WebClient.builder();
        MigoClient client = new MigoClient(builder, "fake-token", baseUrl);

        MigoDniResponse resp = client.consultarDni("12345678");
        assertEquals("12345678", resp.getDni());
        assertEquals("Juan", resp.getNombre());
        assertEquals("Perez", resp.getApellido());
        assertEquals("Lima", resp.getDireccion());
    }
}
