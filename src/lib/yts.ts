import { type HTMLElement, parse } from 'node-html-parser';
import type { Result } from './integration/types';

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
const findContent: string = '.browse-content .browse-movie-wrap';

// <div class="browse-movie-wrap col-xs-10 col-sm-5">
// 	<a href="https://yts.mx/movies/out-of-darkness-2022" class="browse-movie-link">
// 		<figure>
// 			<img class="img-responsive"
// 				src="/assets/images/movies/out_of_darkness_2022/medium-cover.jpg"
// 				alt="Out of Darkness (2022) download" width="210" height="315" />
// 			<figcaption class="hidden-xs hidden-sm">
// 				<span class="icon-star"></span>
// 				<h4 class="rating">6.2 / 10</h4>
// 				<h4>Horror</h4>
// 				<h4>Thriller</h4>
// 				<span class="button-green-download2-big">View Details</span>
// 			</figcaption>
// 		</figure>
// 	</a>
// 	<div class="browse-movie-bottom">
// 		<a href="https://yts.mx/movies/out-of-darkness-2022" class="browse-movie-title">Out of
// 			Darkness</a>
// 		<div class="browse-movie-year">2022</div>
// 	</div>
// </div>

export type YifySummary = {
	title: string;
	ytsId: string;
	year: string;
	imageMd: string;
};

function getSummary(el: HTMLElement): YifySummary {
	const aTag = el.querySelector('a.browse-movie-title')!;
	const divTag = el.querySelector('div.browse-movie-year')!;
	const imageMd = el.querySelector('img.img-responsive')!.attributes['src'];
	return {
		title: aTag.text,
		ytsId: aTag.attributes['href'].split('/').pop()!,
		year: divTag.text,
		imageMd
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

export async function search(params: YIFYSearch): Promise<Result<{ torrents: YifySummary[] }>> {
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

	if (!parser.ok) {
		console.error(parser.error);
		console.error('Yify search, params:', params);
		return parser;
	}
	const torrents = parser.el.querySelectorAll(findContent).map(getSummary);
	return { ok: true, torrents };
}

type YtsDetail = {
	movieId: string;
	title: string;
	year: string;
	imageMd: string;
	modalQuality: string[];
	movieData: Promise<YIFYApiResponse['data']['movie']>;
}

export async function ytsDetail(
	movieSlug: string,
	fetch: Fetch
): Promise<Result<YtsDetail>> {
	const getHtmlDoc = await doRequest(`/movies/${movieSlug}`, fetch);
	if (!getHtmlDoc.ok) {
		return getHtmlDoc
	}
	
	const imageMd = getHtmlDoc.el.querySelector('#movie-poster > img')!.attributes['src'];

	const el = getHtmlDoc.el.querySelector('[data-movie-id]')!;
	const movieId = el.getAttribute('data-movie-id') as string;
	const title = el.querySelector(".hidden-xs h1")?.text ?? '';
	const year = el.querySelector(".hidden-xs h2")?.text ?? '';
	const modalQuality = getHtmlDoc.el.querySelectorAll(".modal-quality").map(it => it.querySelector('span')!.text)

	const movieData: Promise<YIFYApiResponse['data']['movie']> = fetch(
		`https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}`
	).then((r) => r.json().then(it => (it as YIFYApiResponse).data.movie));

	return {
		ok: true,
		movieId,
		title,
		year,
		imageMd,
		modalQuality,
		movieData
	}
}

async function doRequest(path: string, fetch: Fetch) : Promise<Result<{el: HTMLElement;}>> {
	const url = baseUrl + path;
	console.debug(url);
	const response = await fetch(url);
	if (response.status !== 200) {
		return { ok: false, error: response.statusText }
	}
	return {ok: true, el: parse(await response.text())};
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
