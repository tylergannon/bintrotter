<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { H1 } from '$lib/components/elements';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Input } from '$lib/components/ui/input';
	import TPBCard from '$lib/components/site/movies/TPBCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { onMount } from 'svelte';
	import type { ActionData, PageData } from './$types';

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
		<H1 class="pb-4">TPB Search</H1>
		<Separator class="mb-4" />

		<form
			method="POST"
			use:enhance={({}) =>
				async ({ result }) =>
					await applyAction(result)}
		>
			<label for="query">Search Query</label>
			<Input name="query" bind:value={query} />
			<Select.Root name="category_select">
				<Select.Input name="category" />
				<label for="category_select">Category</label>
				<Select.Trigger class="w-[400px]">
					<Select.Value placeholder="(optional)"></Select.Value>
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="0">All</Select.Item>
					<Select.Item value="100">Audio</Select.Item>
					<Select.Item value="102">Audio/Audio books</Select.Item>
					<Select.Item value="104">Audio/FLAC</Select.Item>
					<Select.Item value="101">Audio/Music</Select.Item>
					<Select.Item value="199">Audio/Other</Select.Item>
					<Select.Item value="103">Audio/Sound clips</Select.Item>
					<Select.Item value="400">Games</Select.Item>
					<Select.Item value="408">Games/Android</Select.Item>
					<Select.Item value="406">Games/Handheld</Select.Item>
					<Select.Item value="407">Games/IOS (iPad/iPhone)</Select.Item>
					<Select.Item value="402">Games/Mac</Select.Item>
					<Select.Item value="499">Games/Other</Select.Item>
					<Select.Item value="401">Games/PC</Select.Item>
					<Select.Item value="403">Games/PSx</Select.Item>
					<Select.Item value="405">Games/Wii</Select.Item>
					<Select.Item value="404">Games/XBOX360</Select.Item>
					<Select.Item value="601">Other/E-books</Select.Item>
					<Select.Item value="200">Video</Select.Item>
					<Select.Item value="209">Video/3D</Select.Item>
					<Select.Item value="207">Video/HD - Movies</Select.Item>
					<Select.Item value="208">Video/HD - TV shows</Select.Item>
					<Select.Item value="206">Video/Handheld</Select.Item>
					<Select.Item value="204">Video/Movie clips</Select.Item>
					<Select.Item value="201">Video/Movies</Select.Item>
					<Select.Item value="202">Video/Movies DVDR</Select.Item>
					<Select.Item value="203">Video/Music videos</Select.Item>
					<Select.Item value="299">Video/Other</Select.Item>
					<Select.Item value="205">Video/TV shows</Select.Item>
					<Select.Item value="500">Porn</Select.Item>
					<Select.Item value="300">Applications</Select.Item>
					<Select.Item value="306">Applications/Android</Select.Item>
					<Select.Item value="304">Applications/Handheld</Select.Item>
					<Select.Item value="305">Applications/IOS (iPad/iPhone)</Select.Item>
					<Select.Item value="302">Applications/Mac</Select.Item>
					<Select.Item value="399">Applications/Other OS</Select.Item>
					<Select.Item value="303">Applications/UNIX</Select.Item>
					<Select.Item value="301">Applications/Windows</Select.Item>
					<Select.Item value="600">Other</Select.Item>
					<Select.Item value="602">Other/Comics</Select.Item>
					<Select.Item value="604">Other/Covers</Select.Item>
					<Select.Item value="699">Other/Other</Select.Item>
					<Select.Item value="605">Other/Physibles</Select.Item>
					<Select.Item value="603">Other/Pictures</Select.Item>
					<Select.Item value="504">Porn/Games</Select.Item>
					<Select.Item value="505">Porn/HD - Movies</Select.Item>
					<Select.Item value="506">Porn/Movie clips</Select.Item>
					<Select.Item value="501">Porn/Movies</Select.Item>
					<Select.Item value="502">Porn/Movies DVDR</Select.Item>
					<Select.Item value="599">Porn/Other</Select.Item>
					<Select.Item value="503">Porn/Pictures</Select.Item>
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
		{#each form.results as { info_hash, name, leechers, seeders, num_files, size }, id}
			<TPBCard
				{info_hash}
				{name}
				{leechers}
				{seeders}
				{num_files}
				{size}
				movieData={form.movieData[id]}
			/>
		{/each}
	</div>
{/if}
