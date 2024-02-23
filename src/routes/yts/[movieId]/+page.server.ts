import { getItemFromKv } from '$lib/kv.js';
import { ytsDetail } from '$lib/yts.js';

export async function load({ params, platform, fetch }) {
	const ytsData = await getItemFromKv(
		`yts-detail-${params.movieId}`,
		platform?.env?.TROTTERBIN_KV,
		() => ytsDetail(params.movieId, fetch),
		7200
	);
	return { ytsData };
}
