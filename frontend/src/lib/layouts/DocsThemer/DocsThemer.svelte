<script lang="ts">
	import type { Writable } from 'svelte/store';

	// Preview Components
	import { Avatar, ProgressBar, SlideToggle } from '@skeletonlabs/skeleton';
	// Components
	import { CodeBlock, LightSwitch } from '@skeletonlabs/skeleton';
	import Swatch from './Swatch.svelte';

	// Utilities
	import { localStorageStore, popup } from '@skeletonlabs/skeleton';

	// Local Utils
	import { storePreview } from './stores';
	import { storeTheme } from '$lib/stores/stores';
	import type { ColorSettings, FormTheme, ContrastReport } from './types';
	import { inputSettings, fontSettings } from './settings';
	import {
		type Palette,
		generatePalette,
		generateA11yOnColor,
		hexValueIsValid,
		getPassReport
	} from './colors';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

	// Stores
	const storeThemGenForm: Writable<FormTheme> = localStorageStore('storeThemGenForm', {
		colors: [
			{ key: 'primary', label: 'Primary', hex: '#0FBA81', rgb: '0 0 0', on: '0 0 0' },
			{ key: 'secondary', label: 'Secondary', hex: '#4F46E5', rgb: '0 0 0', on: '255 255 255' },
			{ key: 'tertiary', label: 'Tertiary', hex: '#0EA5E9', rgb: '0 0 0', on: '0 0 0' },
			{ key: 'success', label: 'Success', hex: '#84cc16', rgb: '0 0 0', on: '0 0 0' },
			{ key: 'warning', label: 'Warning', hex: '#EAB308', rgb: '0 0 0', on: '0 0 0' },
			{ key: 'error', label: 'Error', hex: '#D41976', rgb: '0 0 0', on: '255 255 255' },
			{ key: 'surface', label: 'Surface', hex: '#495a8f', rgb: '0 0 0', on: '255 255 255' }
		],
		fontBase: 'system',
		fontHeadings: 'system',
		textColorLight: '0 0 0',
		textColorDark: '255 255 255',
		roundedBase: '9999px',
		roundedContainer: '8px',
		borderBase: '1px'
	});
	resetColorOnInvalidHex();

	// Local
	let cssOutput = '';
	let cssInJsOutput = '';
	let showThemeCSS = false;
	let conReports: ContrastReport[] = getContrastReports();

	// only called when initializing the component to avoid color errors.
	// must be called before onMount.
	function resetColorOnInvalidHex() {
		const colorMapping = {
			primary: '#0FBA81',
			secondary: '#4F46E5',
			tertiary: '#0EA5E9',
			success: '#84cc16',
			warning: '#EAB308',
			error: '#D41976',
			surface: '#495a8f'
		};

		$storeThemGenForm.colors.forEach((color: ColorSettings, i: number) => {
			if (hexValueIsValid(color.hex)) return;

			if (color.key in colorMapping) {
				$storeThemGenForm.colors[i].hex = colorMapping[color.key];
			}
		});
	}

	function randomize(): void {
		$storeThemGenForm.colors.forEach((_, i: number) => {
			const randomHexCode = '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0');
			$storeThemGenForm.colors[i].hex = randomHexCode;
			$storeThemGenForm.colors[i].on = generateA11yOnColor(randomHexCode);
		});
	}

	// CSS output (for live preview)
	function generateColorCSS(): string {
		let newCSS = '';
		const newPalette: Record<string, Palette> = {};
		// Loop store colors
		$storeThemGenForm.colors.forEach((color: ColorSettings, i: number) => {
			const colorKey = color.key;
			// Generate the new color palette hex/rgb/on values
			newPalette[color.key] = generatePalette($storeThemGenForm.colors[i].hex);
			// The color set comment
			newCSS += `/* ${colorKey} | ${newPalette[colorKey][500].hex} */\n\t`;
			// CSS props for shade 50-900 per each color
			for (let [k, v] of Object.entries(newPalette[colorKey])) {
				newCSS += `--color-${colorKey}-${k}: ${v.rgb}; /* ⬅ ${v.hex} */\n\t`;
			}
		});
		return newCSS;
	}

	// CSS-in-JS output (for theme file)
	function generateColorCssInJS(): string {
		let newCssInJs = '';
		const newPalette: Record<string, Palette> = {};
		// Loop store colors
		$storeThemGenForm.colors.forEach((color: ColorSettings, i: number) => {
			const colorKey = color.key;
			// Generate the new color palette hex/rgb/on values
			newPalette[color.key] = generatePalette($storeThemGenForm.colors[i].hex);
			// The color set comment
			newCssInJs += `// ${colorKey} | ${newPalette[colorKey][500].hex} \n\t\t`;
			// CSS props for shade 50-900 per each color
			for (let [k, v] of Object.entries(newPalette[colorKey])) {
				newCssInJs += `"--color-${colorKey}-${k}": "${v.rgb}", // ${v.hex}\n\t\t`;
			}
		});
		return newCssInJs;
	}

	function onPreviewToggle(): void {
		if ($storePreview === false) {
			localStorage.removeItem('storeThemGenForm');
			document.body.setAttribute('data-theme', 'DEFAULT');
		} else {
			document.body.setAttribute('data-theme', '');
		}
	}

	function getContrastReports(): ContrastReport[] {
		return $storeThemGenForm.colors.map((value: ColorSettings) => ({
			...value,
			contrastReport: getPassReport(value.hex, value.on)
		}));
	}

	const tooltipSettings: Omit<PopupSettings, 'target'> = {
		event: 'hover',
		placement: 'top'
	};

	const hexValuesAreValid = (colors: ColorSettings[]) => {
		// Check all hex values for validity.
		let valid = true;
		colors?.forEach((color: ColorSettings) => {
			valid = valid && hexValueIsValid(color.hex);
		});

		return valid;
	};

	// Reactive
	$: if (hexValuesAreValid($storeThemGenForm.colors)) {
		// Update contrast reports when hex values change and when they are valid.
		conReports = getContrastReports();
	}

	$: if ($storeThemGenForm && hexValuesAreValid($storeThemGenForm.colors)) {
		// CSS output (for live preview)
		cssOutput = `
:root {
	/* =~= Theme Properties =~= */
	--theme-font-family-base: ${fontSettings[$storeThemGenForm.fontBase]};
	--theme-font-family-heading: ${fontSettings[$storeThemGenForm.fontHeadings]};
	--theme-font-color-base: ${$storeThemGenForm.textColorLight};
	--theme-font-color-dark: ${$storeThemGenForm.textColorDark};
	--theme-rounded-base: ${$storeThemGenForm.roundedBase};
	--theme-rounded-container: ${$storeThemGenForm.roundedContainer};
	--theme-border-base: ${$storeThemGenForm.borderBase};
	/* =~= Theme On-X Colors =~= */
	--on-primary: ${$storeThemGenForm.colors[0]?.on};
	--on-secondary: ${$storeThemGenForm.colors[1]?.on};
	--on-tertiary: ${$storeThemGenForm.colors[2]?.on};
	--on-success: ${$storeThemGenForm.colors[3]?.on};
	--on-warning: ${$storeThemGenForm.colors[4]?.on};
	--on-error: ${$storeThemGenForm.colors[5]?.on};
	--on-surface: ${$storeThemGenForm.colors[6]?.on};
	/* =~= Theme Colors  =~= */
	${generateColorCSS()}
}`;
		// CSS-in-JS output (for theme file)
		cssInJsOutput = `
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';\n
export const customThemeSilvita: CustomThemeConfig = {
    name: 'custom-theme-silvita',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": \`${fontSettings[$storeThemGenForm.fontBase]}\`,
		"--theme-font-family-heading": \`${fontSettings[$storeThemGenForm.fontHeadings]}\`,
		"--theme-font-color-base": "${$storeThemGenForm.textColorLight}",
		"--theme-font-color-dark": "${$storeThemGenForm.textColorDark}",
		"--theme-rounded-base": "${$storeThemGenForm.roundedBase}",
		"--theme-rounded-container": "${$storeThemGenForm.roundedContainer}",
		"--theme-border-base": "${$storeThemGenForm.borderBase}",
		// =~= Theme On-X Colors =~=
		"--on-primary": "${$storeThemGenForm.colors[0]?.on}",
		"--on-secondary": "${$storeThemGenForm.colors[1]?.on}",
		"--on-tertiary": "${$storeThemGenForm.colors[2]?.on}",
		"--on-success": "${$storeThemGenForm.colors[3]?.on}",
		"--on-warning": "${$storeThemGenForm.colors[4]?.on}",
		"--on-error": "${$storeThemGenForm.colors[5]?.on}",
		"--on-surface": "${$storeThemGenForm.colors[6]?.on}",
		// =~= Theme Colors  =~=
		${generateColorCssInJS()}
	}
}`;
	}

	$: livePreviewStylesheet = $storePreview ? `\<style\>${cssOutput}\</style\>` : '';
</script>

<!-- Live Preview of Generated Theme -->
<svelte:head>{@html livePreviewStylesheet}</svelte:head>

<div class="docs-themer grid grid-cols-1 space-y-4">
	<div class="card variant-filled-surface">
		<header class="card-header">
			<h3 class="h3">Theme Generator</h3>
			<p>
				Toggle the "Enable Preview" option to begin creating a new theme. The entire documentation
				site will update as you progress. You can navigate to different sections without losing your
				settings as long as you do not refresh the page. Disabling the preview will reset back to
				your original theme.
			</p>
		</header>
		<section class="p-4">
			<div class="flex flex-row justify-between">
				<h2 class="h2">Enable Preview</h2>
				<SlideToggle name="preview" bind:checked={$storePreview} on:change={onPreviewToggle} />
			</div>
		</section>
	</div>
	<div class="flex flex-col gap-4">
		<!-- Theme Color -->
		<section class="card col-span-2 variant-ghost-surface">
			<!-- General Settings -->
			<header class="p-4 md:col-span-2 flex flex-col md:flex-row justify-between items-center">
				<div class="flex flex-wrap space-x-2 space-y-2 justify-start items-start">
					<p class="pt-2 font-semibold">Theme Mode Dark/Light</p>
					<LightSwitch />
				</div>
				<h3 class="h3 font-semibold px-2">
					Choose colors from left side and the middle is the colors swatch/palette
				</h3>
				<button class="btn variant-ghost-surface" on:click={randomize} disabled={!$storePreview}
					>Randomize Colors</button
				>
			</header>
			<hr />
			<div class="p-4 grid grid-cols-1 gap-4">
				{#each $storeThemGenForm.colors as colorRow, i}
					<div class="grid grid-cols-1 lg:grid-cols-[170px_1fr_200px] gap-2 lg:gap-4">
						<label class="label">
							<span>{colorRow.label}</span>
							<div class="grid grid-cols-[auto_1fr] gap-4 place-items-end">
								<input
									class="input"
									type="color"
									bind:value={colorRow.hex}
									disabled={!$storePreview}
								/>
								<input
									class="input"
									type="text"
									bind:value={colorRow.hex}
									placeholder="#BADA55"
									disabled={!$storePreview}
								/>
							</div>
						</label>
						<Swatch color={colorRow.key} />
						<label>
							<span>Text & Fill Color</span>
							<div class="flex">
								<!-- Trigger -->
								<div class="input-group input-group-divider grid-cols-[1fr_auto]">
									<!-- Select -->
									<select bind:value={colorRow.on} disabled={!$storePreview}>
										{#each inputSettings.colorProps as c}<option value={c.value}>{c.label}</option
											>{/each}
									</select>
									<!-- Badge -->
									{#if $storePreview}
										<div
											class="input-group-shim !px-3"
											use:popup={{ ...tooltipSettings, ...{ target: 'popup-' + i } }}
											class:!text-stone-900={conReports[i].contrastReport.fails}
											class:!bg-red-500={conReports[i].contrastReport.fails}
											class:!text-zinc-900={conReports[i].contrastReport.largeAA}
											class:!bg-amber-500={conReports[i].contrastReport.largeAA}
											class:!text-slate-900={conReports[i].contrastReport.smallAAA ||
												conReports[i].contrastReport.smallAA}
											class:!bg-green-500={conReports[i].contrastReport.smallAAA ||
												conReports[i].contrastReport.smallAA}
										>
											{@html conReports[i].contrastReport.report.emoji}
										</div>
									{/if}
								</div>
								<!-- Popup -->
								<div
									data-popup={'popup-' + i}
									class="text-xs card variant-filled p-2 whitespace-nowrap"
									class:!variant-filled-red-500={conReports[i].contrastReport.fails}
									class:!variant-filled-amber-500={conReports[i].contrastReport.largeAA}
									class:!variant-filled-green-500={conReports[i].contrastReport.smallAAA ||
										conReports[i].contrastReport.smallAA}
								>
									{conReports[i].contrastReport.report.note}
									<!-- Arrow -->
									<div class="arrow variant-filled" />
								</div>
							</div>
						</label>
					</div>
				{/each}
			</div>
		</section>

		<!-- Theme Settings -->
		<section class="card variant-ghost-surface p-4 grid grid-cols-2 gap-4">
			<!-- Fonts -->
			<h3 class="h3 col-span-2 font-bold" data-toc-ignore>Edit Website Text Style</h3>
			<label class="label">
				<span>Base</span>
				<select class="select" bind:value={$storeThemGenForm.fontBase} disabled={!$storePreview}>
					{#each inputSettings.fonts as f}<option value={f}>{f}</option>{/each}
				</select>
			</label>
			<label class="label">
				<span>Headings</span>
				<select
					class="select"
					bind:value={$storeThemGenForm.fontHeadings}
					disabled={!$storePreview}
				>
					{#each inputSettings.fonts as f}<option value={f}>{f}</option>{/each}
				</select>
			</label>
			<!-- Text Color -->
			<h3 class="h3 col-span-2" data-toc-ignore>Text Color</h3>
			<label class="label">
				<span>Light Mode</span>
				<select
					class="select"
					bind:value={$storeThemGenForm.textColorLight}
					disabled={!$storePreview}
				>
					{#each inputSettings.colorProps as c}<option value={c.value}>{c.label}</option>{/each}
				</select>
			</label>
			<label class="label">
				<span>Dark Mode</span>
				<select
					class="select"
					bind:value={$storeThemGenForm.textColorDark}
					disabled={!$storePreview}
				>
					{#each inputSettings.colorProps as c}<option value={c.value}>{c.label}</option>{/each}
				</select>
			</label>
			<!-- Border Radius -->
			<h3 class="h3 col-span-2" data-toc-ignore>Border Radius</h3>
			<label class="label">
				<span>Base</span>
				<select class="select" bind:value={$storeThemGenForm.roundedBase} disabled={!$storePreview}>
					{#each inputSettings.rounded as r}<option value={r}>{r}</option>{/each}
					<option value="9999px">9999px</option>
				</select>
			</label>
			<label class="label">
				<span>Container</span>
				<select
					class="select"
					bind:value={$storeThemGenForm.roundedContainer}
					disabled={!$storePreview}
				>
					{#each inputSettings.rounded as r}<option value={r}>{r}</option>{/each}
				</select>
			</label>
			<!-- Border Size -->
			<h3 class="h3 col-span-2" data-toc-ignore>Border Size</h3>
			<label class="label">
				<span>Base</span>
				<select class="select" bind:value={$storeThemGenForm.borderBase} disabled={!$storePreview}>
					{#each inputSettings.border as b}<option value={b}>{b}</option>{/each}
				</select>
			</label>
			<div
				class="variant-soft-surface p-2 col-span-2 grid grid-cols-1 md:grid-cols-2 space-x-2 space-y-2"
			>
				<p class="col-span-2 font-extrabold py-2 h4">Card Style used in forms, etc</p>
				<div class="col-span-1 card card-hover overflow-hidden">
					<header>
						<img
							src="https://placehold.co/410x175"
							class="bg-black/50 w-full aspect-[21/9]"
							alt="Post"
						/>
					</header>
					<div class="p-4 space-y-4">
						<h6 class="h6" data-toc-ignore>Announcements</h6>
						<h3 class="h3" data-toc-ignore>Header of a sample Card</h3>
						<article>
							<p>
								<!-- cspell:disable -->
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam aspernatur provident
								eveniet eligendi cumque consequatur tempore sint nisi sapiente. Iste beatae laboriosam
								iure molestias cum expedita architecto itaque quae rem.
								<!-- cspell:enable -->
							</p>
						</article>
					</div>
					<hr class="opacity-50" />
					<footer class="p-4 flex justify-start items-center space-x-4">
						<Avatar src="https://placehold.co/32x32" width="w-8" />
						<div class="flex-auto flex justify-between items-center">
							<h6 class="font-bold" data-toc-ignore>By Alex</h6>
							<small>On {new Date().toLocaleDateString()}</small>
						</div>
					</footer>
					<!-- <header class="card-header"><h1 class="h1">Header</h1></header>
					<section class="p-4"><h1 class="h1">Content</h1></section>
					<footer class="card-footer"><h1 class="h1">Footer</h1></footer> -->
				</div>
				<div class="col-span-1 card card-hover overflow-hidden">
					<header>
						<img
							src="https://placehold.co/410x175"
							class="bg-black/50 w-full aspect-[21/9]"
							alt="Post"
						/>
					</header>
					<div class="p-4 space-y-4">
						<h6 class="h6" data-toc-ignore>Announcements</h6>
						<h3 class="h3" data-toc-ignore>Header of a sample Card</h3>
						<article>
							<p>
								<!-- cspell:disable -->
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam aspernatur provident
								eveniet eligendi cumque consequatur tempore sint nisi sapiente. Iste beatae laboriosam
								iure molestias cum expedita architecto itaque quae rem.
								<!-- cspell:enable -->
							</p>
						</article>
					</div>
					<hr class="opacity-50" />
					<footer class="p-4 flex justify-start items-center space-x-4">
						<Avatar src="https://placehold.co/32x32" width="w-8" />
						<div class="flex-auto flex justify-between items-center">
							<h6 class="font-bold" data-toc-ignore>By Alex</h6>
							<small>On {new Date().toLocaleDateString()}</small>
						</div>
					</footer>
					<!-- <header class="card-header"><h1 class="h1">Header</h1></header>
					<section class="p-4"><h1 class="h1">Content</h1></section>
					<footer class="card-footer"><h1 class="h1">Footer</h1></footer> -->
				</div>
			</div>
		</section>
		<!-- Previews Text - Forms -->
		<section class="card variant-ghost-surface p-4 grid grid-cols-1 gap-4">
			<h3 class="h3 font-bold col-span-2">How website will look - Text - Forms</h3>
			<div class="card p-4 col-span-2">
				<h3 class="h3 col-span-2" data-toc-ignore>Preview Text Headers</h3>
				<h1 class="h1">Skeleton H1</h1>
				<h2 class="h2">Skeleton H2</h2>
				<h3 class="h3">Skeleton H3</h3>
				<h4 class="h4">Skeleton H4</h4>
				<h5 class="h5">Skeleton H5</h5>
				<h6 class="h6">Skeleton H6</h6>
			</div>
			<div class="card p-4 col-span-2">
				<h3 class="h3 col-span-2" data-toc-ignore>Preview Text Paragraph</h3>
				<p>The quick brown fox jumps over the lazy dog.</p>
			</div>
			<div class="card p-4 col-span-2">
				<h3 class="h3 col-span-2" data-toc-ignore>Preview Anchor/Links</h3>
			</div>

			<div class="card p-4 col-span-2 space-y-4">
				<h3 class="h3 col-span-2" data-toc-ignore>Preview Form</h3>
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">
					<span>Label</span>
					<input class="input text" title="Input (text)" type="text" placeholder="input text" />
				</label>
				<input class="input" type="file" />

				<label class="label">
					<span>Select</span>
					<select class="select">
						<option value="1">Option 1</option>
						<option value="2">Option 2</option>
						<option value="3">Option 3</option>
						<option value="4">Option 4</option>
						<option value="5">Option 5</option>
					</select>
				</label>

				<label class="label">
					<span>Textarea</span>
					<!-- prettier-ignore -->
					<textarea
						class="textarea"
						rows="4"
						placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit.">Once upon a time in a quaint village nestled between rolling hills, there lived a young girl named Lily. She had a peculiar gift – the ability to understand and speak to animals. This extraordinary talent....</textarea
					>
				</label>

				<p>Website</p>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">https://</div>
					<input type="text" placeholder="www.example.com" />
				</div>

				<p>Amount</p>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">(icon)</div>
					<input type="text" placeholder="Amount" />
					<select>
						<option>USD</option>
						<option>CAD</option>
						<option>EURO</option>
					</select>
				</div>
			</div>
		</section>
		<!-- Previews Buttons -->
		<section class="card variant-ghost p-4 grid grid-cols-1 gap-4">
			<h3 class="h3 font-bold col-span-1" data-toc-ignore>Preview</h3>
			<!-- Buttons -->
			<div class="flex flex-col">
				<h3 class="h3 mt-2 font-semibold underline decoration-double pb-3" data-toc-ignore>
					Buttons Style Filled
				</h3>
				<div class="grid grid-cols-3 gap-4">
					<button class="btn variant-filled">Normal filled</button>
					<button class="btn variant-filled-surface">surface</button>
					<button class="btn variant-filled-primary">primary</button>
					<button class="btn variant-filled-secondary">secondary</button>
					<button class="btn variant-filled-tertiary">tertiary</button>
					<button class="btn variant-filled-success">success</button>
					<button class="btn variant-filled-warning">warning</button>
					<button class="btn variant-filled-error">error</button>
				</div>
				<h3 class="h3 mt-2 font-semibold underline decoration-double pb-3" data-toc-ignore>
					Buttons Style Outlined
				</h3>
				<div class="grid grid-cols-3 gap-4">
					<button class="btn variant-outline">Normal outline</button>
					<button class="btn variant-outline-surface">surface</button>
					<button class="btn variant-outline-primary">primary</button>
					<button class="btn variant-outline-secondary">secondary</button>
					<button class="btn variant-outline-tertiary">tertiary</button>
					<button class="btn variant-outline-success">success</button>
					<button class="btn variant-outline-warning">warning</button>
					<button class="btn variant-outline-error">error</button>
				</div>

				<h3 class="h3 mt-2 font-semibold underline decoration-double pb-3" data-toc-ignore>
					Buttons Style Ghost
				</h3>
				<div class="grid grid-cols-3 gap-4">
					<button class="btn variant-ghost">Normal ghost</button>
					<button class="btn variant-ghost-surface">surface</button>
					<button class="btn variant-ghost-primary">primary</button>
					<button class="btn variant-ghost-secondary">secondary</button>
					<button class="btn variant-ghost-tertiary">tertiary</button>
					<button class="btn variant-ghost-success">success</button>
					<button class="btn variant-ghost-warning">warning</button>
					<button class="btn variant-ghost-error">error</button>
				</div>

				<h3 class="h3 mt-2 font-semibold underline decoration-double pb-3" data-toc-ignore>
					Buttons Style Glass
				</h3>
				<div class="grid grid-cols-3 gap-4">
					<button class="btn variant-glass">Normal glass</button>
					<button class="btn variant-glass-surface">surface</button>
					<button class="btn variant-glass-primary">primary</button>
					<button class="btn variant-glass-secondary">secondary</button>
					<button class="btn variant-glass-tertiary">tertiary</button>
					<button class="btn variant-glass-success">success</button>
					<button class="btn variant-glass-warning">warning</button>
					<button class="btn variant-glass-error">error</button>
				</div>
			</div>

			<hr class="opacity-50" />
			<h3 class="h3 mt-2 font-semibold underline decoration-double" data-toc-ignore>
				Progress Bars
			</h3>
			<!-- Progress Bars -->
			<div class="grid grid-cols-1 gap-4">
				<ProgressBar meter="bg-primary-500" track="bg-primary-500/20" value={66} max={100} />
				<ProgressBar meter="bg-secondary-500" track="bg-secondary-500/20" value={50} max={100} />
				<ProgressBar meter="bg-tertiary-500" track="bg-tertiary-500/20" value={33} max={100} />
			</div>
			<hr class="opacity-50" />
			<!-- Badges -->
			<h3 class="h3 mt-2 font-semibold underline decoration-double" data-toc-ignore>
				Badges and/or Tags
			</h3>
			<div class="grid grid-cols-4 gap-4 place-items-center">
				<span class="badge variant-filled-surface">surface</span>
				<span class="badge variant-filled-primary">primary</span>
				<span class="badge variant-filled-secondary">secondary</span>
				<span class="badge variant-filled-tertiary">tertiary</span>
				<span class="badge badge-glass">glass</span>
				<span class="badge variant-filled-success">success</span>
				<span class="badge variant-filled-warning">warning</span>
				<span class="badge variant-filled-error">error</span>
			</div>
			<hr class="opacity-50" />
			<!-- Slide Toggles -->
			<h3 class="h3 mt-2 font-semibold underline decoration-double" data-toc-ignore>
				Slide Toggles/Radio Buttons/CheckBox
			</h3>
			<div class="grid grid-cols-4 gap-4 place-items-center">
				<SlideToggle name="exampleSliderThree" checked />
				<SlideToggle name="exampleSliderOne" active="bg-primary-500" checked />
				<SlideToggle name="exampleSliderTwo" active="bg-secondary-500" checked />
				<SlideToggle name="exampleSliderFour" active="bg-tertiary-500" checked />
			</div>
		</section>

		<!-- CSS Output -->
		<footer class="col-span-2 space-y-4">
			{#if showThemeCSS}<CodeBlock language="ts" code={cssInJsOutput} />{/if}
			<div class="card variant-ghost p-4 text-center">
				<h3 class="h3 pt-2 font-bold">
					Remember to copy the code below and paste into the Notion when done selecting colors
				</h3>
				<h4 class="h4 py-2">Press on the button and copy the code</h4>
				<!-- prettier-ignore -->
				<button class="btn btn-lg variant-filled-primary font-bold" on:click={() => { showThemeCSS = !showThemeCSS; }} disabled={!$storePreview}>
					{!showThemeCSS ? 'Show' : 'Hide'} Theme Source
				</button>
			</div>
		</footer>
	</div>
</div>
