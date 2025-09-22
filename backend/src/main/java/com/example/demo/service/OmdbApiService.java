package com.example.demo.service;

import com.example.demo.dto.MovieDetailDto;
import com.example.demo.dto.MovieSearchResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class OmdbApiService {

    private final WebClient webClient;

    @Value("${omdb.api.url:http://www.omdbapi.com/}")
    private String omdbApiUrl;

    @Value("${omdb.api.key:30ba7fc1}")
    private String omdbApiKey;

    public OmdbApiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Mono<MovieSearchResponseDto> searchMovies(String searchText) {
        return webClient.get()
                .uri(omdbApiUrl + "?apikey={apiKey}&s={searchText}", omdbApiKey, searchText)
                .retrieve()
                .bodyToMono(MovieSearchResponseDto.class);
    }

    public Mono<MovieDetailDto> getMovieById(String imdbId) {
        return webClient.get()
                .uri(omdbApiUrl + "?apikey={apiKey}&i={imdbId}", omdbApiKey, imdbId)
                .retrieve()
                .bodyToMono(MovieDetailDto.class);
    }
}