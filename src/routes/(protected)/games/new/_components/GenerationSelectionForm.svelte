<script lang="ts">
	import GenerationCard from './GenerationCard.svelte';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import type { GenerationDTO } from '$lib/models/generation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { user } from '$lib/client/firebase';
	import type { CreateBracketPayload, CreateBracketResponse } from '$lib/models/api';
	import { goto } from '$app/navigation';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	export let generations: GenerationDTO[];
	let selectedGenerations: string[] = ['generation-i'];
	let bracketName: string = '';
	let pokemonCount: number = 0;
	let selectedSpecies: string[] = [];
	$: if (selectedGenerations.length > 0) {
		pokemonCount = 0;
		selectedSpecies = [];
		for (let generation of generations) {
			if (selectedGenerations.includes(generation.name)) {
				selectedSpecies.push(...generation.pokemon_species);
				pokemonCount += generation.pokemon_species.length;
			}
		}

		if (bracketName === '') {
			bracketName = `The Best Pokémon of ${selectedGenerations.map((g) => g.toUpperCase()).join(', ')}`;
		}
	}

	const handleCreateBracket = async () => {
		const uid = $user?.uid ?? null;
		if (!uid) return;

		const payload: CreateBracketPayload = {
			competitors: selectedSpecies,
			name: bracketName,
			uid
		};

		const results = await fetch('/api/bracket', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		const bracketRes: CreateBracketResponse = await results.json();

		await goto(`/games/${bracketRes.bracket.id}`);
	};
</script>

<div class="flex w-full flex-col items-stretch gap-4">
	<Label for="name" class="text-center">Bracket Name</Label>
	<Input id="name" type="text" autocomplete="off" class="text-center" bind:value={bracketName}
	></Input>
</div>
<div>{pokemonCount.toLocaleString()} Pokémon selected</div>
<ToggleGroup.Root
	bind:value={selectedGenerations}
	type="multiple"
	class="grid w-full grid-cols-2 gap-4"
>
	{#each generations as generation (generation.name)}
		<ToggleGroup.Item value={generation.name} class="border">
			{@const selected = selectedGenerations.includes(generation.name)}
			<GenerationCard {generation} {selected}></GenerationCard>
		</ToggleGroup.Item>
	{/each}
</ToggleGroup.Root>

<div>
	<Button on:click={handleCreateBracket} disabled={selectedGenerations.length === 0}
		>Create Bracket</Button
	>
</div>
