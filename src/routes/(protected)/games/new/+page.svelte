<script lang="ts">
	import GenerationSelectionForm from './_components/GenerationSelectionForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ generations } = data);
</script>

<div class="container mx-auto my-4 flex max-w-lg flex-col items-center gap-8">
	<div class="flex flex-col items-center">
		<h1 class="mb-4 text-2xl font-bold md:text-4xl">New Bracket</h1>
	</div>
	<GenerationSelectionForm {generations}></GenerationSelectionForm>
</div>
