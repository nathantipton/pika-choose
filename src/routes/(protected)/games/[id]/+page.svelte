<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { firestore, user } from '$lib/client/firebase';
	import { BracketStatus, type Bracket, type Match } from '$lib/models/bracket';
	import Button from '$lib/components/ui/button/button.svelte';
	import PokemonThumbnail from '$lib/components/pokemon/PokemonThumbnail.svelte';
	import PokemonCard from '$lib/components/pokemon/PokemonCard.svelte';
	import { Loader2 } from 'lucide-svelte';
	import autoAnimate from '@formkit/auto-animate';
	import { tweened } from 'svelte/motion';
	import { FirestoreBracketDataProvider } from '$lib/bracket/providers/firestore';
	import { BracketService } from '$lib/bracket/bracket';
	import type { Writable } from 'svelte/store';
	let bracketService: BracketService;

	let bracket: Writable<Bracket | null>;
	let currentMatch: Match | null;
	const percentComplete = tweened(0, { duration: 500 });

	onMount(() => {
		const uid = $user?.uid || null;
		if (!uid) return;
		bracketService = new BracketService(
			new FirestoreBracketDataProvider(firestore),
			uid,
			$page.params.id
		);

		bracket = bracketService.bracketStore;

		return () => bracketService.unsubscribe();
	});

	const handleBegin = async () => {
		await bracketService.beginBracket();
	};

	const getCompetitor = (id: string | number | null) => {
		if (!id) return null;
		return bracketService.getCompetitorById(id.toString());
	};

	$: if (bracket) {
		console.log('Bracket', bracket);
	}

	$: if ($bracket && $bracket.status === BracketStatus.InProgress && $bracket.currentMatchId) {
		currentMatch = $bracket.matches[$bracket.currentMatchId];
		percentComplete.set(($bracket.numberOfCompletedMatches / $bracket.numberOfMatches) * 100);
	}

	const handleMatchWinner = async (
		match: Match | null,
		winner: string | number | undefined | null
	) => {
		if (!match || !bracket || !winner) return;

		await bracketService.setMatchWinner(match, winner.toString());
	};
</script>

<div
	class="container mx-auto flex max-w-md flex-col items-center justify-start gap-8 py-4 md:max-w-xl md:py-4"
>
	{#if $bracket}
		<h1 class="text-center text-2xl md:text-4xl">{$bracket.name}</h1>
		<div
			class="absolute bottom-0 left-0 right-0 top-0 -z-10 flex max-h-screen-safe flex-row flex-wrap justify-center gap-4 overflow-hidden opacity-10"
		>
			{#each $bracket.competitors as pokemon (pokemon)}
				<PokemonThumbnail {pokemon}></PokemonThumbnail>
			{/each}
		</div>
		<div use:autoAnimate class="flex w-full flex-col items-stretch">
			{#if $bracket.status === BracketStatus.NotStarted}
				<Button on:click={handleBegin}>Let's Begin!</Button>
			{:else if $bracket.status === BracketStatus.InProgress}
				{@const competitor1 = getCompetitor(currentMatch?.competitor1 || null)}
				{@const competitor2 = getCompetitor(currentMatch?.competitor2 || null)}
				{#if currentMatch && competitor1 && competitor2}
					<div class="mb-4 flex w-full flex-row items-center justify-between">
						<h4>Round {currentMatch.round} of {$bracket.numberOfRounds}</h4>
						<p class="text-lg font-bold">
							{$percentComplete.toFixed(0)}%
						</p>
					</div>

					{#key currentMatch.id}
						<div class="flex flex-col items-center gap-4 md:flex-row">
							<Button
								class="border bg-background transition-all focus:scale-95"
								variant="ghost"
								on:click={() => handleMatchWinner(currentMatch, competitor1.id)}
							>
								<PokemonCard pokemon={competitor1}></PokemonCard>
							</Button>

							<h3>VS</h3>
							<Button
								class="border bg-background transition-all focus:scale-95"
								variant="ghost"
								on:click={() => handleMatchWinner(currentMatch, competitor2.id)}
							>
								<PokemonCard pokemon={competitor2}></PokemonCard>
							</Button>
						</div>
					{/key}
				{/if}
			{:else if $bracket.status === BracketStatus.Complete}
				{@const winner = getCompetitor($bracket.winner || null)}
				<div class="flex flex-col items-center gap-4">
					<h3 class="uppercase">{winner?.name} wins!</h3>
					{#if winner}
						{#key $bracket.winner}
							<PokemonCard pokemon={winner}></PokemonCard>
						{/key}
					{/if}
				</div>
			{/if}
		</div>
	{:else}
		<Loader2 class="animate-spin" />
	{/if}
</div>
