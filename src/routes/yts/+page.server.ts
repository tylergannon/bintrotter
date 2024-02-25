import { fetchOmdb } from '$lib/integration/omdb.js';
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

		const searchResponse = await getItemFromKv(
			`movie-query:${query}`,
			platform,
			() =>
				search({
					fetch,
					orderBy: order === '' ? 'latest' : order,
					query: query === '' ? undefined : query
				}),
			3600,
			3600
		);

		const results = searchResponse.ok ? searchResponse.torrents : [];

		const movieData = await Promise.all(
			results.map(({ title, year }) =>
				getItemFromKv(
					`movie-title-${title}`,
					platform,
					() => fetchOmdb(fetch, title, 'movie', year),
					10000
				)
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
