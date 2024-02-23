<script>
	import Header from '$lib/components/site/header/Header.svelte';
	import '../app.postcss';

	import { ModeWatcher } from 'mode-watcher';
</script>

<div class="relative flex min-h-screen flex-col bg-background">
	<ModeWatcher />
	<Header />
	<div class="flex-1">
		<div class="border-b">
			<slot />
		</div>
	</div>
</div>
