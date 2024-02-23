import { type HTMLElement, parse } from 'node-html-parser';

interface YIFYTorrent {
	title: string;
	url: string;
	year: string;
	magnet: string;
	size: string;
	quality: string;
	resolution: string;
}

type Fetch = typeof fetch;

const baseUrl: string = 'https://yts.mx';
const findPopular: string = '#popular-downloads .browse-movie-wrap .browse-movie-bottom';
const findContent: string = '.browse-content .browse-movie-wrap .browse-movie-bottom';

function getSummary(el: HTMLElement): Pick<YIFYTorrent, 'title' | 'url' | 'year'> {
	const aTag = el.querySelector('a');
	const divTag = el.querySelector('div');
	return {
		title: aTag?.text || '',
		url: aTag?.attributes['href'] || '',
		year: divTag?.text || ''
	};
}

interface YIFYSearch {
	fetch: typeof fetch;
	query?: string;
	page?: number;
	year?: number | [number, number];
	orderBy?:
		| 'latest'
		| 'oldest'
		| 'featured'
		| 'seeds'
		| 'peers'
		| 'year'
		| 'rating'
		| 'likes'
		| 'rt_audience'
		| 'alphabetical'
		| 'downloads';
}

export async function search(params: YIFYSearch) {
	const q = encodeURI(params.query || '0');
	const yearStr = params.year
		? Array.isArray(params.year)
			? `${params.year[0]}-${params.year[1]}`
			: `${params.year}`
		: '0';
	const pageStr = params.page && params.page > 1 ? `page=${params.page}` : '';
	const parser = await doRequest(
		`/browse-movies/${q}/all/all/0/${params.orderBy || 'latest'}/${yearStr}/en?${pageStr}`,
		params.fetch
	);
	return parser
		.querySelectorAll(findContent)
		.map(getSummary)
		.map(({ url, ...rest }) => ({ ...rest, ytsId: url.split('/').pop()! }));
}

export async function ytsDetail(movieSlug: string, fetch: Fetch) {
	const parser = await doRequest(`/movies/${movieSlug}`, fetch);
	const el = parser.querySelector('#movie-info');
	const movieId = el?.getAttribute('data-movie-id') as string;
	const res = await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}`);
	const movieData = (await res.json()) as YIFYApiResponse;
	return movieData.data.movie;
}

async function doRequest(path: string, fetch: Fetch) {
	const url = baseUrl + path;
	console.debug(url);
	const response = await fetch(url);
	if (response.status !== 200) {
		throw new Error('Got the wrong status.');
	}
	return parse(await response.text());
}

interface YIFYApiResponse {
	status: string;
	status_message: string;
	data: {
		movie: {
			id: number;
			url: string;
			imdb_code: string;
			title: string;
			title_english: string;
			title_long: string;
			slug: string;
			year: number;
			rating: number;
			runtime: number;
			genres: string[];
			like_count: number;
			description_intro: string;
			description_full: string;
			yt_trailer_code: string;
			language: string;
			mpa_rating: string;
			background_image: string;
			background_image_original: string;
			small_cover_image: string;
			medium_cover_image: string;
			large_cover_image: string;
			torrents: {
				url: string;
				hash: string;
				quality: string;
				type: string;
				is_repack: string;
				video_codec: string;
				bit_depth: string;
				audio_channels: string;
				seeds: number;
				peers: number;
				size: string;
				size_bytes: number;
				date_uploaded: string;
				date_uploaded_unix: number;
			}[];
		};
		date_uploaded: string;
		date_uploaded_unix: number;
	};
	meta: {
		server_time: number;
		server_timezone: string;
		api_version: number;
		execution_time: string;
	};
}
