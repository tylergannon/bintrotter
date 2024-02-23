<script lang="ts">
	let { data } = $props();
	import { MagnetIcon } from 'lucide-svelte';
	import { trackers } from '$lib/yts.js';
    import Separator from '$lib/components/ui/separator/separator.svelte';

	const {
		large_cover_image,
		medium_cover_image,
		small_cover_image,
		description_full,
		torrents,
		url,
		runtime,
		title,
		year,
		slug,
		id
	} = data.ytsData;

	function magnetLink(torrent: (typeof torrents)[number]): string {
		const torrentName = encodeURIComponent(
			`${title} [${torrent.size}] [${torrent.quality}] [${torrent.video_codec}]`
		);
		return `magnet:?xt=urn:btih:${torrent.hash}&dn=${torrentName}&${trackers}`;
	}
</script>

<div class="container flex-1 items-start border md:grid md:grid-cols-2 md:gap-6 lg:gap-10">
	<div class="container">
		<h1 class="scroll-m-20 pt-1 md:pt-4 text-4xl font-extrabold tracking-tight lg:text-5xl">{title} ({year})</h1>
        <Separator class="my-1 md:my-4" />
		<p class="leading-7 [&:not(:first-child)]:mt-6">{description_full}</p>
        <Separator class="my-1 md:my-4" />
		<ul>
			{#each torrents as torrent, id}
				<li>
					<a href={magnetLink(torrent)} class="flex flex-row hover:font-extrabold">
						<MagnetIcon size={36} />
						{torrent.quality} ({torrent.size} / {torrent.video_codec})
					</a>
				</li>
			{/each}
		</ul>
	</div>
	<img src={large_cover_image} alt="large cover image" />
</div>
