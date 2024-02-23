<script lang="ts">
	import YtsCard from '$lib/components/site/movies/YTSCard.svelte';
	import type { PageServerData } from './$types';

	let { data } = $props<{ data: PageServerData }>();
	let { yts, movieData } = $derived(data);
</script>

<div class="container flex-1 items-start md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-10">
	{#each yts as movie, id}
		<YtsCard {...movie} movieData={movieData[id]} />
	{/each}
</div>
