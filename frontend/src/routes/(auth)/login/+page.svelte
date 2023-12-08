<script lang="ts">
	import { pbStore } from '$lib/stores/pbStore';
	import { superForm } from 'sveltekit-superforms/client';
	export let data;
	$: ({ providers } = data);
	/* let date = new Date(currDateNow); */
	const { form, enhance, reset, errors, constraints } = superForm(data.form, {
		resetForm: false,
		onSubmit: ({ action, formData, formElement, controller, submitter, cancel }) => {},
		onResult: ({ result, formEl, cancel }) => {
			pbStore.set();
		},
		onUpdate: ({ form, cancel }) => {},
		onUpdated: ({ form }) => {},
		onError({ result }) {
			console.log('Login -->Superform On Error --> ', result.error.message);
		}
	});
</script>

<section class="flex flex-col w-screen min-h-[75vh] px-4">
	<div class="md:max-w-lg mx-auto my-auto card">
		<header class="card-header">
			<h2 class="h2 font-bold">Sign in to your account</h2>
			<hr class="!border-t-4 mt-2" />
		</header>
		<section class="p-4">
			<div
				class="btn-wrapper flex flex-col md:flex-row md:items-center md:justify-evenly text-center mt-2"
			>
				<hr class="my-3 border-b-1 border-blueGray-300" />
				{#each providers.authProviders as provider}
					{#if provider.name === 'github'}
						<a
							href="/oauth?provider={provider.name}"
							type="button"
							class="text-white w-full bg-gray-900 hover:bg-gray-900/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-start md:justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
							><svg
								class="mr-2 fill-current -ml-1 w-4 h-4"
								aria-hidden="true"
								focusable="false"
								data-prefix="fab"
								data-icon="google"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								><path
									d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
								/></svg
							>SignIn with Github
						</a>
					{:else if provider.name === 'google'}
						<a
							href="/oauth?provider={provider.name}"
							type="button"
							class="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-start md:justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
							><svg
								class="mr-2 -ml-1 w-4 h-4"
								aria-hidden="true"
								focusable="false"
								data-prefix="fab"
								data-icon="google"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 488 512"
								><path
									fill="currentColor"
									d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
								/></svg
							>SignIn with Google
						</a>
					{:else if provider.name === 'facebook'}
						<a
							href="/oauth?provider={provider.name}"
							type="button"
							class="text-white w-full bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-start md:justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
							><svg
								class="mr-2 -ml-1 w-4 h-4 fill-current"
								aria-hidden="true"
								focusable="false"
								data-prefix="fab"
								data-icon="google"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
							>
								<path
									d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"
								/></svg
							>SignIn with Facebook
						</a>
					{:else}
						<!-- else Some other provider -->
						<a href="/oauth?provider={provider.name}">Connect with {provider.name}</a>
					{/if}
				{/each}
			</div>
			<hr class="my-3 border-b-1 border-blueGray-300" />
			<form method="POST" action="login" use:enhance>
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
				<button type="submit" class="btn my-2 w-full variant-filled">Login</button>
			</form>
		</section>
		<footer class="card-footer">
			<div class="text-lg font-semibold text-center">
				Don't have an account? <a href="/register" class="text-tertiary-500 hover:underline"
					>Sign Up</a
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

<style>
	.google-blue {
		background: #4285f4;
	}
</style>
