<script>
	import Footer from '$lib/components/Footer.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<div class="min-h-[70vh]"><slot /></div>
	<svelte:fragment slot="pageFooter"><Footer /></svelte:fragment>
</AppShell>
