<script lang="ts">
	import AuthCheck from '$lib/components/ui/auth/AuthCheck.svelte';
	import { firestore, user, userData } from '$lib/client/firebase';
	import { doc, getDoc, writeBatch } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	let username = '';
	let loading = false;
	let isAvailable = false;
	let debounceTimer: NodeJS.Timeout;

	const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

	$: isValid = username?.length > 2 && username.length < 16 && re.test(username);
	$: isTouched = username.length > 0;
	$: isTaken = isValid && !isAvailable && !loading;

	function checkAvailability() {
		isAvailable = false;
		clearTimeout(debounceTimer);
		if (!isValid) {
			loading = false;
			return;
		}

		loading = true;

		debounceTimer = setTimeout(async () => {
			const ref = doc(firestore, 'usernames', username);
			const exists = await getDoc(ref).then((doc) => doc.exists());
			isAvailable = !exists;
			loading = false;
		}, 500);
	}

	async function confirmUsername() {
		console.log('confirming username', username);
		const batch = writeBatch(firestore);
		batch.set(doc(firestore, 'usernames', username), { uid: $user?.uid });
		batch.set(doc(firestore, 'users', $user!.uid), {
			username,
			photoURL: $user?.photoURL ?? null,
			displayName: $user?.displayName ?? null
		});

		await batch.commit();

		username = '';
		isAvailable = false;

		goto('/');
	}
</script>

<div class="container mx-auto max-w-lg p-4">
	<AuthCheck>
		{#if $userData?.username}
			<div class="flex flex-col gap-4">
				<h2>
					Your username is <span class="text-success font-bold">@{$userData.username}</span>
				</h2>
				<p class="text-sm">(Usernames cannot be changed)</p>
				<Button class="btn" href="/events">Find your first game!</Button>
			</div>
		{:else}
			<h1>What do we call you?</h1>

			<form class="mt-6" on:submit|preventDefault={confirmUsername}>
				<div class="form-control">
					<Label class="label" for="username">Username</Label>
					<Input
						id="username"
						type="text"
						placeholder="Pick something good!"
						autocomplete="off"
						bind:value={username}
						on:input={checkAvailability}
					/>
				</div>

				<div class="min-h-16 my-4 w-full px-2">
					{#if loading}
						<p class="text-sm">Checking availability of @{username}...</p>
					{/if}

					{#if !isValid && isTouched}
						<p class="text-error text-sm">must be 3-16 characters long, alphanumeric only</p>
					{/if}

					{#if isValid && !isAvailable && !loading}
						<p class="text-warning text-sm">
							@{username} is not available
						</p>
					{/if}

					{#if isAvailable}
						<Button variant="secondary" type="submit">Confirm username @{username}</Button>
					{/if}
				</div>
			</form>
		{/if}
	</AuthCheck>
</div>
