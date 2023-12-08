<script lang="ts">
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

	let valueSingle: string = 'question';
</script>

<!--
  This component uses @tailwindcss/forms

  yarn add @tailwindcss/forms
  npm install @tailwindcss/forms

  plugins: [require('@tailwindcss/forms')]
-->

<section class="">
	<div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
			<div class="lg:col-span-2 lg:py-12">
				<p class="max-w-xl text-lg">
					We're here to help! Please don't hesitate to reach out with any questions or concerns you
					may have. Your child's well-being is our top priority, and we understand that choosing the
					right nanny is an important decision.
				</p>
				<p class="my-1 max-w-xl text-lg">Feel free to contact us for:</p>
				<ul class="list-disc ml-8 space-y-2">
					<li class="text-lg">Assistance with nanny selection</li>
					<li class="text-lg">Customized childcare solutions</li>
					<li class="text-lg">Scheduling and availability inquiries.</li>
					<li class="text-lg">Any special requests or specific requirements</li>
				</ul>
				<p class="mt-1 max-w-xl text-lg">
					Our team is dedicated to ensuring a safe and nurturing environment for your family. Your
					peace of mind matters to us, and we're committed to providing you with the support and
					information you need. We look forward to assisting you on this journey of finding the
					perfect childcare solution for your home.
				</p>
				<p class="max-w-xl text-lg" />
				<div class="mt-8">
					<a
						href="#!"
						class="text-2xl font-bold text-elementBackgroundLightMode dark:text-elementBackgroundDarkMode"
					>
						0151 475 4450
					</a>

					<address class="mt-2 not-italic">282 Kevin Brook, Imogeneborough, CA 58517</address>
				</div>
			</div>

			<div class="card variant-ghost p-8 lg:col-span-3 lg:p-12">
				<form action="" class="space-y-4">
					<div>
						<label class="sr-only" for="name">Name</label>
						<input class="input" placeholder="Name" type="text" id="name" />
					</div>

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label class="sr-only" for="email">Email</label>
							<input class="input" placeholder="Email address" type="email" id="email" />
						</div>

						<div>
							<label class="sr-only" for="phone">Phone</label>
							<input class="input" placeholder="Phone Number" type="tel" id="phone" />
						</div>
					</div>

					<ListBox class="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
						<ListBoxItem
							active="variant-filled-warning"
							bind:group={valueSingle}
							name="medium"
							value="question"
						>
							Question
						</ListBoxItem>
						<ListBoxItem
							active="variant-filled-warning"
							bind:group={valueSingle}
							name="medium"
							value="issue"
						>
							Issue
						</ListBoxItem>
						<ListBoxItem
							active="variant-filled-warning"
							bind:group={valueSingle}
							name="medium"
							value="other"
						>
							Other
						</ListBoxItem>
					</ListBox>

					<div>
						<label class="sr-only" for="message">Message</label>

						<textarea class="textarea" placeholder="Message" rows="8" id="message" />
					</div>

					<div class="mt-4">
						<button type="submit" class="btn variant-filled w-full"> Send Enquiry </button>
					</div>
				</form>
			</div>
		</div>
	</div>
</section>

<style></style>
