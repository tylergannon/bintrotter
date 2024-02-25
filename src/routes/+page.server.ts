import { search } from '$lib/yts';
import type { PageServerLoad } from './$types';
import { fetchOmdb } from '$lib/integration/omdb';
import { getItemFromKv } from '$lib/kv';
import type { MovieData, Result } from '$lib/integration/types';

const ONE_DAY = 3600 * 24;

const getYts = () => search({ fetch, orderBy: 'featured' });

export const load: PageServerLoad = async ({
	fetch,
	platform
}): Promise<
	Result<{
		torrents: {
			title: string;
			ytsId: string;
			year: string;
			movieData: Result<MovieData>;
		}[];
	}>
> => {
	const yts = await getItemFromKv('yts-homepage', platform, getYts, 7200, 60);

	if (yts.ok === false) {
		return { ok: false, error: yts.error };
	}

	const torrents = await Promise.all(
		yts.torrents.map((torrent) =>
			getItemFromKv(
				`movie-title-${torrent.title}`,
				platform,
				() => fetchOmdb(fetch, torrent.title, 'movie', torrent.year),
				ONE_DAY,
				3600
			).then((movieData) => ({ movieData, ...torrent }))
		)
	);

	for (const torrent of torrents) {
		console.log(torrent.movieData);
	}

	return { ok: true, torrents };
};
