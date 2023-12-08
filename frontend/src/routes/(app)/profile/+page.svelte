<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { UsersRoleOptions, ServiceServiceOptions } from '$lib/pocketbase-types';
	import { superForm } from 'sveltekit-superforms/client';
	import {
		calculateAge,
		convertTo24Hour,
		covertToMonth,
		covertToWorkWeekday,
		findLowestPayPerHour
	} from '$lib/util/helpers';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { PlusSquareIcon, XSquare, Pencil, Save, Trash } from 'lucide-svelte';
	import { countries } from '$lib/constants.js';
	import DateInput from '$lib/components/date-picker-svelte/DateInput.svelte';
	import { enhance } from '$app/forms';
	import { env } from '$env/dynamic/public';
	export let data;
	$: ({ user } = data);
	// loading Indicator
	let loading = false;
	const currDateNow = new Date();
	const minDate = new Date('1920-01-01');
	/// Change Bio
	const {
		form: changeBioForm,
		errors: changeBioErrors,
		enhance: changeBioEnhance,
		constraints: changeBioConstraints
	} = superForm(data.changeBioForm, {
		id: 'change-bio-id-form',
		resetForm: true,
		onSubmit: () => {},
		onResult: ({ result }) => {
			loading = false;
			if (result.type == 'success') {
				showModal = false;
				isEditModeBio = false;
				isEditingRow = '';
				closeModal();
			}
		},

		onError({ result }) {
			console.log('change Bio form edit --> Superform On Error --> ', result.error.message);
		}
	});
	/// Change Avatar
	const { errors: changeAvatarErrors, enhance: changeAvatarEnhance } = superForm(
		data.changeAvatarForm,
		{
			id: 'change-Avatar-id-form',
			resetForm: true,
			onSubmit: () => {
				loading = true;
			},
			onResult: ({ result }) => {
				loading = false;
				if (result.type == 'success') {
					isEditModeAvatar = false;
					showModal = false;
					closeModal();
				}
			},

			onError({ result }) {
				console.log('change Avatar form edit --> Superform On Error --> ', result.error.message);
			}
		}
	);
	/// Change Role Super Form
	const {
		form: changeRoleForm,
		errors: changeRoleErrors,
		enhance: changeRoleEnhance,
		constraints: changeRoleConstraints
	} = superForm(data.changeRoleForm, {
		id: 'change-role-id-form',
		resetForm: true,
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			loading = false;
			if (result.type == 'success') {
				showModal = false;
				isEditingRow = '';
				closeModal();
			}
		},

		onError({ result }) {
			console.log('change Role form edit --> Superform On Error --> ', result.error.message);
		}
	});
	/// Change Password Super Form
	const {
		form: changePasswordForm,
		errors: changePasswordErrors,
		enhance: changePasswordEnhance,
		constraints: changePasswordConstraints
	} = superForm(data.changePasswordForm, {
		id: 'change-password-id-form',
		resetForm: true,
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			loading = false;
			if (result.type == 'success') {
				showModal = false;
				isEditingRow = '';
				closeModal();
			}
		},

		onError({ result }) {
			console.log('change password form edit --> Superform On Error --> ', result.error.message);
		}
	});
	/// Change Email Super Form
	const {
		form: changeEmailForm,
		errors: changeEmailErrors,
		enhance: changeEmailEnhance,
		constraints: changeEmailConstraints
	} = superForm(data.changeEmailForm, {
		id: 'change-email-address-id-form',
		resetForm: true,
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			loading = false;
			if (result.type == 'success') {
				showModal = false;
				isEditingRow = '';
				closeModal();
			}
		},

		onError({ result }) {
			console.log('changeEmail form edit --> Superform On Error --> ', result.error.message);
		}
	});
	/// Edit Profile Super Form
	const {
		form: profileForm,
		errors: profileErrors,
		enhance: profileEnhance,
		constraints: profileConstraints
	} = superForm(data.profileForm, {
		resetForm: true,
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			loading = false;
			if (result.type == 'success') {
				showModal = false;
				isEditModeProfile = false;
				isEditingRow = '';
				closeModal();
			}
		},

		onError({ result }) {
			console.log('profile form edit --> Superform On Error --> ', result.error.message);
		}
	});
	/// New Services Provided Form
	const {
		form: servicesprovidedForm,
		formId: servicesprovidedFormId,
		errors: servicesprovidedErrors,
		enhance: servicesprovidedEnhance,
		constraints: servicesprovidedConstraints
	} = superForm(data.servicesprovidedForm, {
		resetForm: true,
		applyAction: true,
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			loading = false;
			if (result.type == 'success') {
				showModal = false;
				isEditingRow = '';
				closeModal();
			}
		},

		onError({ result }) {
			console.log('New Service Provided --> Superform On Error --> ', result.error.message);
		}
	});
	/// New Availability or Work Time Form
	const {
		form: availabilityForm,
		formId: availabilityFormId,
		errors: availabilityErrors,
		enhance: availabilityEnhance,
		constraints: availabilityConstraints
	} = superForm(data.availabilityForm, {
		resetForm: true,
		applyAction: true,
		id: 'edit-availability-form-id',
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			loading = false;
			if (result.type == 'success') {
				showModal = false;
				isEditingRow = '';
				closeModal();
			}
		},

		onError({ result }) {
			console.log('New Availability Form --> Superform On Error --> ', result.error.message);
		}
	});
	/// New/Edit Billing Address Form
	const {
		form: billingAddressForm,
		errors: billingAddressErrors,
		enhance: billingAddressEnhance,
		constraints: billingAddressConstraints
	} = superForm(data.billingAddressForm, {
		resetForm: true,
		id: 'edit-billingaddress-form-id',
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			loading = false;
			if (result.type == 'success') {
				isEditModeBillingAddress = false;

				showModal = false;
				closeModal();
			}
		},

		onError({ result }) {
			console.log('billingAddress form new/edit --> Superform On Error --> ', result.error.message);
		}
	});
	/// New/Edit Address Form
	const {
		form: addressForm,
		errors: addressErrors,
		enhance: addressEnhance,
		constraints: addressConstraints
	} = superForm(data.addressForm, {
		resetForm: true,
		id: 'edit-address-form-id',
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			loading = false;
			if (result.type == 'success') {
				isEditModeAddress = false;
				showModal = false;
				closeModal();
			}
		},
		onError({ result }) {
			console.log('Address form new/edit --> Superform On Error --> ', result.error.message);
		}
	});
	/// New/Edit Bank Account Form
	const {
		form: bankAccountForm,
		formId: bankAccountFormId,
		errors: bankAccountErrors,
		enhance: bankAccountEnhance,
		constraints: bankAccountConstraints
	} = superForm(data.bankAccountForm, {
		resetForm: true,
		applyAction: false,
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			loading = false;
			if (result.type == 'success') {
				showModal = false;
				isEditingRow = '';
				closeModal();
			}
		},
		onError({ result }) {
			console.log('Bank Account new form --> Superform On Error --> ', result.error.message);
		}
	});

	/// New Bank Card Form
	const {
		form: bankCardForm,
		formId: bankCardFormId,
		errors: bankCardErrors,
		enhance: bankCardEnhance,
		constraints: bankCardConstraints
	} = superForm(data.bankCardForm, {
		resetForm: true,
		applyAction: false,
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			loading = false;
			if (result.type == 'success') {
				showModal = false;
				isEditingRow = '';
				closeModal();
			}
		},
		onError({ result }) {
			console.log('Bank Card new form --> Superform On Error --> ', result.error.message);
		}
	});
	const items = [
		'https://picsum.photos/seed/picsum/256',
		'https://picsum.photos/seed/randim/256',
		'https://picsum.photos/seed/asñokih/256',
		'https://picsum.photos/seed/ñoijhua/256',
		'https://picsum.photos/seed/ñlzxjkn/256',
		'https://picsum.photos/seed/picsum/256',
		'https://picsum.photos/seed/pouh34sd/256',
		'https://picsum.photos/seed/zxcvaswFG/256'
	];
	let showModal = false;
	let closeModal: any;
	/// 0=ServicesProvided 1=WorkAvalibilities 2=BankAccounts 3=BankCards
	let modalMode = 0;
	/// isEditingModes
	let isEditModeBillingAddress = false;
	let isEditModeAddress = false;
	let isEditModeProfile = false;
	let isEditModeBio = false;
	let isEditModeAvatar = false;
	/* let isEditModePhotos = false; */
	let isEditingRow = '';

	// User Avatar change
	$: avatar = `${env.PUBLIC_BACKEND_URL}/api/files/_pb_users_auth_/${user?.id}/${user?.avatar}`;
	let inputSelectedFile: any;
	let imageNewFile: any;
	function onChangeProfileAvatar() {
		const file = inputSelectedFile.files[0];
		if (file) {
			if (file.size > 0) {
				isEditModeAvatar = true;
				const reader = new FileReader();
				reader.addEventListener('load', function () {
					imageNewFile.setAttribute('src', reader.result);
				});
				reader.readAsDataURL(file);
				return;
			}
		}
		isEditModeAvatar = false;
	}
</script>

<Modal class="card rounded-lg" bind:showModal bind:closeDialog={closeModal}>
	<header class="card-header text-2xl font-bold p-2 dark:text-white">
		{modalMode == 0
			? 'New Service'
			: modalMode == 1
			? 'New Work availability'
			: modalMode == 2
			? 'New Bank Account'
			: modalMode == 3
			? 'New Bank Card'
			: modalMode == 4
			? 'Change Email Address'
			: modalMode == 5
			? 'Change Role'
			: 'Change Password'}
	</header>
	{#if modalMode == 0}
		<form
			method="POST"
			id="new-service"
			class="p-4 space-y-2"
			use:servicesprovidedEnhance
			action="?/newservice"
		>
			<input name="id" class="hidden" type="text" value={user.id} />
			<label class="label uppercase tracking-wide font-bold dark:text-white" for="service">
				<span class="pl-1">Service</span>
				<select
					class="select"
					name={'service'}
					size="1"
					bind:value={$servicesprovidedForm.service}
					aria-invalid={$servicesprovidedForm.service ? 'true' : undefined}
					{...$servicesprovidedConstraints.service}
				>
					<option value={ServiceServiceOptions.BABYSITTER}>Baby Sitter</option>
					<option value={ServiceServiceOptions.CHAT}>Chat and Company</option>
					<option value={ServiceServiceOptions.DRIVEWAYCLEAN}>Driveway cleaning</option>
					<option value={ServiceServiceOptions.GARDENER}>Gardener</option>
					<option value={ServiceServiceOptions.HOMECLEAN}>Home cleaning</option>
				</select>
				{#if $servicesprovidedErrors.service}
					<span class="block text-red-600 dark:text-red-500">{$servicesprovidedErrors.service}</span
					>
				{/if}
			</label>
			<label class="label uppercase tracking-wide font-bold dark:text-white" for="hourlyRate">
				<span class="pl-1">Hourly Rate</span>
				<input
					type="number"
					name="hourlyRate"
					class="input"
					step="any"
					bind:value={$servicesprovidedForm.hourlyRate}
					aria-invalid={$servicesprovidedForm.hourlyRate ? 'true' : undefined}
					{...$servicesprovidedConstraints.hourlyRate}
				/>
				{#if $servicesprovidedErrors.hourlyRate}
					<span class="block text-red-600 dark:text-red-500">
						{$servicesprovidedErrors.hourlyRate}
					</span>
				{/if}
			</label>
			<button type="submit" class="btn my-2 btn-lg variant-filled-warning">Submit</button>
			<button
				class="btn my-2 btn-lg variant-filled-error"
				type="button"
				on:click|preventDefault={closeModal()}
			>
				Cancel
			</button>
		</form>
	{:else if modalMode == 1}
		<form
			method="POST"
			id="new-availability"
			class="p-4 space-y-2"
			use:availabilityEnhance
			action="?/newavailability"
		>
			<input name="id" class="hidden" type="text" value={user.id} />
			<label class="label uppercase tracking-wide font-bold dark:text-white" for="weekday">
				<span class="pl-1">Weekday</span>
				<select
					class="select"
					name="weekday"
					size="1"
					bind:value={$availabilityForm.weekday}
					aria-invalid={$availabilityForm.weekday ? 'true' : undefined}
					{...$availabilityConstraints.weekday}
				>
					<option value="EVERYDAY">Everyday</option>
					<option value="SUNDAY">Sunday</option>
					<option value="MONDAY">Monday</option>
					<option value="TUESDAY">Tuesday</option>
					<option value="WEDNESDAY">Wednesday</option>
					<option value="THURSDAY">Thursday</option>
					<option value="FRIDAY">Friday</option>
					<option value="SATURDAY">Saturday</option>
				</select>
				{#if $availabilityErrors.weekday}
					<span class="block text-red-600 dark:text-red-500">
						{$availabilityErrors.weekday}
					</span>
				{/if}
			</label>
			<label class="label uppercase tracking-wide font-bold dark:text-white" for="start">
				<span class="pl-1">Start</span>
				<input
					name="start"
					type="time"
					class="input"
					pattern="[0-9]{2}:[0-9]{2}"
					bind:value={$availabilityForm.start}
					aria-invalid={$availabilityForm.start ? 'true' : undefined}
					{...$availabilityConstraints.start}
				/>
				{#if $availabilityErrors.start}
					<span class="block text-red-600 dark:text-red-500">{$availabilityErrors.start}</span>
				{/if}
			</label>
			<label class="label uppercase tracking-wide font-bold dark:text-white" for="end">
				<span class="pl-1">End</span>
				<input
					type="time"
					name="end"
					class="input"
					pattern="[0-9]{2}:[0-9]{2}"
					bind:value={$availabilityForm.end}
					aria-invalid={$availabilityForm.end ? 'true' : undefined}
					{...$availabilityConstraints.end}
				/>
				{#if $availabilityErrors.end}
					<span class="block text-red-600 dark:text-red-500">
						{$availabilityErrors.end}
					</span>
				{/if}
			</label>
			<button type="submit" class="btn my-2 btn-lg variant-filled-warning">Submit</button>
			<button
				class="btn my-2 btn-lg variant-filled-error"
				type="button"
				on:click|preventDefault={closeModal()}>Cancel</button
			>
		</form>
	{:else if modalMode == 2}
		<form
			method="POST"
			id="new-bankaccount"
			class="p-4 space-y-2"
			use:bankAccountEnhance
			action="?/newbankaccount"
		>
			<input name="id" class="hidden" type="text" value={user.id} />
			<input type="hidden" name="__superform_id" bind:value={$bankAccountFormId} />
			<label class="label uppercase tracking-wide font-bold dark:text-white" for="firstName">
				<span class="pl-1">First Name</span>
				<input
					type="text"
					name="firstName"
					class="input"
					bind:value={$bankAccountForm.firstName}
					aria-invalid={$bankAccountForm.firstName ? 'true' : undefined}
					{...$bankAccountConstraints.firstName}
				/>
				{#if $bankAccountErrors.firstName}
					<span class="block text-red-600 dark:text-red-500">
						{$bankAccountErrors.firstName}
					</span>
				{/if}
			</label>
			<label class="label uppercase tracking-wide font-bold dark:text-white" for="lastName">
				<span class="pl-1">Last Name</span>
				<input
					type="text"
					name="lastName"
					class="input"
					bind:value={$bankAccountForm.lastName}
					aria-invalid={$bankAccountForm.lastName ? 'true' : undefined}
					{...$bankAccountConstraints.lastName}
				/>
				{#if $bankAccountErrors.lastName}
					<span class="block text-red-600 dark:text-red-500">
						{$bankAccountErrors.lastName}
					</span>
				{/if}
			</label>
			<label class="label uppercase tracking-wide font-bold dark:text-white" for="accountNumber">
				<span class="pl-1">Account Number</span>
				<input
					type="text"
					name="accountNumber"
					class="input"
					bind:value={$bankAccountForm.accountNumber}
					aria-invalid={$bankAccountForm.accountNumber ? 'true' : undefined}
					{...$bankAccountConstraints.accountNumber}
				/>
				{#if $bankAccountErrors.accountNumber}
					<span class="block text-red-600 dark:text-red-500">
						{$bankAccountErrors.accountNumber}
					</span>
				{/if}
			</label>
			<button type="submit" class="btn my-2 btn-lg variant-filled-warning">Submit</button>
			<button
				class="btn my-2 btn-lg variant-filled-error"
				type="button"
				on:click|preventDefault={closeModal()}
			>
				Cancel
			</button>
		</form>
	{:else if modalMode == 3}
		<form
			method="POST"
			id="new-bankCard"
			class="p-4 space-y-2"
			use:bankCardEnhance
			action="?/newbankcard"
		>
			<input name="id" class="hidden" type="text" value={user.id} />
			<input type="hidden" name="__superform_id" bind:value={$bankCardFormId} />
			<label class="label uppercase tracking-wide font-bold dark:text-white" for="firstName">
				<span class="pl-1">First Name</span>
				<input
					type="text"
					name="firstName"
					class="input"
					bind:value={$bankCardForm.firstName}
					aria-invalid={$bankCardForm.firstName ? 'true' : undefined}
					{...$bankCardConstraints.firstName}
				/>
				{#if $bankCardErrors.firstName}
					<span class="block text-red-600 dark:text-red-500">
						{$bankCardErrors.firstName}
					</span>
				{/if}
			</label>
			<label class="label uppercase tracking-wide font-bold dark:text-white" for="lastName">
				<span class="pl-1">Last Name</span>
				<input
					type="text"
					name="lastName"
					class="input"
					bind:value={$bankCardForm.lastName}
					aria-invalid={$bankCardForm.lastName ? 'true' : undefined}
					{...$bankCardConstraints.lastName}
				/>
				{#if $bankCardErrors.lastName}
					<span class="block text-red-600 dark:text-red-500">
						{$bankCardErrors.lastName}
					</span>
				{/if}
			</label>
			<label class="label uppercase tracking-wide font-bold dark:text-white" for="cardNumber">
				<span class="pl-1">Card Number</span>
				<input
					type="number"
					name="cardNumber"
					class="input"
					bind:value={$bankCardForm.cardNumber}
					aria-invalid={$bankCardForm.cardNumber ? 'true' : undefined}
					{...$bankCardConstraints.cardNumber}
				/>
				{#if $bankCardErrors.cardNumber}
					<span class="block text-red-600 dark:text-red-500">
						{$bankCardErrors.cardNumber}
					</span>
				{/if}
			</label>
			<label class="label uppercase tracking-wide font-bold dark:text-white" for="cvc">
				<span class="pl-1">CVC</span>
				<input
					type="number"
					name="cvc"
					class="input"
					bind:value={$bankCardForm.cvc}
					aria-invalid={$bankCardForm.cvc ? 'true' : undefined}
					{...$bankCardConstraints.cvc}
				/>
				{#if $bankCardErrors.cvc}
					<span class="block text-red-600 dark:text-red-500">
						{$bankCardErrors.cvc}
					</span>
				{/if}
			</label>
			<div
				class="label uppercase tracking-wide font-bold dark:text-white flex flex-row gap-2 justify-center items-center"
			>
				<p class="">MM</p>
				<input
					type="number"
					name="month"
					class="input"
					bind:value={$bankCardForm.month}
					aria-invalid={$bankCardForm.month ? 'true' : undefined}
					{...$bankCardConstraints.month}
				/>
				<p class="">YY</p>
				<input
					type="number"
					name="year"
					class="input"
					bind:value={$bankCardForm.year}
					aria-invalid={$bankCardForm.year ? 'true' : undefined}
					{...$bankCardConstraints.year}
				/>
				{#if $bankCardErrors.month}
					<span class="block text-red-600 dark:text-red-500">
						{$bankCardErrors.month}
					</span>
				{/if}
				{#if $bankCardErrors.year}
					<span class="block text-red-600 dark:text-red-500">
						{$bankCardErrors.year}
					</span>
				{/if}
			</div>
			<button type="submit" class="btn my-2 btn-lg variant-filled-warning">Submit</button>
			<button
				class="btn my-2 btn-lg variant-filled-error"
				type="button"
				on:click|preventDefault={closeModal()}>Cancel</button
			>
		</form>
	{:else if modalMode == 4}
		<form method="POST" class="p-4" action="?/changeemail" use:changeEmailEnhance>
			<input name="id" class="hidden" type="text" value={user.id} />
			<label class="label uppercase tracking-wide font-bold" for="email">
				<span class="pl-1">Email</span>
				<input
					type="email"
					name="email"
					class="input variant-ghost-surface"
					bind:value={$changeEmailForm.email}
					aria-invalid={$changeEmailErrors.email ? 'true' : undefined}
					{...$changeEmailConstraints.email}
				/>
				{#if $changeEmailErrors.email}
					<span class="block text-red-600 dark:text-red-500">{$changeEmailErrors.email}</span>
				{/if}
			</label>
			<button type="submit" class="btn my-2 btn-lg variant-filled-warning">Submit</button>
			<button
				class="btn my-2 btn-lg variant-filled-error"
				type="button"
				on:click|preventDefault={closeModal()}
			>
				Cancel
			</button>
		</form>
	{:else if modalMode == 5}
		<form method="POST" class="p-4" action="?/changerole" use:changeRoleEnhance>
			<input name="id" class="hidden" type="text" value={user.id} />
			<label class="label uppercase tracking-wide font-bold" for="role">
				<span class="pl-1">Role</span>
				<select
					class="select"
					name="role"
					bind:value={$changeRoleForm.role}
					aria-invalid={$changeRoleErrors.role ? 'true' : undefined}
					{...$changeRoleConstraints.role}
				>
					<option value="USER">User</option>
					<option value="WORKER">Worker</option>
				</select>
				{#if $changeRoleErrors.role}
					<span class="block text-red-600 dark:text-red-500">{$changeRoleErrors.role}</span>
				{/if}
			</label>
			<button type="submit" class="btn my-2 btn-lg variant-filled-warning">Submit</button>
			<button
				class="btn my-2 btn-lg variant-filled-error"
				type="button"
				on:click|preventDefault={closeModal()}
			>
				Cancel
			</button>
		</form>
	{:else if modalMode == 6}
		<form method="POST" class="p-4" action="?/changepassword" use:changePasswordEnhance>
			<input name="id" class="hidden" type="text" value={user.id} />
			<label class="" for="password">Current Password</label>
			<div class="col-span-1 md:col-span-1">
				<input
					type="password"
					name="oldPassword"
					class="input"
					bind:value={$changePasswordForm.oldPassword}
					aria-invalid={$changePasswordErrors.oldPassword ? 'true' : undefined}
					{...$changePasswordConstraints.oldPassword}
				/>
				{#if $changePasswordErrors.oldPassword}
					<span class="block text-red-600 dark:text-red-500"
						>{$changePasswordErrors.oldPassword}</span
					>
				{/if}
			</div>
			<label class="label" for="password">New Password</label>

			<div class="col-span-1 md:col-span-1">
				<input
					type="password"
					name="password"
					class="input"
					bind:value={$changePasswordForm.password}
					aria-invalid={$changePasswordErrors.password ? 'true' : undefined}
					{...$changePasswordConstraints.password}
				/>
				{#if $changePasswordErrors.password}
					<span class="block text-red-600 dark:text-red-500">{$changePasswordErrors.password}</span>
				{/if}
			</div>
			<label class="label" for="passwordConfirm">Confirm Password</label>

			<div class="col-span-1 md:col-span-1">
				<input
					type="password"
					name="passwordConfirm"
					class="input"
					bind:value={$changePasswordForm.passwordConfirm}
					aria-invalid={$changePasswordErrors.passwordConfirm ? 'true' : undefined}
					{...$changePasswordConstraints.passwordConfirm}
				/>
				{#if $changePasswordErrors.passwordConfirm}
					<span class="text-red-600 dark:text-red-500">{$changePasswordErrors.passwordConfirm}</span
					>
				{/if}
			</div>
			<button type="submit" class="btn my-2 btn-lg variant-filled-warning">Submit</button>
			<button
				class="btn my-2 btn-lg variant-filled-error"
				type="button"
				on:click|preventDefault={closeModal()}
			>
				Cancel
			</button>
		</form>
	{:else}
		<h4 class="h4">Error</h4>
	{/if}
</Modal>
{#if loading}
	<div id="cover-spin" />
{/if}
<section class="min-h-[80%] grid grid-cols-1 lg:grid-cols-12 gap-2 p-2">
	<!-- Left Side Top: Avatar +  Full Name + Address(City, Country) + Bio + Photos + Rating + Reviews -->
	<div class="col-span-1 md:col-span-7 flex flex-col space-y-2 w-full">
		<!-- Left Side Top: Avatar +  Full Name + Address(City, Country) -->
		<div class="card variant-filled-surface/50 p-4 w-full">
			{#if isEditModeProfile}
				<div class="card-header p-0 flex flex-row items-center justify-between">
					<h4 class="col-span-1 h4">Profile</h4>
					<div class="flex flex-row justify-end items-center gap-2">
						<button
							class="flex flex-row gap-2 pl-2 items-start justify-start text-green-600"
							type="submit"
							form="edit-profile"
						>
							<Save />
							<p>Save</p>
						</button>
						<button
							class="flex flex-row gap-2 items-start justify-start text-red-500"
							on:click={() => {
								isEditModeProfile = false;
							}}
						>
							<XSquare />
							<p>Cancel</p>
						</button>
					</div>
				</div>
			{:else}
				<div class="card-header p-0 flex flex-row items-center justify-between">
					<h4 class="col-span-1 h4">Profile</h4>
					<button
						class="col-span-1 flex flex-row gap-2 items-start justify-start text-blue-500"
						on:click={() => {
							isEditModeProfile = true;
						}}
					>
						<Pencil />
						<p>Edit</p>
					</button>
				</div>
			{/if}
			<div class="flex items-center flex-col sm:flex-row justify-evenly">
				{#if isEditModeProfile}
					<form
						method="POST"
						id="edit-profile"
						class="grid grid-cols-2 lg:grid-cols-4 gap-2 p-2 w-full"
						action="?/editprofile"
						use:profileEnhance
					>
						<input name="id" class="hidden" type="text" value={user.id} />
						<label class="col-span-1" for="firstName"> First Name</label>
						<div class="col-span-1 md:col-span-1">
							<input
								type="text"
								name="firstName"
								class="input"
								bind:value={$profileForm.firstName}
								aria-invalid={$profileErrors.firstName ? 'true' : undefined}
								{...$profileConstraints.firstName}
							/>
							{#if $profileErrors.firstName}
								<span class="block text-red-600 dark:text-red-500">{$profileErrors.firstName}</span>
							{/if}
						</div>
						<label class="col-span-1" for="firstName"> Last Name</label>
						<div class="col-span-1 md:col-span-1">
							<input
								type="text"
								name="lastName"
								class="input"
								bind:value={$profileForm.lastName}
								aria-invalid={$profileErrors.lastName ? 'true' : undefined}
								{...$profileConstraints.lastName}
							/>
							{#if $profileErrors.lastName}
								<span class="block text-red-600 dark:text-red-500">{$profileErrors.lastName}</span>
							{/if}
						</div>

						<label class="" for="dateOfBirth">Date of Birth</label>
						<div class="col-span-1 md:col-span-1">
							<DateInput
								bind:value={$profileForm.dateOfBirth}
								min={minDate}
								max={currDateNow}
								format="dd-MM-yyyy"
								closeOnSelection={true}
								placeholder={'Date of birth...'}
								class="input"
							/>
							{#if $profileErrors.dateOfBirth}
								<span class="block text-red-600 dark:text-red-500">
									{$profileErrors.dateOfBirth}
								</span>
							{/if}
						</div>

						{#if user.role == UsersRoleOptions.WORKER}
							<label class="col-span-1" for="workRange"> Work Range</label>
							<div class="col-span-1 md:col-span-1">
								<input
									type="number"
									name="workRange"
									class="input"
									bind:value={$profileForm.workRange}
									aria-invalid={$profileErrors.workRange ? 'true' : undefined}
									{...$profileConstraints.workRange}
								/>
								{#if $profileErrors.workRange}
									<span class="block text-red-600 dark:text-red-500"
										>{$profileErrors.workRange}</span
									>
								{/if}
							</div>
						{/if}
					</form>
				{:else}
					<div class="flex flex-col justify-center items-center">
						{#if isEditModeAvatar}
							<img
								bind:this={imageNewFile}
								src=""
								alt="Preview"
								class="w-40 h-40 m-auto rounded-lg shadow"
							/>
						{:else}
							<Avatar
								src={avatar}
								width="w-48"
								height="h-48"
								class="block m-3"
								initials={`${user?.firstName[0] ?? 'X'}${user?.lastName[0] ?? 'Y'}`}
								rounded="rounded-md"
							/>
						{/if}
						<form
							action="?/editavatar"
							method="post"
							id="users-photos-upload"
							enctype="multipart/form-data"
							class="flex flex-col p-0 m-0 jusitfy center items-center"
							use:changeAvatarEnhance
						>
							<input name="id" class="hidden" type="text" value={user.id} />
							<input
								class="input"
								type="file"
								name="avatar"
								accept="image/png,image/jpeg,image/jpg"
								bind:this={inputSelectedFile}
								on:change={onChangeProfileAvatar}
							/>
							{#if $changeAvatarErrors.avatar}
								<span class="block text-red-600 dark:text-red-500">
									{$changeAvatarErrors.avatar}
								</span>
							{/if}
							{#if isEditModeAvatar}
								<div class="flex flex-row justify-end items-center gap-2 pt-2">
									<button
										class="flex flex-row gap-2 pl-2 items-start justify-start text-green-600"
										type="submit"
										form="users-photos-upload"
									>
										<Save />
										<p>Save</p>
									</button>
									<button
										class="flex flex-row gap-2 items-start justify-start text-red-500"
										on:click={() => {
											isEditModeAvatar = false;
										}}
									>
										<XSquare />
										<p>Cancel</p>
									</button>
								</div>
							{/if}
						</form>
					</div>

					<div
						class="pt-6 text-base leading-6 flex flex-col justify-center items-start sm:text-lg md:leading-7"
					>
						<p class="text-center sm:text-left">
							{user?.firstName ?? '-'}
							{user?.lastName ?? '-'}
						</p>
						<p class="text-center sm:text-left">
							Birthdate: {isNaN(Date.parse(user?.dateOfBirth))
								? 'Missing'
								: new Date(user?.dateOfBirth).toLocaleString(undefined, {
										day: 'numeric',
										month: 'short',
										year: 'numeric'
								  })}
						</p>
						<p class="text-center sm:text-left">
							Age: {calculateAge(user?.dateOfBirth ?? '-')}
						</p>
						<div class="flex flex-row justify-start items-center">
							<p class="text-center sm:text-left">Password: **********</p>
							<button
								class="flex flex-row gap-2 pl-2 items-start justify-start text-blue-500"
								on:click={() => {
									modalMode = 6;
									showModal = true;
								}}
							>
								<Pencil />
								<div class="h4">Change Password</div>
							</button>
						</div>
						<div class="flex flex-row justify-start items-center">
							<p class="text-center sm:text-left">Role: {user?.role ?? '-'}</p>
							<button
								class="flex flex-row gap-2 pl-2 items-start justify-start text-blue-500"
								on:click={() => {
									modalMode = 5;
									showModal = true;
								}}
							>
								<Pencil />
								<div class="h4">Change Role</div>
							</button>
						</div>

						<div class="flex flex-row justify-start items-center">
							<p class="text-center sm:text-left">{user?.email ?? '-'}</p>
							<button
								class="flex flex-row gap-2 pl-2 items-start justify-start text-blue-500"
								on:click={() => {
									modalMode = 4;
									showModal = true;
								}}
							>
								<Pencil />
								<div class="h4">Change Email</div>
							</button>
						</div>
						{#if user.role == UsersRoleOptions.WORKER}
							<p class="text-center sm:text-left">Work Range: {user?.workRange ?? '-'}m</p>
							<p class="text-center sm:text-left">
								Min Pay: {findLowestPayPerHour(user?.expand?.services ?? [], user.currency)}
							</p>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- Left Side Middle: Bio + Photos  -->
		<div class="card variant-filled-surface/50 p-4 w-full">
			<!-- Bio -->
			{#if isEditModeBio}
				<div class="card-header p-0 flex flex-row items-center justify-between">
					<h4 class="col-span-1 h4">Introduction</h4>
					<div class="flex flex-row">
						<button
							class="col-span-1 flex flex-row gap-2 pl-2 items-start justify-start text-green-600"
							type="submit"
							form="edit-bio-form"
						>
							<Save />
							<p>Save</p>
						</button>
						<button
							class="col-span-1 flex flex-row gap-2 pl-2 items-start justify-start text-red-500"
							on:click={() => {
								isEditModeBio = false;
							}}
						>
							<XSquare />
							<p>Cancel</p>
						</button>
					</div>
				</div>
				<form method="POST" class="" id="edit-bio-form" action="?/editbio" use:changeBioEnhance>
					<input name="id" class="hidden" type="text" value={user.id} />
					<label class="label">
						<span>Bio</span>
						<textarea
							class="textarea"
							name="bio"
							rows="4"
							bind:value={$changeBioForm.bio}
							placeholder="Write your short introduction text"
							aria-invalid={$changeBioErrors.bio ? 'true' : undefined}
							{...$changeBioConstraints.bio}
						/>
					</label>
					{#if $changeBioErrors.bio}
						<span class="block text-red-600 dark:text-red-500">
							{$changeBioErrors.bio}
						</span>
					{/if}
				</form>
			{:else}
				<div class="card-header p-0 flex flex-row items-center justify-between">
					<h4 class="col-span-1 h4">Introduction</h4>
					<button
						class="col-span-1 flex flex-row gap-2 items-start justify-start text-blue-500"
						on:click={() => {
							isEditModeBio = true;
						}}
					>
						<Pencil />
						<p>Edit</p>
					</button>
				</div>
				<div class="">
					<p class="text-lg pt-4">
						{@html user.bio}
					</p>
				</div>
			{/if}
		</div>
		<!-- <div class="card variant-filled-surface/50 p-4 w-full min-h-[175px]">
			{#if isEditModePhotos}
				<div class="card-header p-0 flex flex-row items-center justify-between">
					<h4 class="col-span-1 h4">Photos</h4>
					<button
						class="col-span-1 flex flex-row gap-2 items-start justify-start text-red-500"
						on:click={() => {
							isEditModePhotos = false;
						}}
					>
						<XSquare />
						<p>Cancel</p>
					</button>
				</div>
				<div class="edit-mode">
					
					<div class="p-4">
						{#each user.photos as photo}
							<div class="flex flex-row py-2">
								<img
									src={`${PUBLIC_BACKEND_URL}/api/files/_pb_users_auth_/${user.id}/${photo}?thumb=64x64`}
									alt=""
									class="rounded-md w-[64px] h-[64px]"
								/>

								<div class="flex flex-col pl-4">
									<p>Name: -----</p>
									<p>Size: -----</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div class="card-header p-0 flex flex-row items-center justify-between">
					<h4 class="col-span-1 h4">Photos</h4>
					<button
						class="col-span-1 flex flex-row gap-2 items-start justify-start text-blue-500"
						on:click={() => {
							isEditModePhotos = true;
						}}
					>
						<Pencil />
						<p>Edit</p>
					</button>
				</div>
				<div class="relative space-y-1 pt-3">
					{#if user.photos.length > 0}
						<TinySlider gap="0.4em" fill={false}>
							{#each user.photos as photo}
								<img
									src={`${PUBLIC_BACKEND_URL}/api/files/_pb_users_auth_/${user.id}/${photo}`}
									alt=""
									class="rounded-md"
								/>
							{/each}

							<div slot="controls" class="thumbnails grid" let:setIndex let:currentIndex>
								{#each user.photos as photoThumb, i}
									<button
										class="thumbnail"
										class:active={i == currentIndex}
										on:click={() => setIndex(i)}
										on:focus={() => setIndex(i)}
									>
										<img
											src={`${PUBLIC_BACKEND_URL}/api/files/_pb_users_auth_/${user.id}/${photoThumb}?thumb=64x64`}
											alt=""
											height="64px"
											width="64px"
										/>
									</button>
								{/each}
							</div>
						</TinySlider>
					{:else}
						<p class="text-lg">No Photos available</p>
					{/if}
				</div>
			{/if}
		</div> -->
		{#if user.role == UsersRoleOptions.WORKER}
			<!-- Services Provided by the worker -->

			<div class="card variant-filled-surface/50 w-full">
				<div class="card-header">
					<h4 class="h4 p-0">Services Provided</h4>
					<div class="grid grid-cols-4 divide-x divide-slate-700">
						<div class="py-1 text-center p-4">Service</div>
						<div class="py-1 text-center p-4">Hourly Rate</div>
						<div class="py-1 text-center p-4">Last Updated</div>
						<button
							class="flex flex-row gap-2 pl-2 items-start justify-start text-orange-500"
							on:click={() => {
								modalMode = 0;
								showModal = true;
							}}
						>
							<PlusSquareIcon />
							<p>New</p>
						</button>
					</div>
				</div>

				{#if user.expand?.services}
					{#each user.expand?.services as service}
						{#if isEditingRow === service.id}
							<form
								method="POST"
								id="edit-services"
								class="grid grid-cols-4 gap-2 p-2 items-center justify-center"
								action="?/editservice"
								use:servicesprovidedEnhance
							>
								<input type="hidden" name="__superform_id" bind:value={$servicesprovidedFormId} />
								<input name="id" class="hidden col-span-0" type="text" value={service.id} />
								<label class="label col-span-1">
									<select class="input" name={'service'} size="1" value={service.service}>
										<option value={ServiceServiceOptions.BABYSITTER}>Baby Sitter</option>
										<option value={ServiceServiceOptions.CHAT}>Chat and Company</option>
										<option value={ServiceServiceOptions.DRIVEWAYCLEAN}>Driveway cleaning</option>
										<option value={ServiceServiceOptions.GARDENER}>Gardener</option>
										<option value={ServiceServiceOptions.HOMECLEAN}>Home cleaning</option>
									</select>
									{#if $servicesprovidedErrors.service}
										<span class="block text-red-600 dark:text-red-500"
											>{$servicesprovidedErrors.service}</span
										>
									{/if}
								</label>
								<label class="label col-span-1">
									<input
										id={'hourlyRate-' + service.id}
										type="text"
										name="hourlyRate"
										step="any"
										class="w-full input"
										value={service.hourlyRate}
									/>
									{#if $servicesprovidedErrors.hourlyRate}
										<span class="block text-red-600 dark:text-red-500">
											{$servicesprovidedErrors.hourlyRate}
										</span>
									{/if}
								</label>

								<div class="col-span-2 flex flex-col lg:flex-row justify-center items-center gap-2">
									<button
										class="flex flex-row items-center justify-center gap-1 text-green-600"
										form="edit-services"
										type="submit"
									>
										<Save />
										<p>Save</p>
									</button>

									<form method="POST" id="delete-services" action="?/deleteservice" use:enhance>
										<input type="hidden" name="id" value={service.id} />
										<button
											class="flex flex-row items-center justify-center gap-1 text-red-600"
											form="delete-services"
											type="submit"
										>
											<Trash />
											<p>Delete</p>
										</button>
									</form>
									<button
										class="flex flex-row items-center justify-center gap-1 text-orange-600"
										type="button"
										on:click={() => {
											isEditingRow = '';
										}}
									>
										<XSquare />
										<p>Cancel</p>
									</button>
								</div>
							</form>
						{:else}
							<div class="grid grid-cols-4 gap-2 p-2 items-center justify-center">
								<p class="col-span-1 text-center">{service.service}</p>
								<p class="col-span-1 text-center">{service.hourlyRate}</p>
								<p class="col-span-1 text-center">
									{new Date(service.updated ?? '-').toLocaleTimeString(undefined, {
										hour: '2-digit',
										minute: '2-digit',
										day: 'numeric',
										weekday: 'short',
										month: 'short'
									})}
								</p>
								<button
									class="col-span-1 w-full flex flex-row gap-2 items-start justify-start text-blue-500"
									on:click={() => {
										isEditingRow = service.id;
									}}
								>
									<Pencil />
									<p>Edit</p>
								</button>
							</div>
						{/if}
					{:else}
						<p class="text-lg p-2">No Services found</p>
					{/each}
				{:else}
					<p class="text-lg p-2">No Services found</p>
				{/if}
			</div>
			<!-- Avability or Working hours for user -->
			<div class="card variant-filled-surface/50 w-full">
				<div class="card-header">
					<h4 class="h4 p-0">Work Availability</h4>
					<div class="grid grid-cols-4 divide-x divide-slate-700">
						<div class="py-1 text-center p-4" contenteditable="false">Work Day</div>
						<div class="py-1 text-center p-4" contenteditable="false">Start Time</div>
						<div class="py-1 text-center p-4" contenteditable="false">End Time</div>
						<button
							class="flex flex-row gap-2 pl-2 items-start justify-start text-orange-500"
							type="button"
							on:click={() => {
								modalMode = 1;
								showModal = true;
							}}
						>
							<PlusSquareIcon />
							<p>New</p>
						</button>
					</div>
				</div>

				{#if user.expand?.availabilities}
					{#each user.expand?.availabilities as availability}
						{#if isEditingRow === availability.id}
							<form
								method="POST"
								id="edit-availabilities"
								class="grid grid-cols-4 gap-2 p-2 items-center justify-center"
								action="?/editavailability"
								use:availabilityEnhance
							>
								<input type="hidden" name="__superform_id" bind:value={$availabilityFormId} />
								<input name="id" class="hidden col-span-0" type="text" value={availability.id} />
								<label class="label col-span-1">
									<select
										class="input"
										size="1"
										name="weekday"
										value={availability.weekday}
										aria-invalid={$availabilityForm.weekday ? 'true' : undefined}
										{...$availabilityConstraints.weekday}
									>
										<option value="EVERYDAY">Everyday</option>
										<option value="SUNDAY">Sunday</option>
										<option value="MONDAY">Monday</option>
										<option value="TUESDAY">Tuesday</option>
										<option value="WEDNESDAY">Wednesday</option>
										<option value="THURSDAY">Thursday</option>
										<option value="FRIDAY">Friday</option>
										<option value="SATURDAY">Saturday</option>
									</select>
									{#if $availabilityErrors.weekday}
										<span class="block text-red-600 dark:text-red-500">
											{$availabilityErrors.weekday}
										</span>
									{/if}
								</label>
								<label class="label" for="start">
									<input
										id={'start-time-' + availability.id}
										type="time"
										name="start"
										class="w-full input"
										pattern="[0-9]{2}:[0-9]{2}"
										aria-invalid={$availabilityForm.start ? 'true' : undefined}
										{...$availabilityConstraints.start}
										value={convertTo24Hour(availability.start)}
									/>{#if $availabilityErrors.start}
										<span class="block text-red-600 dark:text-red-500">
											{$availabilityErrors.start}
										</span>
									{/if}
								</label>
								<label class="label" for="end">
									<input
										id={'end-time' + availability.id}
										type="time"
										name="end"
										class="w-full input"
										min="00:00"
										max="24:00"
										pattern="[0-9]{2}:[0-9]{2}"
										aria-invalid={$availabilityForm.end ? 'true' : undefined}
										{...$availabilityConstraints.end}
										value={convertTo24Hour(availability.end)}
									/>
									{#if $availabilityErrors.end}
										<span class="block text-red-600 dark:text-red-500">
											{$availabilityErrors.end}
										</span>
									{/if}
								</label>
								<div class="flex flex-col lg:flex-row justify-start items-start gap-1">
									<button
										class="flex flex-row items-center justify-center gap-1 text-green-600"
										type="submit"
										form="edit-availabilities"
									>
										<Save />
										<p>Save</p>
									</button>
									<form
										method="POST"
										id="delete-availabilities"
										action="?/deleteavailability"
										use:enhance
									>
										<input type="hidden" name="id" value={availability.id} />
										<button
											class="delete flex flex-row items-center justify-center gap-1 text-red-600"
											type="submit"
											form="delete-availabilities"
										>
											<Trash />
											<p>Delete</p>
										</button>
									</form>
									<button
										class="delete flex flex-row items-center justify-center gap-1 text-orange-600"
										type="button"
										on:click={() => {
											isEditingRow = '';
										}}
									>
										<XSquare />
										<p>Cancel</p>
									</button>
								</div>
							</form>
						{:else}
							<div class="grid grid-cols-4 gap-2 p-2 items-center justify-center">
								<p class="col-span-1 text-center">{covertToWorkWeekday(availability.weekday)}</p>
								<p class="col-span-1 text-center">{convertTo24Hour(availability.start)}</p>
								<p class="col-span-1 text-center">{convertTo24Hour(availability.end)}</p>
								<button
									class="col-span-1 w-full flex flex-row gap-2 items-start justify-start text-blue-500"
									type="button"
									on:click={() => {
										isEditingRow = availability.id;
									}}
								>
									<Pencil />
									<p>Edit</p>
								</button>
							</div>
						{/if}
					{:else}
						<p class="text-lg p-2">No Avabilities for work found</p>
					{/each}
				{:else}
					<p class="text-lg pt-4 p-2">No Avabilities for work found</p>
				{/if}
			</div>
		{/if}

		<!-- Left Side Bottom: Rating + Reviews  -->
		<div class="card variant-filled-surface/50 p-4 w-full min-h-[175px]">
			<!-- Rating -->
			<div class="card-header p-0 flex flex-row justify-between">
				<h4 class="h4">Ratings</h4>
				<h4 class="h4">- / 5</h4>
			</div>
			<p class="text-lg pt-4">No Reviews yet</p>
		</div>
	</div>
	<!-- Left Side Top: Billing Addrress + Address(City, Country) + Payment[Bank Accounts +  Bank Cards]-->
	<div class="col-span-1 md:col-span-5 flex flex-col space-y-2 w-full">
		<!-- Right Side Top: Billing Address(City, Country) + -->
		<div class="card variant-filled-surface/50 p-4 w-full">
			{#if isEditModeBillingAddress}
				<div class="card-header p-0 grid grid-cols-1 md:grid-cols-3">
					<h4 class="h4 col-span-1">Billing Address</h4>
					<button
						class="col-span-1 flex flex-row gap-2 pl-2 items-start justify-start text-green-600"
						type="submit"
						form="edit-billingaddress-form"
					>
						<Save />
						<p>Save</p>
					</button>
					<button
						class="col-span-1 flex flex-row gap-2 pl-2 items-start justify-start text-red-500"
						on:click={() => {
							isEditModeBillingAddress = false;
						}}
					>
						<XSquare />
						<p>Cancel</p>
					</button>
				</div>

				<form
					method="POST"
					class="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2"
					id="edit-billingaddress-form"
					action="?/editbillingaddress"
					use:billingAddressEnhance
				>
					<input name="id" class="hidden col-span-0" type="text" value={user.billingAddress} />
					<label class="col-span-1" for="addressLine1"> Address Line 1 </label>
					<div class="col-span-1 md:col-span-2">
						<input
							type="text"
							name="addressLine1"
							class="input"
							bind:value={$billingAddressForm.addressLine1}
							aria-invalid={$billingAddressErrors.addressLine1 ? 'true' : undefined}
							{...$billingAddressConstraints.addressLine1}
						/>
						{#if $billingAddressErrors.addressLine1}
							<span class="block text-red-600 dark:text-red-500">
								{$billingAddressErrors.addressLine1}
							</span>
						{/if}
					</div>
					<label class="col-span-1" for="city"> City </label>
					<div class="col-span-1 md:col-span-2">
						<input
							type="text"
							name="city"
							class="input"
							bind:value={$billingAddressForm.city}
							aria-invalid={$billingAddressErrors.city ? 'true' : undefined}
							{...$billingAddressConstraints.city}
						/>
						{#if $billingAddressErrors.city}
							<span class="block text-red-600 dark:text-red-500">{$billingAddressErrors.city}</span>
						{/if}
					</div>
					<label class="col-span-1" for="state">State</label>
					<div class="col-span-1 md:col-span-2">
						<input
							type="text"
							name="state"
							class="input"
							bind:value={$billingAddressForm.state}
							aria-invalid={$billingAddressErrors.state ? 'true' : undefined}
							{...$billingAddressConstraints.state}
						/>
						{#if $addressErrors.state}
							<span class="block text-red-600 dark:text-red-500">
								{$billingAddressErrors.state}
							</span>
						{/if}
					</div>
					<label class="" for="country">Country</label>
					<div class="col-span-1 md:col-span-2">
						<select
							name="country"
							class="select"
							bind:value={$billingAddressForm.country}
							aria-invalid={$billingAddressErrors.country ? 'true' : undefined}
							{...$billingAddressConstraints.country}
						>
							{#each countries as country}
								<option value={country}>{country}</option>
							{/each}
						</select>
						{#if $billingAddressErrors.country}
							<span class="block text-red-600 dark:text-red-500">
								{$billingAddressErrors.country}
							</span>
						{/if}
					</div>
					<label class="col-span-1" for="postCode">Post Code</label>
					<div class="col-span-1 md:col-span-2">
						<input
							type="text"
							name="postCode"
							class="input"
							bind:value={$billingAddressForm.postCode}
							aria-invalid={$billingAddressErrors.postCode ? 'true' : undefined}
							{...$billingAddressConstraints.postCode}
						/>
						{#if $billingAddressErrors.postCode}
							<span class="block text-red-600 dark:text-red-500">
								{$billingAddressErrors.postCode}
							</span>
						{/if}
					</div>
				</form>
			{:else}
				<div class="card-header p-0 grid grid-cols-1 md:grid-cols-3">
					<h4 class="col-span-1 h4">Billing Address</h4>
					<button
						class="col-span-1 flex flex-row gap-2 items-start justify-start text-blue-500"
						on:click={() => {
							isEditModeBillingAddress = true;
						}}
					>
						<Pencil />
						<p>Edit</p>
					</button>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
					<div class="col-span-1 opacity-70">Address Line 1</div>
					<div class="col-span-2">{user?.expand?.billingAddress?.addressLine1 ?? '-'}</div>
					<div class="col-span-1 opacity-70">City</div>
					<div class="col-span-2">{user?.expand?.billingAddress?.city ?? '-'}</div>
					<div class="col-span-1 opacity-70">State</div>
					<div class="col-span-2">{user?.expand?.billingAddress?.state ?? '-'}</div>
					<div class="col-span-1 opacity-70">Country</div>
					<div class="col-span-2">{user?.expand?.billingAddress?.country ?? '-'}</div>
					<div class="col-span-1 opacity-70">Post Code</div>
					<div class="col-span-2">{user?.expand?.billingAddress?.postCode ?? '-'}</div>
				</div>
			{/if}
		</div>
		<!-- Right Side Top: Address(City, Country) + -->
		<div class="card variant-filled-surface/50 p-4 w-full">
			{#if isEditModeAddress}
				<div class="card-header p-0 grid grid-cols-1 md:grid-cols-3">
					<h4 class="h4 col-span-1">Address</h4>
					<button
						class="col-span-1 flex flex-row gap-2 pl-2 items-start justify-start text-green-600"
						type="submit"
						form="edit-address-form"
					>
						<Save />
						<div>Save</div>
					</button>
					<button
						class="col-span-1 flex flex-row gap-2 pl-2 items-start justify-start text-red-500"
						on:click={() => {
							isEditModeAddress = false;
						}}
					>
						<XSquare />
						<p>Cancel</p>
					</button>
				</div>

				<form
					method="POST"
					class="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2"
					id="edit-address-form"
					action="?/editaddress"
					use:addressEnhance
				>
					<!-- <input name="id" class="hidden col-span-0" type="text" value={$addressForm.id} /> -->
					<input name="id" class="hidden col-span-0" type="text" value={user.address} />
					<label class="col-span-1" for="addressLine1"> Address </label>
					<div class="col-span-1 md:col-span-2">
						<input
							type="text"
							name="addressLine1"
							class="input"
							bind:value={$addressForm.addressLine1}
							aria-invalid={$addressErrors.addressLine1 ? 'true' : undefined}
							{...$addressConstraints.addressLine1}
						/>
						{#if $addressErrors.addressLine1}
							<span class="block text-red-600 dark:text-red-500">{$addressErrors.addressLine1}</span
							>
						{/if}
					</div>
					<label class="col-span-1" for="city"> City </label>
					<div class="col-span-1 md:col-span-2">
						<input
							type="text"
							name="city"
							class="input"
							bind:value={$addressForm.city}
							aria-invalid={$addressErrors.city ? 'true' : undefined}
							{...$addressConstraints.city}
						/>
						{#if $addressErrors.city}
							<span class="block text-red-600 dark:text-red-500">{$addressErrors.city}</span>
						{/if}
					</div>
					<label class="col-span-1" for="state">State</label>
					<div class="col-span-1 md:col-span-2">
						<input
							type="text"
							name="state"
							class="input"
							bind:value={$addressForm.state}
							aria-invalid={$addressErrors.state ? 'true' : undefined}
							{...$addressConstraints.state}
						/>
						{#if $addressErrors.state}
							<span class="block text-red-600 dark:text-red-500">{$addressErrors.state}</span>
						{/if}
					</div>
					<label class="" for="country">Country</label>
					<div class="col-span-1 md:col-span-2">
						<select
							name="country"
							class="select"
							bind:value={$addressForm.country}
							aria-invalid={$addressErrors.country ? 'true' : undefined}
							{...$addressConstraints.country}
						>
							{#each countries as country}
								<option value={country}>{country}</option>
							{/each}
						</select>
						{#if $addressErrors.country}
							<span class="block text-red-600 dark:text-red-500">{$addressErrors.country}</span>
						{/if}
					</div>
					<label class="col-span-1" for="postCode">Post Code</label>
					<div class="col-span-1 md:col-span-2">
						<input
							type="text"
							name="postCode"
							class="input"
							bind:value={$addressForm.postCode}
							aria-invalid={$addressErrors.postCode ? 'true' : undefined}
							{...$addressConstraints.postCode}
						/>
						{#if $addressErrors.postCode}
							<span class="block text-red-600 dark:text-red-500">{$addressErrors.postCode}</span>
						{/if}
					</div>
				</form>
			{:else}
				<div class="card-header p-0 grid grid-cols-1 md:grid-cols-3">
					<h4 class="col-span-1 h4">Address</h4>
					<button
						class="col-span-1 flex flex-row gap-2 items-start justify-start text-blue-500"
						on:click={() => {
							isEditModeAddress = true;
						}}
					>
						<Pencil />
						<p>Edit</p>
					</button>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
					<div class="col-span-1 opacity-70">Address Line 1</div>
					<div class="col-span-2">{user?.expand?.address?.addressLine1 ?? '-'}</div>
					<div class="col-span-1 opacity-70">City</div>
					<div class="col-span-2">{user?.expand?.address?.city ?? '-'}</div>
					<div class="col-span-1 opacity-70">State</div>
					<div class="col-span-2">{user?.expand?.address?.state ?? '-'}</div>
					<div class="col-span-1 opacity-70">Country</div>
					<div class="col-span-2">{user?.expand?.address?.country ?? '-'}</div>
					<div class="col-span-1 opacity-70">Post Code</div>
					<div class="col-span-2">{user?.expand?.address?.postCode ?? '-'}</div>
				</div>
			{/if}
		</div>
		<!-- Right Side Bottom: Payment[Bank Accounts]  -->
		<div class="card variant-filled-surface/50 p-4 w-full min-h-[175px] divide-y divide-dashed">
			<!-- Bank Account -->
			<div class="card-header p-0 grid grid-cols-1 md:grid-cols-3 gap-2">
				<h4 class="h4 col-span-1">Bank Accounts</h4>
				<button
					class="col-span-2 flex flex-row gap-2 items-center text-orange-500"
					on:click={() => {
						modalMode = 2;
						showModal = true;
					}}
				>
					<PlusSquareIcon />
					<p>New</p>
				</button>
			</div>
			{#if user.expand?.bankAccounts}
				{#each user.expand?.bankAccounts as bankAccount, index}
					{#if isEditingRow === bankAccount.id}
						<div class="grid grid-cols-1 md:grid-cols-3 gap-2 py-1">
							<h4 class="h4">Account #{index + 1}</h4>
							<div class="flex flex-col lg:flex-row justify-end items-start gap-4">
								<button
									class="flex flex-row items-center justify-center gap-1 text-green-600"
									type="submit"
									form="edit-bankaccount"
								>
									<Save />
									<p>Save</p>
								</button>
								<form
									method="POST"
									id="delete-bankaccount"
									action="?/deletebankaccount"
									use:enhance
								>
									<input type="hidden" name="id" value={bankAccount.id} />
									<button
										class="delete flex flex-row items-center justify-center gap-1 text-red-600"
										type="submit"
										form="delete-bankaccount"
									>
										<Trash />
										<p>Delete</p>
									</button>
								</form>
								<button
									class="delete flex flex-row items-center justify-center gap-1 text-orange-600"
									type="button"
									on:click={() => {
										isEditingRow = '';
									}}
								>
									<XSquare />
									<p>Cancel</p>
								</button>
							</div>
						</div>
						<form
							method="POST"
							id="edit-bankaccount"
							class="p-4 space-y-2"
							use:bankAccountEnhance
							action="?/editbankaccount"
						>
							<input type="hidden" name="__superform_id" bind:value={$bankAccountFormId} />
							<input name="id" class="hidden col-span-0" type="text" value={bankAccount.id} />
							<label
								class="label uppercase tracking-wide font-bold dark:text-white"
								for="firstName"
							>
								<span class="pl-1">First Name</span>
								<input
									type="text"
									name="firstName"
									class="input"
									value={bankAccount.firstName}
									aria-invalid={$bankAccountForm.firstName ? 'true' : undefined}
									{...$bankAccountConstraints.firstName}
								/>
								{#if $bankAccountErrors.firstName}
									<span class="block text-red-600 dark:text-red-500">
										{$bankAccountErrors.firstName}
									</span>
								{/if}
							</label>
							<label class="label uppercase tracking-wide font-bold dark:text-white" for="lastName">
								<span class="pl-1">Last Name</span>
								<input
									type="text"
									name="lastName"
									class="input"
									value={bankAccount.lastName}
									aria-invalid={$bankAccountForm.lastName ? 'true' : undefined}
									{...$bankAccountConstraints.lastName}
								/>
								{#if $bankAccountErrors.lastName}
									<span class="block text-red-600 dark:text-red-500">
										{$bankAccountErrors.lastName}
									</span>
								{/if}
							</label>
							<label
								class="label uppercase tracking-wide font-bold dark:text-white"
								for="accountNumber"
							>
								<span class="pl-1">Account Number</span>
								<input
									type="text"
									name="accountNumber"
									class="input"
									value={bankAccount.accountNumber}
									aria-invalid={$bankAccountForm.accountNumber ? 'true' : undefined}
									{...$bankAccountConstraints.accountNumber}
								/>
								{#if $bankAccountErrors.accountNumber}
									<span class="block text-red-600 dark:text-red-500">
										{$bankAccountErrors.accountNumber}
									</span>
								{/if}
							</label>
						</form>
					{:else}
						<div class="grid grid-cols-1 md:grid-cols-3 gap-2 py-1">
							<h4 class="h4">Account #{index + 1}</h4>
							<div class="flex flex-col lg:flex-row justify-start items-start gap-1">
								<button
									class="text-blue-600"
									type="button"
									on:click={() => {
										isEditingRow = bankAccount.id;
									}}
								>
									<Pencil class="inline-flex" />
									<div class="h4 inline-flex">Edit</div>
								</button>
							</div>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
							<div class="col-span-1 opacity-70">Full Name</div>
							<div class="col-span-2">{bankAccount.firstName} {bankAccount.lastName}</div>
							<div class="col-span-1 opacity-70">Account Number</div>
							<div class="col-span-2">{bankAccount.accountNumber}</div>
							<div class="col-span-1 opacity-70">Last modified</div>
							<div class="col-span-2">
								{new Date(bankAccount.updated ?? '-').toLocaleTimeString(undefined, {
									weekday: 'short',
									year: 'numeric',
									month: 'short',
									day: 'numeric'
								})}
							</div>
						</div>
					{/if}
				{:else}
					<p class="text-lg pt-4">No Bank Accounts found</p>
				{/each}
			{:else}
				<p class="text-lg pt-4">No Bank Accounts found</p>
			{/if}
		</div>
		<!-- Right Side Bottom: Payment[Bank Cards]  -->
		<div class="card variant-filled-surface/50 p-4 w-full min-h-[175px] divide-y divide-dashed">
			<!-- Bank Cards -->
			<div class="card-header p-0 grid grid-cols-1 md:grid-cols-3 gap-2">
				<h4 class="h4 col-span-1">Bank Cards</h4>
				<button
					class="col-span-2 flex flex-row gap-2 items-center text-orange-500"
					on:click={() => {
						modalMode = 3;
						showModal = true;
					}}
				>
					<PlusSquareIcon />
					<p>New</p>
				</button>
			</div>

			{#if user.expand?.bankCards}
				{#each user.expand?.bankCards as bankCard, index}
					{#if isEditingRow === bankCard.id}
						<div class="grid grid-cols-1 md:grid-cols-3 gap-2 py-1">
							<h4 class="h4">Card #{index + 1}</h4>
							<div class="flex flex-col lg:flex-row justify-end items-start gap-4">
								<button
									class="flex flex-row items-center justify-center gap-1 text-green-600"
									type="submit"
									form="edit-bankcard"
								>
									<Save />
									<p>Save</p>
								</button>
								<form method="POST" id="delete-bankbankcard" action="?/deletebankcard">
									<input type="hidden" name="id" value={bankCard.id} />
									<button
										class="delete flex flex-row items-center justify-center gap-1 text-red-600"
										type="submit"
										form="delete-bankcard"
									>
										<Trash />
										<p>Delete</p>
									</button>
								</form>
								<button
									class="delete flex flex-row items-center justify-center gap-1 text-orange-600"
									type="button"
									on:click={() => {
										isEditingRow = '';
									}}
								>
									<XSquare />
									<p>Cancel</p>
								</button>
							</div>
						</div>
						<form
							method="POST"
							id="edit-bankcard"
							class="p-4 space-y-2"
							use:bankCardEnhance
							action="?/editbankcard"
						>
							<input type="hidden" name="__superform_id" bind:value={$bankCardFormId} />
							<input name="id" class="hidden col-span-0" type="text" value={bankCard.id} />
							<label
								class="label uppercase tracking-wide font-bold dark:text-white"
								for="firstName"
							>
								<span class="pl-1">First Name</span>
								<input
									type="text"
									name="firstName"
									class="input"
									value={bankCard.firstName}
									aria-invalid={$bankCardForm.firstName ? 'true' : undefined}
									{...$bankCardConstraints.firstName}
								/>
								{#if $bankCardErrors.firstName}
									<span class="block text-red-600 dark:text-red-500">
										{$bankCardErrors.firstName}
									</span>
								{/if}
							</label>
							<label class="label uppercase tracking-wide font-bold dark:text-white" for="lastName">
								<span class="pl-1">Last Name</span>
								<input
									type="text"
									name="lastName"
									class="input"
									value={bankCard.lastName}
									aria-invalid={$bankCardForm.lastName ? 'true' : undefined}
									{...$bankCardConstraints.lastName}
								/>
								{#if $bankCardErrors.lastName}
									<span class="block text-red-600 dark:text-red-500">
										{$bankCardErrors.lastName}
									</span>
								{/if}
							</label>
							<label
								class="label uppercase tracking-wide font-bold dark:text-white"
								for="accountNumber"
							>
								<span class="pl-1">Account Number</span>
								<input
									type="text"
									name="accountNumber"
									class="input"
									value={bankCard.cardNumber}
									aria-invalid={$bankCardForm.cardNumber ? 'true' : undefined}
									{...$bankCardConstraints.cardNumber}
								/>
								{#if $bankCardErrors.cardNumber}
									<span class="block text-red-600 dark:text-red-500">
										{$bankCardErrors.cardNumber}
									</span>
								{/if}
							</label>
							<label class="label uppercase tracking-wide font-bold dark:text-white" for="cvc">
								<span class="pl-1">CVC</span>
								<input
									type="number"
									name="cvc"
									class="input"
									value={bankCard.cvc}
									aria-invalid={$bankCardForm.cvc ? 'true' : undefined}
									{...$bankCardConstraints.cvc}
								/>
								{#if $bankCardErrors.cvc}
									<span class="block text-red-600 dark:text-red-500">
										{$bankCardErrors.cvc}
									</span>
								{/if}
							</label>

							<div class="flex flex-row gap-2 justify-center items-center">
								<span class="pl-1">MM</span>
								<input
									type="number"
									name="month"
									class="input"
									value={bankCard.month}
									aria-invalid={$bankCardForm.month ? 'true' : undefined}
									{...$bankCardConstraints.month}
								/>
								<span class="pl-1">YY</span>
								<input
									type="number"
									name="year"
									class="input"
									value={bankCard.year}
									aria-invalid={$bankCardForm.year ? 'true' : undefined}
									{...$bankCardConstraints.year}
								/>
								{#if $bankCardErrors.month}
									<span class="block text-red-600 dark:text-red-500">
										{$bankCardErrors.month}
									</span>
								{/if}
								{#if $bankCardErrors.year}
									<span class="block text-red-600 dark:text-red-500">
										{$bankCardErrors.year}
									</span>
								{/if}
							</div>
						</form>
					{:else}
						<div class="grid grid-cols-1 md:grid-cols-3 gap-2 py-1">
							<h4 class="h4">Card #{index + 1}</h4>
							<div class="flex flex-col lg:flex-row justify-start items-start gap-1">
								<button
									class="text-blue-600"
									type="button"
									on:click={() => {
										isEditingRow = bankCard.id;
									}}
								>
									<Pencil class="inline-flex" />
									<div class="h4 inline-flex">Edit</div>
								</button>
							</div>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
							<div class="col-span-1 opacity-70">Full Name</div>
							<div class="col-span-2">{bankCard.firstName} {bankCard.lastName}</div>
							<div class="col-span-1 opacity-70">Card Number</div>
							<div class="col-span-2">{bankCard.cardNumber}</div>
							<div class="col-span-1 opacity-70">CVC</div>
							<div class="col-span-2">{bankCard.cvc}</div>
							<div class="col-span-1 opacity-70">Expiry</div>
							<div class="col-span-2">{covertToMonth(bankCard.month)} / 20{bankCard.year}</div>
							<div class="col-span-1 opacity-70">Last modified</div>
							<div class="col-span-2">
								{new Date(bankCard.updated ?? '-').toLocaleTimeString(undefined, {
									weekday: 'short',
									year: 'numeric',
									month: 'short',
									day: 'numeric'
								})}
							</div>
						</div>
					{/if}
				{:else}
					<p class="text-lg pt-4">No Bank Cards found</p>
				{/each}
			{:else}
				<p class="text-lg pt-4">No Bank Cards found</p>
			{/if}
		</div>
	</div>
</section>

<style>
	#cover-spin {
		position: fixed;
		width: 100%;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.7);
		z-index: 9999;
		display: block;
	}

	@-webkit-keyframes spin {
		from {
			-webkit-transform: rotate(0deg);
		}
		to {
			-webkit-transform: rotate(360deg);
		}
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	#cover-spin::after {
		content: '';
		display: block;
		position: absolute;
		left: 44vw;
		top: 40%;
		width: 12vw;
		height: 12vw;
		border-style: solid;
		border-color: black;
		border-top-color: transparent;
		border-width: 4px;
		border-radius: 50%;
		-webkit-animation: spin 0.8s linear infinite;
		animation: spin 0.8s linear infinite;
	}
	@keyframes gradient-shine {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(100%);
		}
	}

	.card .thumbnail {
		position: relative;
		width: 100%;
		aspect-ratio: 16/9;
		border-radius: 1rem;
		overflow: hidden;
	}

	.card .thumbnail::after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: linear-gradient(to right, var(--bg-body), var(--border-color), var(--bg-body));
		animation: gradient-shine 500ms infinite;
	}

	.card img:hover {
		filter: brightness(1.2);
	}

	.thumbnails {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}

	.thumbnails.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
	}

	.thumbnail {
		padding: 0;
		margin: 0;
		border: 0;
		border-radius: 0.25rem;
		overflow: hidden;
	}

	.thumbnail:hover {
		background: darkgray;
	}

	.thumbnail.active:not(.inset) {
		outline: 2px solid white;
		outline-offset: 2px;
	}
</style>
