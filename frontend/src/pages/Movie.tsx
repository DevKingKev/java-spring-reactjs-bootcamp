import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchMovieDetail,
  clearSelectedMovie,
} from "../store/slices/movieSlice";
import MovieDetails from "../components/MovieDetails";

const Movie: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedMovie, isLoadingDetail, error } = useAppSelector(
    (state) => state.movies
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetail(id));
    } else {
      // Redirect to search if no ID provided
      navigate("/search");
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearSelectedMovie());
    };
  }, [id, dispatch, navigate]);

  return (
    <div className="movie-page">
      {error && (
        <div className="error-message">
          ❌ {error}
          <button
            onClick={() => navigate("/search")}
            className="back-to-search-btn">
            ← Back to Search
          </button>
        </div>
      )}

      {isLoadingDetail && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading movie details...</p>
        </div>
      )}

      {!isLoadingDetail && !error && selectedMovie && (
        <>
          <div className="movie-navigation">
            <button onClick={() => navigate(-1)} className="back-button">
              ← Back
            </button>
          </div>
          <MovieDetails movie={selectedMovie} />
        </>
      )}

      {!isLoadingDetail && !error && !selectedMovie && id && (
        <div className="no-movie-found">
          <h2>Movie not found</h2>
          <p>The movie with ID "{id}" could not be found.</p>
          <button
            onClick={() => navigate("/search")}
            className="back-to-search-btn">
            ← Back to Search
          </button>
        </div>
      )}
    </div>
  );
};

export default Movie;
