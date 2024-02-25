<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { MovieData, OmdbSearchResult, Result } from '$lib/integration/types';
	import PosterImage from './PosterImage.svelte';

	interface Props {
		title: string;
		ytsId: string;
		movieData: Result<MovieData>;
	}

	let { title, ytsId, movieData } = $props<Props>();

	let imageSrc = $derived(movieData.ok ? movieData.Poster : undefined);

	$inspect(movieData);
</script>

<a href="/yts/{ytsId}">
	<Card.Root class="grid grid-cols-2">
		<Card.Header class="col-span-2 mb-4 border-b-2">
			<Card.Title>{title}</Card.Title>
		</Card.Header>
		{#if movieData.ok}
			<Card.Content class="col-span-2 grid grid-cols-1 gap-4 divide-y-2">
				<p class="font-bold">{movieData.Actors}</p>
				<p>{movieData.Plot}</p>
			</Card.Content>
		{/if}
		<Card.Footer class="col-span-2">
			<PosterImage src={imageSrc} alt="{title} Poster" />
		</Card.Footer>
	</Card.Root>
</a>
