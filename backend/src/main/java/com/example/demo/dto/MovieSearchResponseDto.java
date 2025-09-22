package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class MovieSearchResponseDto {
    @JsonProperty("Search")
    private List<MovieListItemDto> search;

    @JsonProperty("totalResults")
    private String totalResults;

    @JsonProperty("Response")
    private String response;

    // Constructors
    public MovieSearchResponseDto() {
    }

    public MovieSearchResponseDto(List<MovieListItemDto> search, String totalResults, String response) {
        this.search = search;
        this.totalResults = totalResults;
        this.response = response;
    }

    // Getters and Setters
    public List<MovieListItemDto> getSearch() {
        return search;
    }

    public void setSearch(List<MovieListItemDto> search) {
        this.search = search;
    }

    public String getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(String totalResults) {
        this.totalResults = totalResults;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
}