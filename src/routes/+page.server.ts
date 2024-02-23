import { search } from '$lib/yts';
import type { PageServerLoad } from './$types';
import { getMovieData } from '$lib/integration/omdb';
export const load: PageServerLoad = async ({ fetch }) => {
	const yts = await search({
		fetch,
		orderBy: 'featured'
	}).then(all => all.map(({url, ...rest})=>({...rest, ytsId: url.split("/").pop()!})))

	const movieData = await Promise.all(yts.map(({ title }) => getMovieData(title, fetch)));

	console.log(yts);
	return { yts, movieData };
};
