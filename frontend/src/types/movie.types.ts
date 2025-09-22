export type MovieListItemType = 'movie' | 'series' | 'episode' | 'game';

export interface MovieListItem {
    Title: string;
    Year: string;
    imdbID: string;
    Type: MovieListItemType;
    Poster: string;
    isFavourite?: boolean;
}
export interface MovieRating {
    Source: string;
    Value: string;
}
export interface MovieDetail {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: MovieRating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: MovieListItemType;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
    isFavourite?: boolean;
}

export interface MovieSearchResponse {
    Search: MovieListItem[];
    totalResults: string;
    Response: string;
}