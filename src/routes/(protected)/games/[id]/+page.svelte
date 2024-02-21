<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { firestore, user } from '$lib/client/firebase';
	import {
		DocumentReference,
		doc,
		onSnapshot,
		type DocumentData,
		updateDoc,
		increment
	} from 'firebase/firestore';
	import { BracketStatus, type Bracket, type Match, MatchStatus } from '$lib/models/bracket';
	import Button from '$lib/components/ui/button/button.svelte';
	import PokemonThumbnail from '$lib/components/pokemon/PokemonThumbnail.svelte';
	import PokemonCard from '$lib/components/pokemon/PokemonCard.svelte';
	import { Loader2 } from 'lucide-svelte';
	import autoAnimate from '@formkit/auto-animate';
	import { tweened } from 'svelte/motion';

	let bracket: Bracket | null = null;
	let path: string | null = null;
	let docRef: DocumentReference<DocumentData, DocumentData> | null = null;
	let currentMatch: Match | null = null;
	const percentComplete = tweened(0, { duration: 500 });

	onMount(() => {
		const uid = $user?.uid || null;
		if (!uid) return;

		path = `user-brackets/${uid}/brackets/${$page.params.id}`;
		docRef = doc(firestore, path);
		const unsubscribe = onSnapshot(docRef, (doc) => {
			bracket = { ...doc.data(), id: doc.id } as Bracket;
			console.log(bracket);
		});

		return () => unsubscribe();
	});

	const handleBegin = async () => {
		if (!path || !docRef) return;

		await updateDoc(docRef, {
			status: BracketStatus.InProgress
		});
	};

	const getCompetitor = (id: string | number | null) => {
		if (!bracket || !id) return null;
		console.log(id);
		return bracket.competitors.find((c) => c.id?.toString() === id.toString()) || null;
	};

	$: if (bracket && bracket.status === BracketStatus.InProgress && bracket.currentMatchId) {
		currentMatch = bracket.matches[bracket.currentMatchId];
		percentComplete.set((bracket.numberOfCompletedMatches / bracket.numberOfMatches) * 100);
	}

	const handleMatchWinner = async (
		match: Match | null,
		winner: string | number | undefined | null
	) => {
		if (!path || !docRef || !bracket || !winner) return;

		if (!match) return;
		if (!winner) return;

		const updatedMatches = { ...bracket.matches };
		console.log(match);
		// Update the match with the winner
		const updatedMatch = { ...match, winner, status: MatchStatus.Complete };
		updatedMatches[match.id] = updatedMatch;

		// if the match is the final match, update the bracket status to complete
		if (match.isFinal) {
			bracket.status = BracketStatus.Complete;

			await updateDoc(docRef, {
				matches: updatedMatches,
				status: bracket.status,
				winner
			});

			return;
		}

		// Move the winner to the winner goes to match
		if (!match.winnerGoesTo) return;
		const winnerGoesToMatch = updatedMatches[match.winnerGoesTo];
		if (winnerGoesToMatch.competitor1 === null) {
			winnerGoesToMatch.competitor1 = winner;
		} else if (winnerGoesToMatch.competitor2 === null) {
			winnerGoesToMatch.competitor2 = winner;
		}

		// Update the brackets current match id with the next match id if it exists and the match is not complete
		let nextMatchId: string | null = null;
		while (nextMatchId === null) {
			if (!match?.nextMatchId) break;
			const nextMatch: Match = updatedMatches[match.nextMatchId];
			if (nextMatch && nextMatch.status !== MatchStatus.Complete) {
				nextMatchId = nextMatch.id;
			} else {
				console.log(`Skipping match ${nextMatch.id}`);
				match = nextMatch;
			}
		}
		bracket.currentMatchId = nextMatchId;

		await updateDoc(docRef, {
			matches: updatedMatches,
			currentMatchId: bracket.currentMatchId,
			status: bracket.status,
			numberOfCompletedMatches: increment(1)
		});
	};
</script>

<div class="container mx-auto flex flex-col items-center justify-start gap-8 py-4 md:py-4">
	{#if bracket}
		<h1 class="text-center text-2xl md:text-4xl">{bracket.name}</h1>
		<div
			class="absolute bottom-0 left-0 right-0 top-0 -z-10 flex max-h-screen-safe flex-row flex-wrap justify-center gap-4 overflow-hidden opacity-10"
		>
			{#each bracket.competitors as pokemon (pokemon)}
				<PokemonThumbnail {pokemon}></PokemonThumbnail>
			{/each}
		</div>
		<div use:autoAnimate>
			{#if bracket.status === BracketStatus.NotStarted}
				<Button on:click={handleBegin}>Let's Begin!</Button>
			{:else if bracket.status === BracketStatus.InProgress}
				{@const competitor1 = getCompetitor(currentMatch?.competitor1 || null)}
				{@const competitor2 = getCompetitor(currentMatch?.competitor2 || null)}
				{#if currentMatch && competitor1 && competitor2}
					<div class="mb-4 flex flex-row items-center justify-between">
						<h4>Round {currentMatch.round} of {bracket.numberOfRounds}</h4>
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
			{:else if bracket.status === BracketStatus.Complete}
				{@const winner = getCompetitor(bracket.winner || null)}
				<div class="flex flex-col items-center gap-4">
					<h3 class="uppercase">{winner?.name} wins!</h3>
					{#if winner}
						{#key bracket.winner}
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
