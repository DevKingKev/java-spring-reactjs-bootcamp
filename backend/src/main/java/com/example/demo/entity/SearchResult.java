package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "search_results")
public class SearchResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "search_query_id")
    private SearchQuery searchQuery;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imdb_id")
    private Movie movie;

    // Constructors
    public SearchResult() {
    }

    public SearchResult(SearchQuery searchQuery, Movie movie) {
        this.searchQuery = searchQuery;
        this.movie = movie;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SearchQuery getSearchQuery() {
        return searchQuery;
    }

    public void setSearchQuery(SearchQuery searchQuery) {
        this.searchQuery = searchQuery;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }
}