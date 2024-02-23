import { search } from '$lib/yts';
import type { PageServerLoad } from './$types';
import { getMovieData } from '$lib/integration/omdb';
import { getItemFromKv } from '$lib/kv';

const ONE_DAY = 3600 * 24;

const getYts = () => search({ fetch, orderBy: 'featured' });

export const load: PageServerLoad = async ({ fetch, platform }) => {
	const kv = platform?.env?.TROTTERBIN_KV;
	const yts = await getItemFromKv('yts-homepage', kv, getYts, 7200);

	const movieData = await Promise.all(
		yts.map(({ title }) =>
			getItemFromKv(`movie-title-${title}`, kv, () => getMovieData(title, fetch), ONE_DAY)
		)
	);

	return { yts, movieData };
};
