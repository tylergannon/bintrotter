<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { MovieData, OmdbSearchResult, Result } from '$lib/integration/types';
	import PosterImage from './PosterImage.svelte';

	interface Props {
		title: string;
		ytsId: string;
		imageMd: string;
		movieData: Promise<Result<MovieData>>;
	}

	let { title, ytsId, movieData, imageMd } = $props<Props>();

	let actors = $state(''),
		plot = $state('');
	movieData.then((data) => {
		if (data.ok) {
			actors = data.Actors;
			plot = data.Plot;
		}
	});

	$inspect(movieData);
</script>

<a href="/yts/{ytsId}">
	<Card.Root class="grid grid-cols-2">
		<Card.Header class="col-span-2 mb-4 border-b-2">
			<Card.Title class="lg:text-2xl">{title}</Card.Title>
		</Card.Header>
		<Card.Content class="col-span-2">
			<PosterImage src={imageMd} alt="{title} Poster" />
		</Card.Content>
		<Card.Footer class="col-span-2 grid grid-cols-1 gap-4 divide-y-2 h-40">
			<p class="font-bold min-h-6">{actors}</p>
			<p class="overflow-clip my-4 pb-2">{plot}</p>
		</Card.Footer>
	</Card.Root>
</a>
