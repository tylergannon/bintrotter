<script lang="ts">
	import YtsGrid from '$lib/components/site/movies/YTSGrid.svelte';
	import type { PageServerData } from './$types';

	let { data } = $props<{ data: PageServerData }>();
	$inspect(data);
</script>
<YtsGrid yts={data.yts} movieData={data.moreData} />
