<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	export let data;
	const { form, enhance, reset, errors, constraints } = superForm(data.form);
</script>

<section class="flex flex-col w-screen min-h-[75vh] px-4">
	<div class="md:max-w-xl mx-auto my-auto card p-4">
		<header class="card-header">
			<h2 class="h2 font-bold">Password Reset</h2>
			<hr class="!border-t-4 mt-2" />
		</header>

		<p>Your email verification link was sent to your inbox (i.e. console).</p>
		<h2>Resend verification link</h2>
		<form method="post" use:enhance>
			<label class="label uppercase tracking-wide text-md font-bold" for="password">
				<span class="pl-1">New Password</span>
				<input
					type="password"
					name="password"
					class="input"
					bind:value={$form.password}
					aria-invalid={$errors.password ? 'true' : undefined}
					{...$constraints.password}
				/>
				{#if $errors.password}
					<span class="block text-red-600 dark:text-red-500">{$errors.password}</span>
				{/if}
			</label>

			<label class="label uppercase tracking-wide text-md font-bold" for="passwordConfirm">
				<span class="pl-1">Confirm Password</span>
				<input
					type="password"
					name="passwordConfirm"
					class="input"
					bind:value={$form.passwordConfirm}
					aria-invalid={$errors.passwordConfirm ? 'true' : undefined}
					{...$constraints.passwordConfirm}
				/>
				{#if $errors.passwordConfirm}
					<span class="block text-red-600 dark:text-red-500">{$errors.passwordConfirm}</span>
				{/if}
			</label>
			<button type="submit" class="btn my-2 w-full variant-filled">Change Password</button>
		</form>
	</div>
</section>
