<script lang="ts">
	import type { Competitor } from '$lib/models/bracket';

	export let pokemon: Competitor;
</script>

<div class="flex w-24 flex-col items-center justify-center p-4">
	<img src={pokemon.photoUrl} alt={pokemon.name} />
</div>
