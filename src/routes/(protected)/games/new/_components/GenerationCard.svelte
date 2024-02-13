<script lang="ts">
	import type { GenerationDTO } from '$lib/models/generation';
	import { Check } from 'lucide-svelte/icons';

	export let generation: GenerationDTO;
	export let selected: boolean;
</script>

<div class="flex w-full flex-row items-center gap-2 p-4 text-sm uppercase">
	{#if selected}
		<Check size="14" />
	{/if}
	{generation.name}
</div>
