<script>
	import Image_Krunal from '$lib/images/krunal.jpg';
	import Image_Silviya from '$lib/images/silviya.jpg';
</script>

<section
	class="bg-backgroundLightMode dark:bg-backgroundDarkMode text-textLightMode dark:text-textDarkMode body-font"
>
	<div class="container px-5 py-16 mx-auto">
		<div class="flex flex-col items-center justify-center text-center w-full mb-4">
			<h1
				class="text-2xl md:text-3xl font-bold title-font mb-4 text-textLightMode dark:text-textDarkMode"
			>
				OUR TEAM
			</h1>
			<p class="lg:w-2/3 mx-auto text-xl md:text-2xl font-normal leading-relaxed">
				Planting the seeds for a successful tomorrow
			</p>
		</div>

		<div class="flex flex-col sm:flex-row items-start justify-center sm:space-x-4" role="list">
			<div class="basis-1/1 sm:basis-1/2 md:basis-1/3">
				<a href="https://www.linkedin.com/in/Some Random/" target="_blank" class="profile">
					<h2 class="profile__name">Some Random</h2>
					<p>Director</p>
					<img alt="Profile shot for Some Random" src="https://picsum.photos/128" />
				</a>
				<h3 class="text-2xl my-2 font-bold">Tech Director</h3>
				<p
					class="text-base md:text-xl mb-4 font-normal text-textAlternativeLightMode dark:text-textAlternativeDarkMode"
				>
					His resourcefulness and analytical thinking drive results and enable us to reach our
					goals.
				</p>
			</div>
			<div class="basis-1/1 sm:basis-1/2 md:basis-1/3">
				<a
					href="https://www.linkedin.com/in/silviya-angelova-6016b81b2/"
					target="_blank"
					class="profile"
				>
					<h2 class="profile__name">Some Random</h2>
					<p>Creative Director</p>
					<img alt="Profile shot for Some Random" src="https://picsum.photos/128" />
				</a>
				<h3 class="text-2xl my-2 font-bold">Creative Director</h3>
				<p
					class="text-base md:text-xl mb-4 font-normal text-textAlternativeLightMode dark:text-textAlternativeDarkMode"
				>
					Her visionary and creative leadership gives us direction and purpose.
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	/* Composition */

	/* Blocks */
	.profile {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		aspect-ratio: 1/1;
		position: relative;
		color: #ffffff;
		backface-visibility: hidden;
		text-decoration: none;
		overflow: hidden;
	}

	.profile::before,
	.profile::after {
		content: '';
		width: 100%;
		height: 100%;
		position: absolute;
		/*inset: 0;*/
		top: 0;
		left: 0;
	}

	.profile::before {
		background: linear-gradient(
			to top,
			hsl(0 0% 0% / 0.79) 0%,
			hsl(0 0% 0% / 0.787) 7.8%,
			hsl(0 0% 0% / 0.779) 14.4%,
			hsl(0 0% 0% / 0.765) 20.2%,
			hsl(0 0% 0% / 0.744) 25.3%,
			hsl(0 0% 0% / 0.717) 29.9%,
			hsl(0 0% 0% / 0.683) 34.3%,
			hsl(0 0% 0% / 0.641) 38.7%,
			hsl(0 0% 0% / 0.592) 43.3%,
			hsl(0 0% 0% / 0.534) 48.4%,
			hsl(0 0% 0% / 0.468) 54.1%,
			hsl(0 0% 0% / 0.393) 60.6%,
			hsl(0 0% 0% / 0.31) 68.3%,
			hsl(0 0% 0% / 0.216) 77.3%,
			hsl(0 0% 0% / 0.113) 87.7%,
			hsl(0 0% 0% / 0) 100%
		);
		transition: 300ms opacity linear;
	}

	.profile::after {
		background: linear-gradient(45deg, hsl(5 97% 63% / 0.7) 0, hsl(5 97% 63% / 0) 40%);
		opacity: 0;
		transition: 300ms opacity linear;
	}

	.profile > * {
		/* z-index: 1; */
	}

	.profile img {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		/* z-index: -1; */
		object-fit: cover;
		filter: grayscale(0.2);
		transition: filter 200ms ease, transform 250ms linear;
	}

	.profile h2,
	.profile p {
		transform: translateY(2ex);
	}

	.profile h2 {
		font-size: 1.7rem;
		line-height: 1.2;
		font-weight: 900;
		letter-spacing: 0.03ch;
		transition: 300ms transform ease;
	}

	.profile p {
		font-size: 1.2rem;
		font-weight: 500;
	}

	.profile p {
		opacity: 0;
		transition: 300ms opacity linear, 300ms transform ease-in-out;
	}

	.profile:focus {
		outline: 0.5rem solid white;
		outline-offset: -0.5rem;
	}

	.profile:hover :is(h2, p),
	.profile:focus :is(h2, p) {
		transform: none;
	}

	.profile:hover::after,
	.profile:focus::after,
	.profile:hover::before,
	.profile:focus::before {
		opacity: 0.7;
	}

	.profile:hover p,
	.profile:focus p {
		opacity: 1;
		transition-delay: 200ms;
	}

	.profile:hover img,
	.profile:focus img {
		filter: grayscale(0.2);
		transform: scale(1.05) rotate(1deg);
	}
</style>
