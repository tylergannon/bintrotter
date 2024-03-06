import { fetchOmdb } from '$lib/integration/omdb.js';
import { getItemFromKv } from '$lib/kv.js';
import { search } from '$lib/yts.js';
import { error } from '@sveltejs/kit';

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
	| undefined;

export async function load({ platform, url }) {
	const queryVal = url.searchParams.get('query');
	const query = queryVal === null ? undefined : queryVal === '' ? undefined : queryVal;
	const orderBy = (url.searchParams.get('order') ?? 'featured') as OrderByFormField;

	const searchResponse = await getItemFromKv(
		`movie-query:${query}`,
		platform,
		() =>
			search({
				fetch,
				orderBy,
				query
			}),
		3600,
		3600
	);
	if (!searchResponse.ok) {
		error(500, searchResponse.error);
	}
	const results = searchResponse.torrents;
	const movieData = Promise.all(
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
		orderBy
	};
}
