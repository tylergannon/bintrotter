import { getMovieData } from '$lib/integration/omdb.js';
import { getItemFromKv } from '$lib/kv.js';
import { search } from '$lib/yts.js';

type OrderByFormField =
	| 'year'
	| 'latest'
	| 'oldest'
	| 'featured'
	| 'seeds'
	| 'peers'
	| 'rating'
	| 'likes'
	| 'rt_audience'
	| 'alphabetical'
	| 'downloads'
	| '';

export const actions = {
	default: async ({ fetch, platform, request }) => {
		const formData = await request.formData();
		const query = formData.get('query') as string;
		const order = formData.get('order') as OrderByFormField;

		const results = await getItemFromKv(
			`movie-query:${query}`,
			platform,
			() =>
				search({
					fetch,
					orderBy: order === '' ? 'latest' : order,
					query: query === '' ? undefined : query
				}),
			3600
		);

		const movieData = await Promise.all(
			results.map(({ title }) =>
				getItemFromKv(`movie-title-${title}`, platform, () => getMovieData(title, fetch), 10000)
			)
		);

		return {
			results,
			movieData,
			query,
			order
		};
	}
};
