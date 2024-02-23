import type { RequestHandler } from './$types';
import { getMovieData } from '$lib/integration/omdb';
export const GET: RequestHandler = async ({ params: { movieTitle }, fetch }) => {
	const movieData = await getMovieData(movieTitle, fetch);
	return new Response(JSON.stringify(movieData));
};
