<script lang="ts">
	import type { YifySummary } from "$lib/yts";
    import YtsCard from "./YTSCard.svelte";
	import type { MovieData, Result } from "$lib/integration/types";
    interface Props {
        yts: YifySummary[];
        movieData: Promise<Result<MovieData>[]>;
    }

    const {yts, movieData} = $props<Props>();


	const _movieData = yts.map((_, id) => movieData.then(allData => allData[id]))
</script>

<div class="container flex-1 items-start md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-10">
	{#each yts as movie, id}
		<YtsCard {...movie} movieData={_movieData[id]} />
	{/each}
</div>
