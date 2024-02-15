<script lang="ts">
	import type { Competitor } from '$lib/models/bracket';
	import { POKEMON_COMPETITORS } from '$lib/models/pokemon-competitors';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let slug: string | null | undefined = null;
	// Reactive variable to store the competitor's data
	let pokemon = writable<Competitor | null>(null);

	onMount(() => {
		if (slug && Object(POKEMON_COMPETITORS).hasOwnProperty(slug)) {
			const competitor = POKEMON_COMPETITORS[
				slug as keyof typeof POKEMON_COMPETITORS
			] as Competitor;
			if (competitor) {
				pokemon.set(competitor); // Update the reactive variable
			}
		}
	});
</script>

{#if $pokemon}
	{#key $pokemon.id}
		<div class="flex w-48 flex-col items-center justify-center p-4">
			<img src={$pokemon.photoUrl} alt={$pokemon.name} />
			<h5 class="text-foreground">{$pokemon.name.toUpperCase()}</h5>
		</div>
	{/key}
{/if}
