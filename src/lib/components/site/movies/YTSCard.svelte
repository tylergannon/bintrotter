<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { OmdbSearchResult } from '$lib/integration/types';
	import PosterImage from './PosterImage.svelte';

	interface Props {
		title: string;
		ytsId: string;
		movieData: OmdbSearchResult;
	}

	let { title, ytsId, movieData } = $props<Props>();
	let imageSrc = $derived(movieData.ok ? movieData.Poster : undefined)
</script>

<a href="/yts/{ytsId}">
	<Card.Root class="grid grid-cols-2">
		<Card.Header class="">
			<Card.Title class="col-span-2">{title}</Card.Title>
		</Card.Header>
		<Card.Content class="col-span-2">
			<p>Card Content</p>
		</Card.Content>
		<Card.Footer class="col-span-2">
			<PosterImage src={imageSrc} alt="{title} Poster" />
		</Card.Footer>
	</Card.Root>
</a>
