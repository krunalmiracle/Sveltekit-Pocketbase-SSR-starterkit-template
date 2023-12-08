<script lang="ts">
	export let data;
	$: ({ user } = data);
</script>

<section class="dashboard flex flex-col w-full p-2 gap-2">
	<div class="card w-full p-2">
		<div class="p-0 card-header">
			<h4 class="h4">Hi {user?.firstName}, welcome</h4>
		</div>
	</div>
	<div class="card w-full h-[300px] p-2">
		<div class="p-0 card-header">
			<h4 class="h4">Job Offers</h4>
		</div>
		<p>Currently no Job offers</p>
	</div>

	<div class="card w-full h-[300px] p-2">
		<div class="p-0 card-header">
			<h4 class="h4">Services Done</h4>
		</div>
		<p>Currently no services done</p>
	</div>
</section>
