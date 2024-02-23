<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: className = '',
		children,
		...attrs
	} = $props<HTMLAttributes<HTMLHeadingElement> & { children: Snippet }>();
</script>

<h1
	class={cn(
		'scroll-m-20 pt-1 text-4xl font-extrabold tracking-tight md:pt-4 lg:text-5xl',
		className
	)}
	{...attrs}
>
	{@render children()}
</h1>
