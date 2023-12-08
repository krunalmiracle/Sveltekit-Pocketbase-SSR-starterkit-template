<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { MultiSelect, type Option } from 'svelte-multiselect';
	import { ssp, queryParam } from 'sveltekit-search-params';
	import { ServiceServiceOptions } from '$lib/pocketbase-types';
	import { convertTo12Hour, convertTo24Hour, findLowestPayPerHour } from '$lib/util/helpers';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { Coins, HelpingHand } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	export let data;
	/* $: ({ sitters } = data); */
	/**
	 * Any search string which can be
	 * eg: firstName || lastName || serviceType || location
	 */
	let search: Writable<string | null>;
	/**
	 * Services Types available currenlty from the interface services
	 * eg:GARDENER,CHAT,BABYSITTER or Empty string
	 */
	let servicesTypes: Writable<string[] | undefined> = writable([]);
	/**
	 * Service Weekdays looking for
	 * eg: Everyday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
	 */
	let serviceWeekday: Writable<string | null> = writable('EVERYDAY');
	/**
	 * Service Start Time 24H in minutes
	 * eg: min(0) or max(1440)
	 */
	let serviceStartTime: Writable<string | null> = writable('');
	/**
	 * Service End Time 24H in minutes
	 * eg: min(0) or max(1440)
	 */
	let serviceEndTime: Writable<string | null> = writable('');
	/**
	 * Max Pay per hour for filtering
	 */
	let payRangeMax: Writable<number | null>;
	/**
	 * Possible Sort options
	 * eg: "",date,pay,rating
	 */
	let sort: Writable<string | null> = writable('ratingDesc');
	/**
	 * Page Number from Paginated pages
	 */
	let page: Writable<number | null> = writable(data?.page ?? 1);
	// Redirect to the constructed URL
	//window.location.href = url.href;
	const serviceTypes: string[] = [
		ServiceServiceOptions.BABYSITTER,
		ServiceServiceOptions.CHAT,
		ServiceServiceOptions.DRIVEWAYCLEAN,
		ServiceServiceOptions.GARDENER,
		ServiceServiceOptions.HOMECLEAN
	];
	onMount(() => {
		search = queryParam('search');
		/**
		 * Services Types available currenlty from the interface services
		 * eg:GARDENER,CHAT,BABYSITTER or Empty string
		 */
		//@ts-ignore: Type difference due to null and undefined between different packages
		servicesTypes = queryParam('servicesTypes', {
			encode: (value) => {
				return value ? value.join(',') : undefined;
			},
			decode: (value) => (value ? value.split(',') : undefined)
		});
		serviceWeekday = queryParam('serviceWeekday');
		serviceStartTime = queryParam('serviceStartTime');
		serviceEndTime = queryParam('serviceEndTime');
		payRangeMax = queryParam('payRangeMax', ssp.number());
		page = queryParam('page', ssp.number(data?.page ?? null));
		sort = queryParam('sort', ssp.string());
	});
	/* $: completeURL = `Sort: ${$sort} - Search: ${$search} - payRangeMax: ${$payRangeMax} - servicesTypes: ${
		$servicesTypes ? $servicesTypes.join(',') : ''
	} - serviceStartTime: ${$serviceStartTime} - serviceEndTime: ${$serviceEndTime} - page: ${$page}`; */
</script>

<section class="p-2">
	<div class="card p-0 flex flex-row justify-between items-center h-max">
		<input
			class="w-auto md:w-[50vw] h-min max-w-[400px]"
			type="text"
			bind:value={$search}
			placeholder="Search by name, service type or location"
		/>
		<label class="w-auto">
			<p class="hidden md:inline-block">Sort by:</p>
			<select bind:value={$sort} class="w-auto inline-block">
				<option value="dateAsc">Date Ascending</option>
				<option value="dateDesc">Date Descending</option>
				<option value="payRateAsc">Pay Ascending</option>
				<option value="payRateDesc">Pay Descending</option>
				<option value="ratingAsc">Rating Ascending</option>
				<option value="ratingDesc">Rating Descending</option>
			</select>
		</label>
	</div>
	<div class="grid grid-cols-1 md:grid-cols-12 mt-2 gap-2">
		<div class="col-span-1 md:col-span-3 lg:col-span-2 card p-4 flex flex-col gap-y-3">
			<header class="card-header p-0 font-bold underline">Filter By</header>
			<label class="label">
				Maximum Pay per hour:
				<input
					type="number"
					step="1"
					bind:value={$payRangeMax}
					min="0"
					max="5000000"
					placeholder="None"
				/>
			</label>
			<label class="label" for="service">
				Which service you want to hire:
				<MultiSelect
					id="service"
					outerDivClass="w-full bg-white border rounded"
					inputClass="w-full bg-white"
					liActiveOptionClass="w-full bg-white"
					ulOptionsClass="w-full"
					liSelectedClass="w-full"
					liOptionClass="w-full"
					allowEmpty={true}
					allowUserOptions={false}
					bind:selected={$servicesTypes}
					options={serviceTypes}
					placeholder="All"
				/>
			</label>
			<label class="label" for="serviceWeekday">
				Service weekday
				<select
					class="input"
					id="serviceWeekday"
					size="1"
					name="serviceWeekday"
					bind:value={$serviceWeekday}
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
			</label>
			<label class="label" for="serviceStartTime">
				Filter by Service Start Time:
				<input
					id="serviceStartTime"
					type="time"
					name="serviceStartTime"
					class="w-full input"
					pattern="[0-9]{2}:[0-9]{2}"
					bind:value={$serviceStartTime}
				/>
			</label>
			<label class="label" for="serviceEndTime">
				Filter by Service End Time:
				<input
					id="serviceEndTime"
					type="time"
					name="serviceEndTime"
					class="w-full input"
					pattern="[0-9]{2}:[0-9]{2}"
					bind:value={$serviceEndTime}
				/>
			</label>
		</div>
		{#if data?.total > 0}
			<div
				class="col-span-1 md:col-span-9 lg:col-span-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 justify-start items-start"
			>
				{#each data.sitters as sitter}
					<div class="card min-w-fit p-0 m-0 space-y-2">
						<div class="card-header flex flex-row p-2">
							<!-- Avatar + { Line1: Name + Line2: Location + Line3: Availibility} -->
							<Avatar
								src={sitter?.avatar
									? `${env.PUBLIC_BACKEND_URL}/api/files/_pb_users_auth_/${sitter?.id}/${sitter?.avatar}`
									: ''}
								width="w-24"
								height="h-24"
								class="m-2"
								initials={`${sitter?.firstName[0] ?? 'X'}${sitter?.lastName[0] ?? 'Y'}`}
								rounded="rounded-full"
							/>
							<div class="flex flex-col ml-2 space-y-1 p-2">
								<h4 class="h4">{sitter?.firstName} {sitter?.lastName}</h4>
								<p class="opacity-70">Los Angeles, CA</p>
								{#if true}
									<span class="badge variant-filled-success">Available</span>
								{:else}
									<span class="badge variant-filled-error">Unavailable</span>
								{/if}
							</div>
						</div>
						<div class="content flex flex-col px-4 space-y-2">
							<!-- Line1: Summary + Line2:Description Text + Line3: Availibility Hours -->
							<div class="flex flex-col">
								<p class="h6 opacity-70 uppercase">Summary</p>
								<p class="h6">
									{@html sitter.bio}
								</p>
							</div>
							<!-- Line1: Availibility Line2: Availibility Hours -->
							<div class="flex flex-col">
								<p class="h6 opacity-70 uppercase">Availibility</p>
								<div class="space-x-1 space-y-1">
									{#if sitter?.expand?.availabilities != undefined}
										{#each sitter?.expand?.availabilities as availability}
											<span
												class="badge variant-ringed-primary font-bold p-2 inline-block max-w-fit"
											>
												{convertTo12Hour(availability.start)} - {convertTo12Hour(availability.end)}
											</span>
										{:else}
											<span class="badge variant-ringed-error font-bold p-2 inline-block max-w-fit">
												None
											</span>
										{/each}
									{:else}
										<span class="badge variant-ringed-error font-bold p-2 inline-block max-w-fit">
											None
										</span>
									{/if}
								</div>
							</div>
							<!-- Line1: Services offered + Line2: Services -->
							<div class="flex flex-col">
								<p class="h6 opacity-70 uppercase">Services</p>
								<div class="space-x-1 space-y-1">
									{#if sitter?.expand?.services}
										{#each sitter?.expand?.services as service}
											{#if service.service === ServiceServiceOptions.BABYSITTER}
												<span
													class="badge variant-ringed-secondary font-bold p-2 inline-block max-w-fit"
												>
													Baby Sitter
												</span>
											{:else if service.service === ServiceServiceOptions.HOMECLEAN}
												<span
													class="badge variant-ringed-secondary font-bold p-2 inline-block max-w-fit"
												>
													Cleaning
												</span>
											{:else if service.service === ServiceServiceOptions.CHAT}
												<span
													class="badge variant-ringed-secondary font-bold p-2 inline-block max-w-fit"
												>
													Accompany & Chat
												</span>
											{:else if service.service === ServiceServiceOptions.DRIVEWAYCLEAN}
												<span
													class="badge variant-ringed-secondary font-bold p-2 inline-block max-w-fit"
												>
													Cleaning Driveway
												</span>
											{:else if service.service === ServiceServiceOptions.GARDENER}
												<span
													class="badge variant-ringed-secondary font-bold p-2 inline-block max-w-fit"
												>
													Gardener
												</span>
											{/if}
										{:else}
											<span class="badge variant-ringed-error font-bold p-2 inline-block max-w-fit">
												None
											</span>
										{/each}
									{:else}
										<span class="badge variant-ringed-error font-bold p-2 inline-block max-w-fit">
											None
										</span>
									{/if}
								</div>
							</div>
						</div>

						<div class="card-footer m-0 p-0">
							<!-- Line1: Services Done Count [LEFT SIDE] | [RIGHT SIDE]: Min Pay Rate per hour -->
							<div
								class="w-full grid grid-cols-1 lg:grid-cols-2 justify-center bg-slate-200 m-0 p-0"
							>
								<div
									class="col-span-1 flex flex-row items-center justify-center lg:border-r-2 border-black space-x-1 py-1 lg:py-2"
								>
									<HelpingHand />
									<p class="text-sm md:text-base">Done: 0</p>
								</div>
								<div
									class="col-span-1 flex flex-row items-center justify-center lg:border-l-2 border-black space-x-1 py-1 lg:py-2"
								>
									<Coins />
									<p class="text-sm md:text-base">
										Min Pay: {findLowestPayPerHour(sitter?.expand?.services ?? [], sitter.currency)}
									</p>
								</div>
							</div>
							<div class="m-0">
								<button
									class="rounded-b-lg p-2 w-full variant-filled-primary hover:brightness-125 focus:brightness-125"
									>Invite for Job</button
								>
							</div>
						</div>
					</div>
				{:else}
					<div class="col-span-1 lg:col-span-9 container justify-center align-middle">
						<h3 class="h3 py-12 text-center">No person available for service...</h3>
						<h4 class="h4 text-center">You could be next</h4>
					</div>
				{/each}
			</div>
		{:else}
			<div class="col-span-1 lg:col-span-9 container justify-center align-middle">
				<h3 class="h3 py-12 text-center">No person available for service...</h3>
				<h4 class="h4 text-center">You could be next</h4>
			</div>
		{/if}
	</div>
</section>
