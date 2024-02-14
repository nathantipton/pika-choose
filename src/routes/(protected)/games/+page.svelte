<script lang="ts">
	import { BracketStatus, type Bracket } from '$lib/models/bracket';
	import { onMount } from 'svelte';
	import { firestore, user } from '$lib/client/firebase';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		CollectionReference,
		collection,
		type DocumentData,
		onSnapshot,
		query,
		where
	} from 'firebase/firestore';

	let brackets: Bracket[] = [];
	let path: string | null = null;
	let colRef: CollectionReference<DocumentData, DocumentData> | null = null;

	onMount(() => {
		const uid = $user?.uid || null;
		if (!uid) return;

		path = `user-brackets/${uid}/brackets`;
		colRef = collection(firestore, path);
		const q = query(colRef, where('status', '==', BracketStatus.InProgress));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			brackets = snapshot.docs.map((doc) => {
				return { ...doc.data(), id: doc.id } as Bracket;
			});
		});
		return () => unsubscribe();
	});
</script>

<div class="container mx-auto flex flex-col gap-4 py-8">
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
