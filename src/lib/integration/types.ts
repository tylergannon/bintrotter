export type Result<T extends {}, ErrorType = string> =
	| ({
			ok: true;
	  } & T)
	| { ok: false; error: ErrorType };

export interface MovieData {
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
	Ratings: { Source: string; Value: string }[];
	Metascore: string;
	imdbRating: string;
	imdbVotes: string;
	imdbID: string;
	Type: 'movie';
	DVD: string;
	BoxOffice: string;
	Production: string;
	Website: string;
	Response: 'True';
}
interface Episode {
	Title: string;
	Released: string;
	Episode: string;
	imdbRating: string;
	imdbID: string;
}

export interface OmdbError {
	Response: 'False';
	Error: string;
}

export interface SeasonDetail {
	Title: string;
	Season: string;
	totalSeasons: string;
	Episodes: Episode[];
	Response: 'True';
}

export interface SeriesDetail {
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
	Ratings: { Source: string; Value: string }[];
	Metascore: string;
	imdbRating: string;
	imdbVotes: string;
	imdbID: string;
	Type: 'series';
	totalSeasons: string;
	Response: 'True';
}

export interface EpisodeDetail {
	Title: string;
	Year: string;
	Rated: string;
	Released: string;
	Season: string;
	Episode: string;
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
	Ratings: { Source: string; Value: string }[];
	Metascore: string;
	imdbRating: string;
	imdbVotes: string;
	imdbID: string;
	seriesID: string;
	Type: 'episode';
	Response: 'True';
}

export type OmdbSearchResult =
	| ({
			ok: true;
	  } & MovieData)
	| {
			ok: false;
			error: string;
	  };
