<script lang="ts">
	import GenerationSelectionForm from './_components/GenerationSelectionForm.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ async } = data);
</script>

<div class="container mx-auto my-4 flex max-w-lg flex-col items-center gap-8">
	{#await async.generations$}
		<span>Loading...</span>
	{:then generations}
		<div class="flex flex-col items-center">
			<h1 class="mb-4 text-4xl font-bold">New Bracket</h1>
			<p class="text-center">Choose which generations of Pokémon to include in your bracket.</p>
		</div>
		<GenerationSelectionForm {generations}></GenerationSelectionForm>
	{:catch error}
		<p>Oops something broke...</p>
	{/await}
</div>
