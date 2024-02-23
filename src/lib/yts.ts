import { HTMLElement, parse } from 'node-html-parser';

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

function getSummary(el: HTMLElement): Pick<YIFYTorrent, "title" | "url" | "year"> {
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
    orderBy?: "latest" | "oldest" | "featured" | "seeds" | "peers" | "year" | "rating" | "likes" | "rt_audience" | "alphabetical" | "downloads";
}

export async function search(params: YIFYSearch) {
    const q = encodeURI(params.query || '0');
    const yearStr = params.year ? (Array.isArray(params.year) ? `${params.year[0]}-${params.year[1]}` : `${params.year}`) : '0';
    const pageStr = (params.page && params.page > 1) ? `page=${params.page}` : '';
    const parser = await doRequest(`/browse-movies/${q}/all/all/0/${params.orderBy || 'latest'}/${yearStr}/en?${pageStr}`, params.fetch);
    return parser.querySelectorAll(findContent).map(getSummary);
}

export async function ytsDetail(movieSlug: string, fetch: Fetch) {
    const parser = await doRequest(`/movies/${movieSlug}`, fetch);
    const el = parser.querySelector("#movie-info");
    const movieId = el?.getAttribute("data-movie-id") as string;
    const res = await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}`);
    const movieData = await res.json() as YIFYApiResponse;
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

export const trackers = `udp://tracker.opentrackr.org:1337/announce
udp://open.tracker.cl:1337/announce
udp://tracker.auctor.tv:6969/announce
udp://open.demonii.com:1337/announce
udp://open.stealth.si:80/announce
udp://tracker.torrent.eu.org:451/announce
udp://tracker.moeking.me:6969/announce
udp://explodie.org:6969/announce
udp://tracker1.bt.moack.co.kr:80/announce
udp://movies.zsw.ca:6969/announce
udp://exodus.desync.com:6969/announce
https://tracker.tamersunion.org:443/announce
udp://tracker2.dler.org:80/announce
udp://tracker.theoks.net:6969/announce
udp://tracker.skyts.net:6969/announce
udp://tracker-udp.gbitt.info:80/announce
udp://retracker01-msk-virt.corbina.net:80/announce
udp://opentracker.io:6969/announce
udp://open.free-tracker.ga:6969/announce
udp://new-line.net:6969/announce
https://tracker.gbitt.info:443/announce
http://open.acgnxtracker.com:80/announce
udp://tracker1.myporn.club:9337/announce
udp://tracker.tiny-vps.com:6969/announce
udp://tracker.therarbg.to:6969/announce
udp://tracker.qu.ax:6969/announce
udp://tracker.filemail.com:6969/announce
udp://tracker.cubonegro.lol:6969/announce
udp://tracker.0x7c0.com:6969/announce
udp://tamas3.ynh.fr:6969/announce
udp://ryjer.com:6969/announce
udp://p4p.arenabg.com:1337/announce
udp://open.dstud.io:6969/announce
udp://oh.fuuuuuck.com:6969/announce
udp://moonburrow.club:6969/announce
udp://bt2.archive.org:6969/announce
udp://bt1.archive.org:6969/announce
udp://bt.ktrackers.com:6666/announce
udp://6ahddutb1ucc3cp.ru:6969/announce
https://tracker.renfei.net:443/announce
https://tracker.loligirl.cn:443/announce
https://tracker.imgoingto.icu:443/announce
http://tracker.files.fm:6969/announce
http://open.acgtracker.com:1096/announce
udp://wepzone.net:6969/announce
udp://tracker.tryhackx.org:6969/announce
udp://tracker.therarbg.com:6969/announce
udp://tracker.srv00.com:6969/announce
udp://tracker.fnix.net:6969/announce
udp://tracker.edkj.club:6969/announce
udp://su-data.com:6969/announce
udp://open.xxtor.com:3074/announce
udp://open.u-p.pw:6969/announce
udp://free.publictracker.xyz:6969/announce
udp://epider.me:6969/announce
udp://6.pocketnet.app:6969/announce
udp://1c.premierzal.ru:6969/announce
https://yolo.liberbear.com:443/announce
https://www.peckservers.com:9443/announce
https://tracker.yemekyedim.com:443/announce
https://tracker.lilithraws.org:443/announce
https://tracker.ipfsscan.io:443/announce
https://tracker.gcrreen.xyz:443/announce
https://tracker.cloudit.top:443/announce
https://tr.burnabyhighstar.com:443/announce
https://t1.hloli.org:443/announce
http://tracker.mywaifu.best:6969/announce
http://tracker.bt4g.com:2095/announce
http://t.overflow.biz:6969/announce
http://ch3oh.ru:6969/announce
http://bvarf.tracker.sh:2086/announce
udp://tracker.ddunlimited.net:6969/announce
udp://tracker.artixlinux.org:6969/announce
udp://tracker.anima.nz:6969/announce
udp://torrents.artixlinux.org:6969/announce
udp://pirate.t-1.org:1337/announce
udp://mail.artixlinux.org:6969/announce
udp://ipv4.rer.lol:2710/announce
udp://fh2.cmp-gaming.com:6969/announce
udp://evan.im:6969/announce
udp://concen.org:6969/announce
udp://bittorrent-tracker.e-n-c-r-y-p-t.net:1337/announce
udp://aegir.sexy:6969/announce
http://tracker1.itzmx.com:8080/announce`.replaceAll("\n", "&");
