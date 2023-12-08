<script lang="ts">
	import { page } from '$app/stores';
	import { Accordion, AccordionItem, getDrawerStore } from '@skeletonlabs/skeleton';
	export let isLoggedIn: boolean;
	const drawerStore = getDrawerStore();

	function drawerClose() {
		drawerStore.close();
	}
</script>

<nav class="p-4 list-nav">
	<ul>
		<li>
			<a
				href="/"
				class={$page.url.pathname === '/' ? 'variant-soft-tertiary' : ''}
				on:click={drawerClose}>Home</a
			>
		</li>
		<li>
			<a
				class={$page.url.pathname === '/find' ? 'variant-soft-tertiary' : ''}
				href="/find"
				on:click={drawerClose}>Find baby Sitter</a
			>
		</li>
		{#if isLoggedIn}
			<hr class="!border-t-2" />
			<li>
				<a
					class={$page.url.pathname === '/dashboard' ? 'variant-soft-tertiary' : ''}
					href="/dashboard"
					on:click={drawerClose}>Dashboard</a
				>
			</li>
			<li>
				<a
					class={$page.url.pathname === '/profile' ? 'variant-soft-tertiary' : ''}
					href="/profile"
					on:click={drawerClose}>Profile</a
				>
			</li>
			<li>
				<a
					class={$page.url.pathname === '/settings' ? 'variant-soft-tertiary' : ''}
					href="/settings"
					on:click={drawerClose}>Account</a
				>
			</li>
			<li>
				<a
					class={$page.url.pathname === '/notifications' ? 'variant-soft-tertiary' : ''}
					href="/notifications"
					on:click={drawerClose}>Notifications</a
				>
			</li>
			<hr class="!border-t-2" />
		{/if}
		<li>
			<a
				class={$page.url.pathname === '/about' ? 'variant-soft-tertiary' : ''}
				href="/about"
				on:click={drawerClose}>About us</a
			>
		</li>
		<li>
			<a
				class={$page.url.pathname === '/contact' ? 'variant-soft-tertiary' : ''}
				href="/contact"
				on:click={drawerClose}>Contact</a
			>
		</li>
		<li>
			<a
				class={$page.url.pathname === '/terms' ? 'variant-soft-tertiary' : ''}
				href="/terms"
				on:click={drawerClose}>Terms and Condition</a
			>
		</li>
		<li>
			<a
				class={$page.url.pathname === '/privacy' ? 'variant-soft-tertiary' : ''}
				href="/privacy"
				on:click={drawerClose}>Privacy</a
			>
		</li>
		<hr class="!border-t-2" />
		<li>
			<a class="hover:underline" href="/theme">Theme Creator</a>
		</li>
		<li>
			<Accordion>
				<AccordionItem>
					<svelte:fragment slot="summary">Themes</svelte:fragment>
					<svelte:fragment slot="content">
						<button
							class="btn w-full variant-ghost-secondary"
							on:click={() => {
								document.body.setAttribute('data-theme', 'silvita');
							}}
							>Silvita
						</button>
						<button
							class="btn w-full variant-ghost-primary"
							on:click={() => {
								document.body.setAttribute('data-theme', 'kruskechi');
							}}
							>Kruskechi
						</button>
						<button
							class="btn w-full variant-ghost-surface"
							on:click={() => {
								document.body.setAttribute('data-theme', 'skeleton');
							}}
							>Default
						</button>
						<button
							class="btn w-full variant-ghost-tertiary"
							on:click={() => {
								document.body.setAttribute('data-theme', '');
							}}
							>Generated
						</button>
					</svelte:fragment>
				</AccordionItem>
			</Accordion>
		</li>
		<hr class="!border-dashed pb-2" />

		{#if isLoggedIn}
			<li>
				<a class="w-full btn btn-sm variant-ghost-error" href="/logout" data-sveltekit-reload>
					Logout
				</a>
			</li>
		{:else}
			<li>
				<a class="btn btn-sm variant-ghost-primary" href="/login">Login</a>
			</li>
			<li>
				<a class="btn btn-sm variant-ghost-tertiary hidden sm:block" href="/register">Register</a>
			</li>
			<li>
				<a
					class={$page.url.pathname === '/password-reset' ? 'variant-soft-tertiary' : ''}
					href="/password-reset">Forgot Password?</a
				>
			</li>
		{/if}
	</ul>
</nav>
