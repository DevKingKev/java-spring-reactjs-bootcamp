package com.example.demo.repository;

import com.example.demo.entity.SearchQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SearchQueryRepository extends JpaRepository<SearchQuery, Long> {

    @Query("SELECT sq FROM SearchQuery sq LEFT JOIN FETCH sq.searchResults sr LEFT JOIN FETCH sr.movie WHERE sq.searchText = :searchText")
    Optional<SearchQuery> findBySearchTextWithResults(@Param("searchText") String searchText);
}