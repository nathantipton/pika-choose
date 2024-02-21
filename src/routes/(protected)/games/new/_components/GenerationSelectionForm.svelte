<script lang="ts">
	import GenerationCard from './GenerationCard.svelte';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import type { GenerationDTO, PokemonSpecies } from '$lib/models/generation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { user } from '$lib/client/firebase';
	import type { CreateBracketPayload, CreateBracketResponse } from '$lib/models/api';
	import { goto } from '$app/navigation';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { Loader2 } from 'lucide-svelte';

	export let generations: GenerationDTO[];
	let selectedGenerations: string[] = ['generation-i'];
	let bracketName: string = `My Favorite Pokémon`;
	let pokemonCount: number = 0;
	let selectedSpecies: PokemonSpecies[] = [];
	let submitting = false;

	$: if (selectedGenerations.length > 0) {
		pokemonCount = 0;
		selectedSpecies = [];
		for (let generation of generations) {
			if (selectedGenerations.includes(generation.name)) {
				selectedSpecies.push(...generation.pokemon_species);
				pokemonCount += generation.pokemon_species.length;
			}
		}
	}

	const handleCreateBracket = async () => {
		const uid = $user?.uid ?? null;
		if (!uid) return;

		submitting = true;

		try {
			const payload: CreateBracketPayload<PokemonSpecies> = {
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
		} catch (error) {
			console.error(error);
			toast.error('Failed to create bracket');
		} finally {
			submitting = false;
		}
	};
</script>

{#if submitting}
	<div>
		<Loader2 class="animate-spin"></Loader2>
	</div>
{:else}
	<div class="flex w-full flex-col items-stretch gap-4">
		<Label for="name" class="text-center">Bracket Name</Label>
		<Input id="name" type="text" autocomplete="off" class="text-center" bind:value={bracketName}
		></Input>
	</div>
	<p class="text-center text-sm text-muted-foreground md:text-base">
		Choose which generations of Pokémon to include in your bracket.
	</p>
	<ToggleGroup.Root
		bind:value={selectedGenerations}
		type="multiple"
		class="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
	>
		{#each generations as generation (generation.name)}
			<ToggleGroup.Item value={generation.name} class="border">
				{@const selected = selectedGenerations.includes(generation.name)}
				<GenerationCard {generation} {selected}></GenerationCard>
			</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>
	<div class="text-sm text-muted-foreground">{pokemonCount.toLocaleString()} Pokémon selected</div>

	<Button class="w-full" on:click={handleCreateBracket} disabled={selectedGenerations.length === 0}
		>Create Bracket</Button
	>
{/if}
