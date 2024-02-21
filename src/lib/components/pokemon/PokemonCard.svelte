<script lang="ts">
	import type { Competitor } from '$lib/models/bracket';
	import { Image } from '@unpic/svelte';


	export let pokemon: Competitor;
</script>

{#if pokemon}
	{#key pokemon.id}
		<div class="flex w-48 flex-col items-center justify-center p-4">
			<Image
				class="user-select-none"
				priority={true}
				layout="fullWidth"
				height={176}
				src={pokemon.photoUrl}
				alt={pokemon.name}
			/>
			<h5 class="user-select-none text-foreground">{pokemon.name.toUpperCase()}</h5>
		</div>
	{/key}
{/if}
