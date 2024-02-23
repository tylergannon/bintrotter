<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { H1 } from '$lib/components/elements';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { onMount } from 'svelte';
	import type { ActionData, PageData } from './$types';
	import YtsCard from '$lib/components/site/movies/YTSCard.svelte';

	let { form, data } = $props<{ form: ActionData; data: PageData }>();

	$inspect('Norgle', form, data);

	let query = $state(form?.query);

	onMount(() => {
		const input = document.querySelector("form input[name='query']") as HTMLInputElement;
		input.focus();
	});
</script>

<div class="container flex-1 items-start border md:grid md:grid-cols-2 md:gap-6 lg:gap-10">
	<div class="container">
		<H1 class="pb-4">Search for a movie on YTS.</H1>
		<Separator class="mb-4" />

		<form
			method="POST"
			use:enhance={({}) =>
				async ({ result }) =>
					await applyAction(result)}
		>
			<label for="query">Search Query</label>
			<Input name="query" bind:value={query} />
			<Select.Root name="order_by">
				<Select.Input name="order" />
				<label for="order_by">Order By</label>
				<Select.Trigger class="w-[280px]">
					<Select.Value placeholder="(optional)"></Select.Value>
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="latest">Latest</Select.Item>
					<Select.Item value="oldest">Oldest</Select.Item>
					<Select.Item value="featured">Featured</Select.Item>
					<Select.Item value="seeds">Seeds</Select.Item>
					<Select.Item value="peers">Peers</Select.Item>
					<Select.Item value="year">Year</Select.Item>
					<Select.Item value="rating">IMDb Rating</Select.Item>
					<Select.Item value="likes">YTS Likes</Select.Item>
					<Select.Item value="rt_audience">RT Audience</Select.Item>
					<Select.Item value="alphabetical">Alphabetical</Select.Item>
					<Select.Item value="downloads">Downloads</Select.Item>
				</Select.Content>
				<Button variant="default" type="submit">Search</Button>
			</Select.Root>
		</form>
	</div>
</div>

{#if form}
	<div
		class="container flex-1 items-start md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-10"
	>
		{#each form.results as movie, id}
			<YtsCard {...movie} movieData={form.movieData[id]} />
		{/each}
	</div>
{/if}
