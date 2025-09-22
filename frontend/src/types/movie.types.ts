export type MovieListItemType = 'movie' | 'series' | 'episode' | 'game';

export interface MovieListItem {
    title: string;
    year: string;
    imdbID: string;
    type: MovieListItemType;
    poster: string;
}

export interface MovieDetail {
    title: string;
    year: string;
    imdbID: string;
    type: MovieListItemType;
    poster: string;
    plot?: string;
    director?: string;
    actors?: string;
    runtime?: string;
    genre?: string;
    imdbRating?: string;
    response: string;
}

export interface MovieSearchResponse {
    search: MovieListItem[];
    totalResults: string;
    response: string;
}