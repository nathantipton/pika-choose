<script lang="ts">
	import type { Competitor } from '$lib/models/bracket';

	export let pokemon: Competitor | null = null;
</script>

{#if pokemon}
	<div class="flex w-48 flex-col items-center justify-center p-4">
		<img src={pokemon.photoUrl} alt={pokemon.name} />
		<h5>{pokemon.name.toUpperCase()}</h5>
	</div>
{/if}
