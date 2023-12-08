<script>
	import { page } from '$app/stores';
</script>

<div class="grid h-screen place-items-center -mt-20">
	<div class="text-center">
		<p class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Uh-oh!</p>
		{#if $page?.error}
			<h1 class="font-black text-5xl md:text-9xl">{$page.status}</h1>
			<p class="mt-4 md:text-5xl">{$page?.error?.message}</p>
		{:else}
			<h1 class="font-black text-5xl md:text-9xl">404</h1>
			<p class="mt-4 text-5xl md:text-6xl text-gray-500">We can't find that page.</p>
		{/if}

		<a href="/" class="btn btn-md md:btn-xl variant-filled-primary my-6"> Go Back Home </a>
	</div>
</div>
