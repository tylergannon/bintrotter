<script lang="ts">
	import YtsCard from '$lib/components/site/movies/YTSCard.svelte';
	import type { PageServerData } from './$types';

	let { data } = $props<{ data: PageServerData }>();
	$inspect(data);
</script>

<div class="container flex-1 items-start md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-10">
	{#if data.ok}
	{#each data.torrents as movie, id}
		<YtsCard {...movie} />
	{/each}
	{:else}
		{data.error}
	{/if}
</div>
