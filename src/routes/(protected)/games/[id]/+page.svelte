<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { firestore, user } from '$lib/client/firebase';
	import { doc, onSnapshot } from 'firebase/firestore';
	import type { Bracket } from '$lib/models/bracket';
	import PokemonCard from '$lib/components/pokemon/PokemonCard.svelte';

	let bracket: Bracket | null = null;

	onMount(() => {
		const uid = $user?.uid || null;
		if (!uid) return;

		const path = `user-brackets/${uid}/brackets/${$page.params.id}`;
		const docRef = doc(firestore, path);
		const unsubscribe = onSnapshot(docRef, (doc) => {
			bracket = { ...doc.data(), id: doc.id } as Bracket;
		});

		return () => unsubscribe();
	});
</script>

<div class="container mx-auto flex flex-col items-stretch justify-start gap-8 py-8">
	{#if bracket}
		<h1 class="text-center">{bracket.name}</h1>
		<div>
			{#each bracket.competitors as pokemon (pokemon)}
				<PokemonCard slug={pokemon}></PokemonCard>
			{/each}
		</div>
	{:else}
		<p>Loading...</p>
	{/if}
</div>
