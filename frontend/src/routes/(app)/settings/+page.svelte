<script lang="ts">
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let valueSingle: string = 'DEFAULT';
	onMount(() => {
		valueSingle = document.body.getAttribute('data-theme') ?? 'DEFAULT';
	});
	const themes = [
		{ type: 'DEFAULT', name: 'Default', icon: '🦄' },
		{ type: 'KRUSKECHI', name: 'Kruskechi', icon: '🐧' },
		{ type: 'SILVITA', name: 'Silviya', icon: '👸', badge: 'New' }
	];
</script>

<div class="flex flex-col p-4 md:p-8 space-x-4 space-y-4 md:space-x-8 md:space-y-8">
	<div class="w-full max-w-[480px] card p-4 text-token">
		<ListBox>
			{#each themes as { icon, name, type, badge }}
				<ListBoxItem
					bind:group={valueSingle}
					name="medium"
					value={type}
					on:change={() => {
						document.body.setAttribute('data-theme', valueSingle);
					}}
				>
					<svelte:fragment slot="lead">{icon}</svelte:fragment>
					{name}
				</ListBoxItem>
			{/each}
		</ListBox>
	</div>
	<!-- Generator (new) -->
</div>
