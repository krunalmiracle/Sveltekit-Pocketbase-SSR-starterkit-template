<script lang="ts">
	import { page } from '$app/stores';
	import { AppShell, AppRail, AppRailTile, AppRailAnchor } from '@skeletonlabs/skeleton';
	import { HomeIcon, BellIcon, UserIcon, SettingsIcon, GridIcon } from 'svelte-feather-icons';
</script>

<AppShell>
	<svelte:fragment slot="sidebarLeft">
		<!-- Hidden below Tailwind's large breakpoint -->
		<div id="sidebar-left" class="hidden sidebar-adjusted lg:block">
			<AppRail>
				<!-- Top Action Rails -->
				<svelte:fragment slot="lead">
					<AppRailAnchor href="/" selected={false} title="Home">
						<svelte:fragment slot="lead"><HomeIcon /></svelte:fragment>
						<span>Home</span>
					</AppRailAnchor>
				</svelte:fragment>
				<!-- Middle Action Rails -->
				<AppRailAnchor
					href="/dashboard"
					selected={$page.url.pathname === '/dashboard'}
					title="Dashboard"
				>
					<svelte:fragment slot="lead"><GridIcon /></svelte:fragment>
					<span>Dashboard</span>
				</AppRailAnchor>
				<AppRailAnchor href="/profile" selected={$page.url.pathname === '/profile'} title="Profile">
					<svelte:fragment slot="lead"><UserIcon /></svelte:fragment>
					<span>Profile</span>
				</AppRailAnchor>
				<AppRailAnchor
					href="/settings"
					selected={$page.url.pathname === '/settings'}
					title="Setting"
				>
					<svelte:fragment slot="lead"><SettingsIcon /></svelte:fragment>
					<span>Setting</span>
				</AppRailAnchor>
				<AppRailAnchor
					href="/notifications"
					selected={$page.url.pathname === '/notifications'}
					title="Notifications"
				>
					<svelte:fragment slot="lead"><BellIcon /></svelte:fragment>
					<span>Notifications</span>
				</AppRailAnchor>

				<!-- Bottom Action Rails -->
				<svelte:fragment slot="trail">
					<AppRailAnchor
						href="/profile"
						selected={$page.url.pathname === '/profile'}
						title="Profile"
					>
						<svelte:fragment slot="lead"><UserIcon /></svelte:fragment>
						<span>Profile</span>
					</AppRailAnchor>
				</svelte:fragment>
			</AppRail>
		</div>
	</svelte:fragment>
	<!-- Router Slot -->
	<div class="lg:pl-20">
		<slot />
	</div>
</AppShell>

<style>
	.sidebar-adjusted {
		height: calc(95vh);
		position: fixed;
	}
</style>
