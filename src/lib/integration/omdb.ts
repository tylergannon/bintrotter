import { OMDB_API_KEY } from '$env/static/private';
import type { FetchFunction } from 'vite';
import type {
	EpisodeDetail,
	MovieData,
	OmdbError,
	OmdbSearchResult,
	Result,
	SeasonDetail,
	SeriesDetail,
	SuccessResult
} from './types';

function component(name: string, value: string) {
	return `${name}=${encodeURIComponent(value)}`;
}
type MediaQuery = 'movie' | 'series' | 'season' | 'episode';
type MediaQueryResult<T extends MediaQuery> = T extends 'movie'
	? MovieData
	: T extends 'series'
		? SeriesDetail
		: T extends 'season'
			? SeasonDetail
			: EpisodeDetail;

type Fetch = typeof fetch;

export async function fetchOmdb<T extends MediaQuery>(
	fetch: Fetch,
	query: string,
	type: T,
	year: string = '',
	season: string = '',
	episode: string = ''
): Promise<Result<MediaQueryResult<T>>> {
	const parts = [component('t', query)];
	if (year) parts.push(component('y', year));
	if (type === 'episode') {
		parts.push(component('Episode', episode));
		parts.push(component('Season', season));
	} else if (type === 'season') {
		parts.push(component('Season', season));
	}

	const url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&type=${type}&${parts.join('&')}`;

	const response = await fetch(url);
	const omdbResponse = (await response.json()) as MediaQueryResult<T> | OmdbError;
	if (omdbResponse.Response === 'True') {
		return { ok: true, ...omdbResponse } as SuccessResult<MediaQueryResult<T>>;
	}
	return { ok: false, error: omdbResponse.Error };
}

const THE_DARK_TOWER = {
	Title: 'The Dark Tower',
	Year: '2017',
	Rated: 'PG-13',
	Released: '04 Aug 2017',
	Runtime: '95 min',
	Genre: 'Action, Adventure, Fantasy',
	Director: 'Nikolaj Arcel',
	Writer: 'Akiva Goldsman, Jeff Pinkner, Anders Thomas Jensen',
	Actors: 'Idris Elba, Matthew McConaughey, Tom Taylor',
	Plot: "A boy haunted by visions of a dark tower from a parallel reality teams up with the tower's disillusioned guardian to stop an evil warlock known as the Man in Black who plans to use the boy to destroy the tower and open the gates o...",
	Language: 'English',
	Country: 'United States',
	Awards: '4 nominations',
	Poster:
		'https://m.media-amazon.com/images/M/MV5BMTU3MjUwMzQ3MF5BMl5BanBnXkFtZTgwMjcwNjkxMjI@._V1_SX300.jpg',
	Ratings: [
		{ Source: 'Internet Movie Database', Value: '5.6/10' },
		{ Source: 'Rotten Tomatoes', Value: '15%' },
		{ Source: 'Metacritic', Value: '34/100' }
	],
	Metascore: '34',
	imdbRating: '5.6',
	imdbVotes: '144,946',
	imdbID: 'tt1648190',
	Type: 'movie',
	DVD: '17 Oct 2017',
	BoxOffice: '$50,701,325',
	Production: 'N/A',
	Website: 'N/A',
	ok: true
} as OmdbSearchResult;
