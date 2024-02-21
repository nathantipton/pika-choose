<script lang="ts">
	import { type Bracket } from '$lib/models/bracket';
	import { onMount } from 'svelte';
	import { firestore, user } from '$lib/client/firebase';
	import Button from '$lib/components/ui/button/button.svelte';

	import { FirestoreBracketDataProvider } from '$lib/bracket/providers/firestore';

	let brackets: Bracket[] = [];

	onMount(async () => {
		const uid = $user?.uid || null;
		if (!uid) return;

		const firebaseBracket = new FirestoreBracketDataProvider(firestore);
		brackets = await firebaseBracket.getUserBracketsInProgress(uid);
	});
</script>

<div class="container mx-auto flex max-w-md flex-col gap-4 py-8">
	<h1 class="text-center text-2xl md:text-4xl">My Brackets</h1>
	<div class="flex flex-col gap-4">
		{#each brackets as bracket}
			<a href={`/games/${bracket.id}`} class="flex flex-col items-center gap-4 rounded border p-2">
				<span class="text-center text-sm">{bracket.name}</span>
			</a>
		{/each}
		{#if brackets.length === 0}
			<p class="text-center text-sm text-muted-foreground">You don't have any brackets yet.</p>
			<Button href="/games/new">New Bracket</Button>
		{/if}
	</div>
</div>
