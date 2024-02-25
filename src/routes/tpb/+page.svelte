<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { H1 } from '$lib/components/elements';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { onMount } from 'svelte';
	import categories from './categories.json';
	import mediaTypes from './mediaTypes.json';
	import type { MediaType } from './+page.server';
	import * as Table from '$lib/components/ui/table';
	import trackers from '$lib/trackers.json';
	import { MagnetIcon } from 'lucide-svelte';

	let { form } = $props();

	function magnetLink(hash: string, torrentName: string): string {
		return `magnet:?xt=urn:btih:${hash}&dn=${torrentName}&${trackers}`;
	}

	const query = form?.query ?? '';
	const tpbCategory = form?.cat ?? '0';
	const mediaType: MediaType = (form?.mediaType as MediaType) ?? 'movie';

	let selectedMediaType = $state(
		mediaTypes.find((it) => it.value === mediaType)! as { label: string; value: MediaType }
	);
	const queryLabel: Record<MediaType, string> = {
		any: 'TPB Query',
		audiobook: 'Audiobook Title',
		episode: 'Series Title',
		movie: 'Movie Title',
		season: 'Series Title',
		series: 'Series Title'
	};

	$inspect(selectedMediaType);

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
			<div class="my-4">
				<Select.Root name="query_type" bind:selected={selectedMediaType}>
					<Select.Input name="type" />
					<label for="query_type">Media Type</label>
					<Select.Trigger class="w-[400px]">
						<Select.Value placeholder="(optional)"></Select.Value>
					</Select.Trigger>
					<Select.Content>
						{#each mediaTypes as { value, label }}
							<Select.Item {value} {label} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="my-4">
				<label for="query">
					{queryLabel[selectedMediaType.value]}
				</label>
				<Input name="query" value={query} />
			</div>
			{#if ['season', 'episode'].includes(selectedMediaType.value)}
				<div class="my-4">
					<label for="season">Season</label>
					<Input name="season" value={''} required />
				</div>
				{#if selectedMediaType.value === 'episode'}
					<div class="my-4">
						<label for="episode">Episode</label>
						<Input name="episode" value={''} required />
					</div>
				{/if}
			{/if}
			{#if selectedMediaType.value !== 'any'}
				<div class="my-4">
					<label for="year"> Year (optional) </label>
					<Input name="year" type="number" value={''} />
				</div>
				{#if selectedMediaType.value !== 'audiobook'}
					<div class="my-4">
						<Select.Root name="quality_select" selected={{value: "", label: "Any"}}>
							<Select.Input name="quality" />
							<label for="quality_select">Video Quality</label>
							<Select.Trigger class="w-[400px]">
								<Select.Value placeholder="(optional)"></Select.Value>
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="">Any</Select.Item>
								<Select.Item value="720p">720p</Select.Item>
								<Select.Item value="1080p">1080p</Select.Item>
								<Select.Item value="2160p">2160p</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
				{/if}
			{/if}

			{#if selectedMediaType.value === 'any'}
				<div class="my-4">
					<Select.Root
						name="category_select"
						selected={categories.find((it) => it.value === tpbCategory)}
					>
						<Select.Input name="category" />
						<label for="category_select">TPB Category</label>
						<Select.Trigger class="w-[400px]">
							<Select.Value placeholder="(optional)"></Select.Value>
						</Select.Trigger>
						<Select.Content>
							{#each categories as { value, label }}
								<Select.Item {value} {label} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			{/if}
			<Button variant="default" type="submit">Search</Button>
		</form>
	</div>
</div>

{#if form}
	<div
		class="container"
	>
		{#if form.results.ok}
			<Table.Root>
				<Table.Caption>Found the following torrents</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[100px]">Magnet</Table.Head>
						<Table.Head>Title</Table.Head>
						<Table.Head>Seeders</Table.Head>
						<Table.Head>Leechers</Table.Head>
						<Table.Head>Size (GB)</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each form.results.data as { info_hash, name, leechers, seeders, size }}
						<Table.Row>
							<Table.Cell>
								<a href={magnetLink(info_hash, name)}>
									<MagnetIcon />
								</a>
							</Table.Cell>
							<Table.Cell>{name}</Table.Cell>
							<Table.Cell class="text-right">{seeders}</Table.Cell>
							<Table.Cell class="text-right">{leechers}</Table.Cell>
							<Table.Cell class="text-right">{Math.round(parseInt(size)/10000000)/100} GB</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{:else}
			There was an error.
		{/if}
	</div>
{/if}
