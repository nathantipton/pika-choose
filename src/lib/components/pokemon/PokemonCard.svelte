<script lang="ts">
	import type { Competitor } from '$lib/models/bracket';
	import { POKEMON_COMPETITORS } from '$lib/models/pokemon-competitors';
	import { Image } from '@unpic/svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let pokemon: Competitor;

	
</script>

{#if pokemon}
	{#key pokemon.id}
		<div class="flex w-48 flex-col items-center justify-center p-4">
			<Image
				priority={true}
				layout="fullWidth"
				height={176}
				src={pokemon.photoUrl}
				alt={pokemon.name}
			/>
			<h5 class="text-foreground">{pokemon.name.toUpperCase()}</h5>
		</div>
	{/key}
{/if}
