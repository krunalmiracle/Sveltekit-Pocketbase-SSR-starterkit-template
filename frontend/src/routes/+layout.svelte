<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { afterNavigate } from '$app/navigation';
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		LightSwitch,
		Avatar,
		initializeStores,
		Drawer,
		getDrawerStore,
		Modal,
		Toast,
		popup,
		type PopupSettings,
		type DrawerSettings
	} from '@skeletonlabs/skeleton';

	// Highlight JS
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	// Popup settings for dropdown user menu
	const popupSettings: PopupSettings = {
		event: 'click',
		target: 'popupUserMenu',
		placement: 'bottom'
	};

	// Drawer
	initializeStores();
	$: classesSidebar = $page.url.pathname === '/' ? 'w-0' : 'w-0 lg:w-64';
	const drawerStore = getDrawerStore();
	const settings: DrawerSettings = {
		id: 'drawer-navigation',
		width: 'w-[280px] md:w-[480px]',
		padding: 'pr-2',
		rounded: 'rounded-xl'
	};
	const popupThemeSettings: PopupSettings = {
		event: 'click',
		target: 'popupThemeMenu',
		placement: 'bottom'
	};
	function drawerOpen(): void {
		drawerStore.open(settings);
	}

	// Navigation common
	import Navigation from '$lib/components/Navigation.svelte';

	// Pocketbase Session for User Client Side
	export let data;
	$: isLoggedIn = data?.isLoggedIn ?? false;
	$: user = data?.user ?? null;

	/* let isLoggedLocally = false; */
	/* let isUserLoggedIn = false;
	$: isUserLoggedIn = !!user; */
	/* console.log('Session user --> ', user);
	console.log('isUserLoggedIn -->', isLoggedIn); */
	/* pbStore.set(PUBLIC_BACKEND_URL); */
	// we need to scope the unsubscription variable outside the onMount, so we can reach it when un mounting the component / cleaning up.
	/* var unsubscribe: Invalidator<Client> | undefined;
	onMount(() => {
		// Subscribe to pbStore Client
		pbStore.subscribe((client) => {
			//Subscribe callback
			console.log('User authenticated even locally...');
			isLoggedLocally = client.authStore.isValid;
		}, unsubscribe);
	});
	onDestroy(() => {
		unsubscribe;
	}); */

	// AppBar User Profile Data
	$: avatar = user?.avatar
		? `${env.PUBLIC_BACKEND_URL}/api/files/_pb_users_auth_/${user?.id}/${user?.avatar}`
		: undefined;
	let initials: string | undefined = '';
	$: initials = user?.username!.slice(0, 2) ?? 'XY';
	// Scroll to Top on Navigation
	afterNavigate((params: any) => {
		const isNewPage: boolean =
			params.from && params.to && params.from.route.id !== params.to.route.id;
		const elemPage = document.querySelector('#page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
	});
</script>

<Drawer>
	{#if $drawerStore.id === 'drawer-navigation'}
		<h2 class="p-4">Navigation</h2>
		<hr />
		<Navigation {isLoggedIn} />
	{:else if $drawerStore.id === 'drawer-application'}
		<h2 class="p-4">Application Drawer</h2>
		<hr />
	{:else}
		<h2 class="p-4">Navigation</h2>
		<hr />
		<Navigation {isLoggedIn} />
	{/if}
</Drawer>
<Toast />
<Modal />
<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar padding="py-2 px-4">
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button class="mr-4 lg:hidden btn btn-sm" on:click={drawerOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="w-4 h-4 fill-token">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
				</div>

				<a href="/"><strong class="text-xl">starter-template</strong></a>
				<img src="./favicon-32x32.png" alt="logo" class="w-7 ml-2 aspect-square" />
				<!-- {#if isLoggedLocally}
					<span
						class="hidden sm:block bg-green-100 text-green-800 text-sm font-medium mx-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
						>SignedIn</span
					>
				{:else}
					<span
						class="hidden sm:block bg-red-100 text-red-800 text-sm font-medium mx-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
						>SignedOut</span
					>
				{/if} -->
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<div
					class="btn btn-sm variant-filled hover:variant-soft-primary hidden sm:block"
					use:popup={popupThemeSettings}
				>
					Theme
				</div>
				<div class="p-2 rounded-xl card" data-popup="popupThemeMenu">
					<nav class="px-0 pt-1 list-nav">
						<ul>
							<li>
								<button
									class="btn w-full variant-ghost-secondary"
									on:click={() => {
										document.body.setAttribute('data-theme', 'SILVITA');
									}}
									>Silvita
								</button>
							</li>
							<li>
								<button
									class="btn w-full variant-ghost-primary"
									on:click={() => {
										document.body.setAttribute('data-theme', 'KRUSKECHI');
									}}
									>Kruskechi
								</button>
							</li>
							<li>
								<button
									class="btn w-full variant-ghost-surface"
									on:click={() => {
										document.body.setAttribute('data-theme', 'DEFAULT');
									}}
									>Default
								</button>
							</li>
							<li>
								<button
									class="btn w-full variant-ghost-tertiary"
									on:click={() => {
										document.body.setAttribute('data-theme', '');
									}}
									>Generated
								</button>
							</li>
						</ul>
					</nav>
				</div>
				<a class="hidden md:block hover:underline" href="/theme">Theme Creator</a>
				<a class="hidden md:block hover:underline" href="/find">Find Sitter</a>
				<a class="hidden md:block hover:underline" href="/contact">Contact</a>
				<a class="hidden md:block hover:underline" href="/about">About us</a>
				{#if isLoggedIn}
					<div use:popup={popupSettings} class="p-0 m-0">
						<Avatar
							src={avatar}
							width="w-12"
							initials={`${user?.firstName[0] ?? 'X'}${user?.lastName[0] ?? 'Y'}`}
							rounded="rounded-lg"
						/>
					</div>
					<div class="p-2 rounded-xl card" data-popup="popupUserMenu">
						<nav class="px-0 pt-1 list-nav">
							<ul>
								<li>
									<a class="btn btn-sm variant-ghost-surface" href="/dashboard">Dashboard</a>
								</li>
								<li>
									<a class="btn btn-sm variant-ghost-surface" href="/profile">Profile</a>
								</li>
								<li>
									<a class="btn btn-sm variant-ghost-surface" href="/settings">Settings</a>
								</li>
								<li>
									<a class="btn btn-sm variant-ghost-surface" href="/notifications">Notifications</a
									>
								</li>
								<li>
									<a
										class="w-full btn btn-sm variant-ghost-error"
										href="/logout"
										data-sveltekit-reload>Logout</a
									>
								</li>
							</ul>
						</nav>
						<div class="arrow" />
					</div>
				{:else}
					<a class="btn btn-sm variant-ghost-primary" href="/login">Login</a>
					<a class="btn btn-sm variant-ghost-tertiary hidden sm:block" href="/register">Register</a>
				{/if}
				<div style="width:48px;height:24px;"><LightSwitch /></div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
