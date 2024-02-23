import { getMovieData } from '$lib/integration/omdb.js';
import { getItemFromKv } from '$lib/kv.js';

export type TpbTorrentInfo = {
	id: string;
	name: string;
	info_hash: string;
	leechers: string;
	seeders: string;
	num_files: string;
	size: string;
	username: string;
	added: string;
	status: string;
	category: string;
	imdb: string;
};

function buildRequestPath(
	mode: 'search' | 'top' | 'recent' | 'browse',
	page: number,
	category: string,
	terms: string[]
): string {
	let query: string;

	if (mode === 'search') {
		query = `/q.php?q=${terms.join(' ')}&cat=${category}`;
	} else if (mode === 'top') {
		const cat = category === '0' ? 'all' : category;
		query = `/precompiled/data_top100_${cat}.json`;
	} else if (mode === 'recent') {
		query = `/precompiled/data_top100_recent_${page}.json`;
	} else if (mode === 'browse') {
		if (category === '0') {
			throw new Error('You must specify a category');
		}
		query = `/q.php?q=category:${category}`;
	} else {
		throw new Error('Invalid mode ' + mode);
	}

	return encodeURI(query);
}

const mirrors = `https://pirate-proxy.dad
https://tpb30.ukpass.co
https://piratehaven.xyz
https://thepiratebaye.org
https://5mins.eu
https://thepiratebay.cloud
https://thepirateproxy.net
https://t-pb.org
https://tpb-proxy.xyz
https://mirrorbay.top
https://piratebay.army
https://tpb-visit.me
https://knaben.xyz/thepiratebay
https://tpb.re
https://tpb.skynetcloud.site`.split('\n');

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
		const cat = formData.get('category') as string;

		const results = await getItemFromKv(
			`tpb-query:${query}`,
			platform?.env?.TROTTERBIN_KV,
			() =>
				fetch(
					`https://apibay.org/q.php?q=${encodeURIComponent(query)}&cat=${cat === '' ? '0' : cat}`
				)
					.then((res) => res.json() as unknown as Array<TpbTorrentInfo>)
					.catch((err) => {
						console.error(err);
						return [] as TpbTorrentInfo[];
					}),
			300
		);

		const movieData = await Promise.all(
			results.map(({ imdb }) =>
				imdb === "" ? undefined :
				getItemFromKv(
					`movie-title-${imdb}`,
					platform?.env?.TROTTERBIN_KV,
					() => getMovieData(imdb, fetch, "id"),
					10000
				)
			)
		);

		return {
			results,
			movieData,
			query,
			cat
		};
	}
};
