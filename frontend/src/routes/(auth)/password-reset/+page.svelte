<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	export let data;
	let success = false;
	/* import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'; */
	const { form, enhance, reset, errors, constraints } = superForm(data.form, {
		resetForm: false,
		onSubmit: () => {
			success = false;
		},
		onResult: ({ result }) => {
			if (result.type == 'success') {
				success = true;
			}
		},
		onUpdate: ({ form, cancel }) => {},
		onUpdated: ({ form }) => {},
		onError({ result }) {
			console.log('Send Password reset token -->Superform On Error --> ', result.error.message);
		}
	});
</script>

<section class="flex flex-col w-screen min-h-[75vh] px-4">
	<div class="md:max-w-xl mx-auto my-auto card px-4">
		<header class="card-header">
			<h2 class="h2 font-bold">Password Recovery</h2>
			<hr class="!border-t-4 mt-2" />
		</header>
		<form method="post" use:enhance>
			<label class="label uppercase tracking-wide text-md font-bold pt-1" for="email">
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
			<button type="submit" class="btn my-2 w-full variant-filled">Send recovery code</button>
		</form>
		<footer class="card-footer">
			{#if success}
				<p class="text-center font-bold py-2 text-success-700">
					Your password reset link was sent to your inbox
				</p>
			{/if}

			<div class="text-md font-semibold text-center">
				Don't have an account? <a
					href="/register"
					class="text-blue-700 hover:underline dark:text-blue-500">Sign Up</a
				>
				or
				<a href="/login" class="text-blue-700 hover:underline dark:text-blue-500">Login</a>
			</div>
			<p class="text-center mt-3 text-[14px]">
				By clicking continue, you agree to our
				<a href="/terms" class="text-gray-600">Terms of Service</a> and
				<a href="/privacy" class="text-gray-600">Privacy Policy</a>.
			</p>
		</footer>
	</div>
</section>
