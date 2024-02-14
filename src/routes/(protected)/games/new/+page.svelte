<script lang="ts">
	import GenerationSelectionForm from './_components/GenerationSelectionForm.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { PageData } from './$types';
	import { Loader2 } from 'lucide-svelte';

	export let data: PageData;
	$: ({ async } = data);
</script>

<div class="container mx-auto my-4 flex max-w-lg flex-col items-center gap-8">
	{#await async.generations$}
		<Loader2 class="animate-spin" />
	{:then generations}
		<div class="flex flex-col items-center">
			<h1 class="mb-4 text-2xl font-bold md:text-4xl">New Bracket</h1>
		</div>
		<GenerationSelectionForm {generations}></GenerationSelectionForm>
	{:catch error}
		<p>Oops something broke...</p>
	{/await}
</div>
