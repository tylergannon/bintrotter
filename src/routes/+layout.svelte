<script>
	import Header from '$lib/components/site/header/Header.svelte';
	import '../app.postcss';
</script>

<div class="relative flex min-h-screen flex-col bg-background">
	<Header />
	<div class="flex-1">
		<div class="border-b">
			<div class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
				<slot />
			</div>

		</div>


	</div>
</div>
