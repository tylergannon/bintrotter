import type { Result } from '$lib/integration/types.js';
import { getItemFromKv } from '$lib/kv.js';

export type MediaType = 'any' | 'movie' | 'series' | 'season' | 'episode' | 'audiobook';

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

/**
 * Unused. This is just translated from https://github.com/vikstrous/pirate-get/blob/master/pirate/torrent.py
 * but right now we're only using the basic search API call.
 * @param mode
 * @param page
 * @param category
 * @param terms
 * @returns
 */
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

/**
 * Really not sure if any of these actually work.
 */
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

function getOptionalStr(form: FormData, name: string) {
	return (form.get(name) ?? '') as string;
}

const tpbCategory: Record<MediaType, string | null> = {
	any: null,
	audiobook: '102',
	episode: '205',
	movie: '201',
	season: '205',
	series: '205'
};
function padNum(s: string) {
	return s.padStart(2, '0');
}
async function tpbFetch(q: string, cat: string): Promise<TpbTorrentInfo[]> {
	try {
		const res = await fetch(
			`https://apibay.org/q.php?q=${encodeURIComponent(q)}&cat=${cat === '' ? '0' : cat}`
		);
		return (await res.json()) as TpbTorrentInfo[];
	} catch (error) {
		console.error(error);
		return [];
	}
}
async function tpbQuery(
	query: string,
	year: string,
	quality: string,
	episode: string,
	season: string,
	category: string
): Promise<Result<{ torrents: TpbTorrentInfo[] }>> {
	const seriesStr = episode
		? [`s${padNum(season)}e${padNum(episode)}`]
		: season
			? [`season ${padNum(season)}`, `s${padNum(season)}`]
			: [''];

	try {
		const torrents = await Promise.all(
			seriesStr.map((str) => tpbFetch(`${query} ${year} ${quality} ${str}`, category))
		).then((res) =>
			res
				.flatMap((a) => a)
				.sort((a, b) => (parseInt(a.seeders) > parseInt(b.seeders) ? -1 : 1))
				.slice(0, 30)
		);
		return { ok: true, torrents };
	} catch (e) {
		console.error(e);
		return { ok: false, error: `${(e as Error).name}: ${(e as Error).message}` };
	}
}

export const actions = {
	default: async ({ fetch, platform, request }) => {
		const form = await request.formData();
		const query = getOptionalStr(form, 'query');
		const year = getOptionalStr(form, 'year');
		const mediaType = (getOptionalStr(form, 'type') ?? 'any') as MediaType;

		const cat = tpbCategory[mediaType] ?? getOptionalStr(form, 'category');
		const season = getOptionalStr(form, 'season');
		const episode = getOptionalStr(form, 'episode');
		const quality = getOptionalStr(form, 'quality');

		const queryParts = [query];
		if (episode) queryParts.push(`s${padNum(season)}e${padNum(episode)}`);
		else if (season) queryParts.push(`s${padNum(season)}`);

		if (quality) queryParts.push(quality);

		const results = await getItemFromKv(
			`tpb-query:${query}:${year}:${mediaType}:${cat}:${season}:${episode}:${quality}`,
			platform,
			() => tpbQuery(query, year, quality, episode, season, cat),
			300
		);

		// const movieData = await Promise.all(
		// 	results.map(({  }) =>
		// 		imdb === ''
		// 			? undefined
		// 			: getItemFromKv(
		// 					`movie-title-${imdb}`,
		// 					platform,
		// 					() => fetchOmdb(),
		// 					10000
		// 				)
		// 	)
		// );

		return {
			results,
			// movieData,
			mediaType,
			year,
			season,
			episode,
			query,
			cat
		};
	}
};
