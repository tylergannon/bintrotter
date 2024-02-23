<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { OmdbSearchResult } from '$lib/integration/types';
	import trackers from '$lib/trackers.json';
	import PosterImage from './PosterImage.svelte';

	interface Props {
		info_hash: string;
		name: string;
		leechers: string;
		seeders: string;
		num_files: string;
		size: string;
		movieData: OmdbSearchResult | undefined;
	}

	let { info_hash, name, leechers, seeders, size, movieData } = $props<Props>();
	let imageSrc = $derived(movieData && movieData.ok ? movieData.Poster : undefined);

	function magnetLink(hash: string, torrentName: string): string {
		return `magnet:?xt=urn:btih:${hash}&dn=${torrentName}&${trackers}`;
	}
</script>

<a href={magnetLink(info_hash, name)}>
	<Card.Root class="grid grid-cols-2">
		<Card.Header class="col-span-2 mb-4 border-b-2">
			<Card.Title
				>{movieData && movieData.ok ? movieData.Title : name} ({seeders}/{leechers})</Card.Title
			>
		</Card.Header>
		{#if movieData && movieData.ok}
			<Card.Content class="col-span-2 grid grid-cols-1 gap-4 divide-y-2">
				<p class="font-bold">{movieData.Actors}</p>
				<p>{movieData.Plot}</p>
			</Card.Content>
			<Card.Footer class="col-span-2">
				<PosterImage src={movieData.Poster} alt="{movieData.Title} Poster" />
			</Card.Footer>
		{/if}
	</Card.Root>
</a>
