package com.example.demo.controller;

import com.example.demo.dto.MovieDetailDto;
import com.example.demo.dto.MovieSearchResponseDto;
import com.example.demo.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/search")
    public ResponseEntity<MovieSearchResponseDto> searchMovies(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            MovieSearchResponseDto response = movieService.searchMovies(q.trim());

            if (response != null) {
                return ResponseEntity.ok(response);
            } else {
                // Return empty response when API fails
                MovieSearchResponseDto emptyResponse = new MovieSearchResponseDto();
                emptyResponse.setResponse("False");
                return ResponseEntity.ok(emptyResponse);
            }
        } catch (Exception e) {
            // Log error and return empty response
            e.printStackTrace();
            MovieSearchResponseDto errorResponse = new MovieSearchResponseDto();
            errorResponse.setResponse("False");
            return ResponseEntity.ok(errorResponse);
        }
    }

    @GetMapping("/{imdbId}")
    public ResponseEntity<MovieDetailDto> getMovieById(@PathVariable String imdbId) {
        if (imdbId == null || imdbId.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            MovieDetailDto response = movieService.getMovieById(imdbId.trim());

            if (response != null && "True".equals(response.getResponse())) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            // Log error and return not found
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}