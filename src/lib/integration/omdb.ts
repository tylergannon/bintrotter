import { OMDB_API_KEY } from '$env/static/private';
import type { MovieData, OmdbSearchResult } from './types';
type Fetch = typeof fetch;
import { dev } from '$app/environment';

type OmdbApiResponse = ({ Response: 'True' } & MovieData) | { Response: 'False'; Error: string };

export async function getMovieData(
	query: string,
	fetch: Fetch,
	attr: 'title' | 'id' = 'title'
): Promise<OmdbSearchResult> {
	if (dev) {
		return THE_DARK_TOWER;
	}

	const response = await fetch(
		`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&${attr === "title" ? "t" : "i"}=${encodeURIComponent(query)}`
	);
	if (response.status !== 200) {
		return { ok: false, error: `api response status ${response.status}` };
	}

	const result = (await response.json()) as OmdbApiResponse;
	if (result.Response === 'False') {
		return { ok: false, error: result.Error };
	}
	const { Response, ...data } = result;
	return {
		ok: true,
		...data
	};
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
