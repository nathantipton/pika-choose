<script lang="ts">
	import type { Competitor } from '$lib/models/bracket';
	import { Image } from '@unpic/svelte';

	export let pokemon: Competitor;
</script>

<div class="flex w-24 flex-col items-center justify-center p-4">
	<Image
		priority={true}
		layout="fullWidth"
		height={70}
		src={pokemon.photoUrl}
		alt={pokemon.name}
	/>
</div>
