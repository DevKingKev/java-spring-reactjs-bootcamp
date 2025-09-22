package com.example.demo.service;

import com.example.demo.dto.MovieDetailDto;
import com.example.demo.dto.MovieListItemDto;
import com.example.demo.dto.MovieSearchResponseDto;
import com.example.demo.entity.Movie;
import com.example.demo.entity.SearchQuery;
import com.example.demo.entity.SearchResult;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.SearchQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private SearchQueryRepository searchQueryRepository;

    @Autowired
    private OmdbApiService omdbApiService;

    public MovieSearchResponseDto searchMovies(String searchText) {
        // Check if we have cached results
        Optional<SearchQuery> cachedQuery = searchQueryRepository.findBySearchTextWithResults(searchText);

        if (cachedQuery.isPresent()) {
            // Return cached results
            return buildResponseFromCache(cachedQuery.get());
        }

        // Fetch from external API
        MovieSearchResponseDto response = omdbApiService.searchMovies(searchText).block();

        if (response != null && "True".equals(response.getResponse())) {
            // Cache the results
            cacheSearchResults(searchText, response);
        }

        return response;
    }

    public MovieDetailDto getMovieById(String imdbId) {
        // Check if we have cached movie details
        Optional<Movie> cachedMovie = movieRepository.findById(imdbId);

        if (cachedMovie.isPresent() && cachedMovie.get().getPlot() != null) {
            // Return cached movie details
            return convertToDetailDto(cachedMovie.get());
        }

        // Fetch from external API
        MovieDetailDto response = omdbApiService.getMovieById(imdbId).block();

        if (response != null && "True".equals(response.getResponse())) {
            // Cache/Update the movie details
            cacheMovieDetails(response);
        }

        return response;
    }

    private MovieSearchResponseDto buildResponseFromCache(SearchQuery searchQuery) {
        List<MovieListItemDto> movieList = new ArrayList<>();

        for (SearchResult result : searchQuery.getSearchResults()) {
            Movie movie = result.getMovie();
            movieList.add(new MovieListItemDto(
                    movie.getTitle(),
                    movie.getYear(),
                    movie.getImdbID(),
                    movie.getType(),
                    movie.getPoster()));
        }

        return new MovieSearchResponseDto(
                movieList,
                searchQuery.getTotalResults(),
                searchQuery.getResponse() ? "True" : "False");
    }

    private void cacheSearchResults(String searchText, MovieSearchResponseDto response) {
        SearchQuery searchQuery = new SearchQuery(searchText, response.getTotalResults(), true);
        searchQuery = searchQueryRepository.save(searchQuery);

        List<SearchResult> searchResults = new ArrayList<>();

        if (response.getSearch() != null) {
            for (MovieListItemDto movieItem : response.getSearch()) {
                // Validate required fields before saving
                if (movieItem.getImdbID() == null || movieItem.getImdbID().trim().isEmpty() ||
                        movieItem.getTitle() == null || movieItem.getTitle().trim().isEmpty()) {
                    continue; // Skip invalid movies
                }

                // Save or update movie
                Movie movie = movieRepository.findById(movieItem.getImdbID())
                        .orElse(new Movie());

                movie.setImdbID(movieItem.getImdbID().trim());
                movie.setTitle(movieItem.getTitle().trim());
                movie.setYear(movieItem.getYear() != null ? movieItem.getYear().trim() : "N/A");
                movie.setType(movieItem.getType());
                movie.setPoster(movieItem.getPoster() != null ? movieItem.getPoster().trim() : "");

                movie = movieRepository.save(movie);

                // Create search result
                SearchResult searchResult = new SearchResult(searchQuery, movie);
                searchResults.add(searchResult);
            }
        }

        searchQuery.setSearchResults(searchResults);
        searchQueryRepository.save(searchQuery);
    }

    private void cacheMovieDetails(MovieDetailDto movieDetail) {
        // Validate required fields
        if (movieDetail.getImdbID() == null || movieDetail.getImdbID().trim().isEmpty() ||
                movieDetail.getTitle() == null || movieDetail.getTitle().trim().isEmpty()) {
            return; // Don't cache invalid movies
        }

        Movie movie = movieRepository.findById(movieDetail.getImdbID())
                .orElse(new Movie());

        movie.setImdbID(movieDetail.getImdbID().trim());
        movie.setTitle(movieDetail.getTitle().trim());
        movie.setYear(movieDetail.getYear() != null ? movieDetail.getYear().trim() : "N/A");
        movie.setType(movieDetail.getType());
        movie.setPoster(movieDetail.getPoster() != null ? movieDetail.getPoster().trim() : "");
        movie.setPlot(movieDetail.getPlot() != null ? movieDetail.getPlot().trim() : "");
        movie.setDirector(movieDetail.getDirector() != null ? movieDetail.getDirector().trim() : "");
        movie.setActors(movieDetail.getActors() != null ? movieDetail.getActors().trim() : "");
        movie.setRuntime(movieDetail.getRuntime() != null ? movieDetail.getRuntime().trim() : "");
        movie.setGenre(movieDetail.getGenre() != null ? movieDetail.getGenre().trim() : "");
        movie.setImdbRating(movieDetail.getImdbRating() != null ? movieDetail.getImdbRating().trim() : "");

        movieRepository.save(movie);
    }

    private MovieDetailDto convertToDetailDto(Movie movie) {
        MovieDetailDto dto = new MovieDetailDto();
        dto.setTitle(movie.getTitle());
        dto.setYear(movie.getYear());
        dto.setImdbID(movie.getImdbID());
        dto.setType(movie.getType());
        dto.setPoster(movie.getPoster());
        dto.setPlot(movie.getPlot());
        dto.setDirector(movie.getDirector());
        dto.setActors(movie.getActors());
        dto.setRuntime(movie.getRuntime());
        dto.setGenre(movie.getGenre());
        dto.setImdbRating(movie.getImdbRating());
        dto.setResponse("True");
        return dto;
    }
}