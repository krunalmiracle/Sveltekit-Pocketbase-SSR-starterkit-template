<script lang="ts">
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
	export let data;
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	const currDateNow = new Date().toISOString().slice(0, 10);
	/* let date = new Date(currDateNow); */
	const { form, enhance, reset, errors, constraints } = superForm(data.form, {
		resetForm: false,
		onSubmit: ({ action, formData, formElement, controller, submitter, cancel }) => {},
		onResult: ({ result, formEl, cancel }) => {},
		onUpdate: ({ form, cancel }) => {},
		onUpdated: ({ form }) => {},
		onError({ result }) {
			console.log('Register -->Superform On Error --> ', result.error.message);
		}
	});
</script>

<section class="flex flex-col w-screen min-h-[75vh] px-4">
	<div class="md:max-w-lg mx-auto my-auto card">
		<header class="card-header">
			<h2 class="h2 font-bold">Sigup for a account</h2>
			<hr class="!border-t-4 mt-2" />
		</header>
		<section class="p-4">
			<form method="POST" action="register" use:enhance>
				<label class="label tracking-wide text-md font-bold" for="role">
					<span class="pl-1 mb-3 font-bold text-xl">Are you an Parent or BabySitter?</span>
					<ListBox class="grid grid-cols-1 gap-4 text-center sm:grid-cols-2">
						<ListBoxItem
							active="variant-filled-warning"
							bind:group={$form.role}
							name="role"
							value="USER"
						>
							Parents
						</ListBoxItem>
						<ListBoxItem
							active="variant-filled-warning"
							bind:group={$form.role}
							name="role"
							value="WORKER"
						>
							Sitter
						</ListBoxItem>
					</ListBox>
					{#if $errors.role}
						<span class="block text-red-600 dark:text-red-500">{$errors.role}</span>
					{/if}
				</label>
				<label class="label uppercase tracking-wide text-md font-bold" for="firstName">
					<span class="pl-1">FirstName</span>
					<input
						type="text"
						name="firstName"
						class="input"
						bind:value={$form.firstName}
						aria-invalid={$errors.firstName ? 'true' : undefined}
						{...$constraints.firstName}
					/>
					{#if $errors.firstName}
						<span class="block text-red-600 dark:text-red-500">{$errors.firstName}</span>
					{/if}
				</label>
				<label class="label uppercase tracking-wide text-md font-bold" for="lastName">
					<span class="pl-1">LastName</span>
					<input
						type="text"
						name="lastName"
						class="input"
						bind:value={$form.lastName}
						aria-invalid={$errors.lastName ? 'true' : undefined}
						{...$constraints.lastName}
					/>
					{#if $errors.lastName}
						<span class="block text-red-600 dark:text-red-500">{$errors.lastName}</span>
					{/if}
				</label>

				<label class="label uppercase tracking-wide text-md font-bold" for="email">
					<span class="pl-1">Email</span>
					<input
						type="email"
						name="email"
						class="input"
						bind:value={$form.email}
						aria-invalid={$errors.email ? 'true' : undefined}
						{...$constraints.email}
					/>
					{#if $errors.email}
						<span class="block text-red-600 dark:text-red-500">{$errors.email}</span>
					{/if}
				</label>
				<label class="label uppercase tracking-wide text-md font-bold" for="password">
					<span class="pl-1">Password</span>
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
				<button type="submit" class="btn my-2 w-full variant-filled">Register</button>
			</form>
		</section>
		<footer class="card-footer">
			<div class="text-lg font-semibold text-center">
				Already have an account? <a href="/login" class="text-tertiary-500 hover:underline"
					>Sign In</a
				>
				or
				<a href="/password-reset" class="text-tertiary-500 hover:underline">Forgot Your Password?</a
				>
			</div>
			<p class="text-center mt-3 text-[14px]">
				By clicking continue, you agree to our
				<a href="/terms" class="text-tertiary-500">Terms of Service</a> and
				<a href="/privacy" class="text-tertiary-500">Privacy Policy</a>.
			</p>
		</footer>
	</div>
</section>
