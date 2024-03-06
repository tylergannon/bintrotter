<script lang="ts">
	import { H1 } from '$lib/components/elements';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { onMount } from 'svelte';
	import type { ActionData, PageData } from './$types';
	import YtsGrid from '$lib/components/site/movies/YTSGrid.svelte';

	let { data } = $props<{ form: ActionData; data: PageData }>();
	const items = [
		{ label: 'Latest', value: 'latest' },
		{ label: 'Oldest', value: 'oldest' },
		{ label: 'Featured', value: 'featured' },
		{ label: 'Seeds', value: 'seeds' },
		{ label: 'Peers', value: 'peers' },
		{ label: 'Year', value: 'year' },
		{ label: 'IMDb Rating', value: 'rating' },
		{ label: 'YTS Likes', value: 'likes' },
		{ label: 'RT Audience', value: 'rt_audience' },
		{ label: 'Alphabetical', value: 'alphabetical' },
		{ label: 'Downloads', value: 'downloads' }
	];
	let query = data.query ?? '';
	let selected = items.find(it => it.value === data.orderBy);

	onMount(() => {
		const input = document.querySelector("form input[name='query']") as HTMLInputElement;
		input.focus();
	});
</script>

<div class="container flex-1 items-start border md:grid md:grid-cols-2 md:gap-6 lg:gap-10">
	<div class="container">
		<H1 class="pb-4">Search for a movie on YTS.</H1>
		<Separator class="mb-4" />

		<form method="GET">
			<label for="query">Search Query</label>
			<Input name="query" value={query} />
			<Select.Root name="order_by" {selected}>
				<Select.Input name="order" />
				<label for="order_by">Order By</label>
				<Select.Trigger class="w-[280px]">
					<Select.Value placeholder="(optional)"></Select.Value>
				</Select.Trigger>
				<Select.Content>
					{#each items as item}
						<Select.Item {...item} />
					{/each}
				</Select.Content>
				<Button variant="default" type="submit">Search</Button>
			</Select.Root>
		</form>
	</div>
</div>

{#if data.results.length}
	<YtsGrid yts={data.results} movieData={data.movieData} />
{/if}
