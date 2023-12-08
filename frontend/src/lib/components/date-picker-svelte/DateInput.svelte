<script>
	import { fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { toText } from './date-utils.js';
	import { parse, createFormat } from './parse.js';
	import DateTimePicker from './DatePicker.svelte';
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	const dispatch = createEventDispatcher();
	const defaultDate = /* @__PURE__ */ new Date();
	const innerStore = writable(null);
	const store = (() => {
		return {
			subscribe: innerStore.subscribe,
			set: (d) => {
				if (d === null) {
					innerStore.set(null);
					value = d;
				} else if (d.getTime() !== $innerStore?.getTime()) {
					innerStore.set(d);
					value = d;
				}
			}
		};
	})();
	export let value = null;
	export let dateTimeInputClass = '';
	$: store.set(value);
	export let min = new Date(defaultDate.getFullYear() - 20, 0, 1);
	export let max = new Date(defaultDate.getFullYear(), 11, 31, 23, 59, 59, 999);
	export let placeholder = '2020-12-31 23:00:00';
	export let valid = true;
	export let disabled = false;
	export let name = 'dateInput';
	export let id = 'dateInput';

	export let format = 'yyyy-MM-dd HH:mm:ss';
	let formatTokens = createFormat(format);
	$: formatTokens = createFormat(format);
	export let locale = {};
	function valueUpdate(value2, formatTokens2) {
		text = toText(value2, formatTokens2);
	}
	$: valueUpdate($store, formatTokens);
	export let text = toText($store, formatTokens);
	function textUpdate(text2, formatTokens2) {
		if (text2.length) {
			const result = parse(text2, formatTokens2, $store);
			if (result.date !== null) {
				valid = true;
				store.set(result.date);
			} else {
				valid = false;
			}
		} else {
			valid = true;
			if (value) {
				value = null;
				store.set(null);
			}
		}
	}
	$: textUpdate(text, formatTokens);
	export let visible = false;
	export let closeOnSelection = false;
	export let browseWithoutSelecting = false;
	function onFocusOut(e) {
		if (
			e?.currentTarget instanceof HTMLElement &&
			e.relatedTarget &&
			e.relatedTarget instanceof Node &&
			e.currentTarget.contains(e.relatedTarget)
		) {
			return;
		} else {
			visible = false;
		}
	}
	function keydown(e) {
		if (e.key === 'Escape' && visible) {
			visible = false;
			e.preventDefault();
			e.stopPropagation();
		} else if (e.key === 'Enter') {
			visible = !visible;
			e.preventDefault();
		}
	}
	function onSelect(e) {
		dispatch('select', e.detail);
		if (closeOnSelection) {
			visible = false;
		}
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions --- class:invalid={!valid} -->
<div class="date-time-field" on:focusout={onFocusOut} on:keydown={keydown}>
	<input
		{name}
		{id}
		type="text"
		value={text}
		{placeholder}
		{disabled}
		class={twMerge(dateTimeInputClass, $$props.class, valid ? '' : 'invalid')}
		on:focus={() => (visible = true)}
		on:mousedown={() => (visible = true)}
		on:input={(e) => {
			if (
				e instanceof InputEvent &&
				e.inputType === 'insertText' &&
				typeof e.data === 'string' &&
				e.currentTarget.value === text + e.data
			) {
				// check for missing punctuation, and add if there is any
				let result = parse(text, formatTokens, $store);
				if (result.missingPunctuation !== '' && !result.missingPunctuation.startsWith(e.data)) {
					text = text + result.missingPunctuation + e.data;
					return;
				}
			}
			text = e.currentTarget.value;
		}}
	/>
	{#if visible && !disabled}
		<div class="picker" class:visible transition:fly={{ duration: 80, easing: cubicInOut, y: -5 }}>
			<DateTimePicker
				on:focusout={onFocusOut}
				on:select={onSelect}
				bind:value={$store}
				{min}
				{max}
				{locale}
				{browseWithoutSelecting}
			/>
		</div>
	{/if}
</div>

<style>
	.date-time-field {
		position: relative;
	}

	/* input {
  color: var(--date-picker-foreground, #000000);
  min-width: 0px;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  border: 0px solid rgba(103, 113, 137, 0.3);
  border-radius: 3px;
  width: 100%;
  height:100%;
  outline: none;
  transition: all 80ms cubic-bezier(0.4, 0, 0.2, 1);
}
input:focus {
  border-color: var(--date-picker-highlight-border, #0269f7);
  box-shadow: 0px 0px 0px 2px var(--date-picker-highlight-shadow, rgba(2, 105, 247, 0.4));
}
input:disabled {
  opacity: 0.5;
}
*/
	.invalid {
		border: 1px solid rgba(249, 47, 114, 0.5);
		background-color: rgba(249, 47, 114, 0.1);
	}
	.invalid:focus {
		border-color: #f92f72;
		box-shadow: 0px 0px 0px 2px rgba(249, 47, 114, 0.5);
	}

	.picker {
		display: none;
		position: absolute;
		margin-top: 1px;
		z-index: 10;
	}
	.picker.visible {
		display: block;
	}
</style>
