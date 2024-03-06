import { search, type YifySummary } from '$lib/yts';
import type { PageServerLoad } from './$types';
import { fetchOmdb } from '$lib/integration/omdb';
import { getItemFromKv } from '$lib/kv';
import type { MovieData, Result } from '$lib/integration/types';
import { error } from '@sveltejs/kit';

const ONE_DAY = 3600 * 24;

const getYts = () => search({ fetch, orderBy: 'featured' });

export const load: PageServerLoad = async ({
	fetch,
	platform
}): Promise<{yts: YifySummary[], moreData: Promise<Result<MovieData>[]>}> => {
	const yts = await getItemFromKv('yts-homepage', platform, getYts, 7200, 60);

	if (yts.ok === false) {
		error(500, yts.error)
	}

	const moreData = Promise.all(
		yts.torrents.map((torrent) =>
			getItemFromKv(
				`movie-title-${torrent.title}`,
				platform,
				() => fetchOmdb(fetch, torrent.title, 'movie', torrent.year),
				ONE_DAY,
				3600
			)
		)
	);

	return { yts: yts.torrents, moreData };
};
