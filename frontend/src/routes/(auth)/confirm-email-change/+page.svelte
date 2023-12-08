<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	export let data;
	const { form, enhance, reset, errors, constraints } = superForm(data.form, {
		resetForm: false,
		onSubmit: ({ action, formData, formElement, controller, submitter, cancel }) => {},
		onResult: ({ result, formEl, cancel }) => {},
		onUpdate: ({ form, cancel }) => {},
		onUpdated: ({ form }) => {},
		onError({ result }) {
			console.log('Password reset change -->Superform On Error --> ', result.error.message);
		}
	});
</script>

<section class="flex flex-col items-center container mx-auto mt-[12vh]">
	<div class="flex items-center w-full max-w-3xl px-8 lg:px-12 lg:w-3/5">
		<div class="w-full p-4 border shadow-xl sm:rounded-lg rounded-xl">
			<h1 class="h2 tracking-wider capitalize text-center">Confirm Email Change</h1>
			<!-- <SuperDebug data={$form} /> -->
			<!-- Email Change confirmation Form -->
			<form method="POST" class="grid grid-cols-1 gap-2" use:enhance>
				<label class="label uppercase tracking-wide text-md font-bold" for="password">
					<span class="pl-1">Current Account Password</span>
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

				<button type="submit" class="btn my-2 btn-lg variant-filled">Confirm email change</button>
				<div class="text-lg font-semibold text-center">
					<a href="/password-reset" class="text-blue-700 hover:underline dark:text-blue-500"
						>Send email change code again?
					</a>
					or Don't have an account?
					<a href="/register" class="text-blue-700 hover:underline dark:text-blue-500">Sign Up</a>
				</div>
				<p class="text-center mt-3 text-[14px]">
					By clicking continue, you agree to our
					<a href="/terms" class="text-gray-600">Terms of Service</a> and
					<a href="/privacy" class="text-gray-600">Privacy Policy</a>.
				</p>
			</form>
		</div>
	</div>
</section>
