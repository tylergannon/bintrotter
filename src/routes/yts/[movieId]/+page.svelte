<script lang="ts">
	let { data } = $props();
	import { MagnetIcon } from 'lucide-svelte';
	import trackers from '$lib/trackers.json';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	const { modalQuality, movieData, imageMd, title, year } = data.ytsData;

	movieData.then(it => console.log(it))

	function magnetLink(torrent: Awaited<typeof movieData>['torrents'][number]): string {
		const torrentName = encodeURIComponent(
			`${title} [${torrent.size}] [${torrent.quality}] [${torrent.video_codec}]`
		);
		return `magnet:?xt=urn:btih:${torrent.hash}&dn=${torrentName}&${trackers}`;
	}
</script>

<div class="container flex-1 items-start border md:grid md:grid-cols-2 md:gap-6 lg:gap-10">
	<div class="container">
		<h1 class="scroll-m-20 pt-1 text-4xl font-extrabold tracking-tight md:pt-4 lg:text-5xl">
			{title} ({year})
		</h1>
		<Separator class="my-1 md:my-4" />
		<ul>
			{#await movieData}
				{#each modalQuality as quality, id}
					<li>
						<MagnetIcon size={36} />
						{quality}
					</li>
				{/each}
			{:then _movieData}
				{#each _movieData.torrents as torrent, id}
					<li>
						<a href={magnetLink(torrent)} class="flex flex-row hover:font-extrabold">
							<MagnetIcon size={36} />
							{torrent.quality} ({torrent.size} / {torrent.video_codec})
						</a>
					</li>
				{/each}
			{/await}
		</ul>
		<Separator class="my-1 md:my-4" />
		<p class="leading-7 [&:not(:first-child)]:mt-6">
			{#await movieData then { description_full }}
				{description_full}
			{/await}
		</p>
	</div>
	{#await movieData}
		<img src={imageMd} width="500" height="750" alt="medium cover" />
	{:then { large_cover_image }}
		<img src={large_cover_image} width="500" height="750" alt="large cover" />
	{/await}
</div>
