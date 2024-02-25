import { getItemFromKv } from '$lib/kv.js';
import { ytsDetail } from '$lib/yts.js';
import { error } from '@sveltejs/kit';

export async function load({ params, platform, fetch }) {
	const ytsData = await getItemFromKv(
		`yts-detail-${params.movieId}`,
		platform,
		() => ytsDetail(params.movieId, fetch),
		7200
	);
	if (!ytsData.ok) error(500, ytsData.error);
	return { ytsData };
}
