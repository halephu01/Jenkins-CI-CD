package com.nhom6.microservices.product_service.configuration;

import com.nhom6.microservices.product_service.client.InventoryClient;
import io.micrometer.observation.ObservationRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class RestClientConfig {
    @Value("${inventory.service.url}")
    private String inventoryServiceUrl;

    @Bean
    public InventoryClient inventoryClient(ObservationRegistry observationRegistry) {
        RestClient restClient = RestClient.builder()
                .baseUrl(inventoryServiceUrl)
                .requestInterceptor((request, body, execution) -> {
                    // Lấy token từ SecurityContext
                    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                    if (authentication != null && authentication.getCredentials() instanceof Jwt) {
                        Jwt jwt = (Jwt) authentication.getCredentials();
                        request.getHeaders().setBearerAuth(jwt.getTokenValue());
                    }
                    return execution.execute(request, body);
                })
                .observationRegistry(observationRegistry)
                .build();

        HttpServiceProxyFactory factory = HttpServiceProxyFactory
                .builderFor(RestClientAdapter.create(restClient))
                .build();

        return factory.createClient(InventoryClient.class);
    }
}



