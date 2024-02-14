<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/client/firebase';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { signInWithEmailLink } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { writable } from 'svelte/store';

	const email = writable('');

	const signInWithEmail = async () => {
		const loader = toast.loading('Signing in...');
		try {
			await signInWithEmailLink(auth, $email, window.location.href);
			toast.success('Successfully signed in!');
			email.set('');
		} catch (error) {
			toast.error('Failed to sign in. Please resend the magic link and try again later.');
			console.error(error);
		} finally {
			toast.dismiss(loader);
		}
	};

	onMount(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				goto('/games');
			}
		});
	});
</script>

<main class="mx-auto flex max-w-md flex-col items-stretch justify-start gap-4 py-8">
	<h1 class="text-center text-2xl">Confirm your email address</h1>
	<form
		class="flex flex-col items-stretch justify-start gap-4"
		on:submit|preventDefault={() => signInWithEmail()}
	>
		<div class="form-control">
			<Label for="email">Email</Label>
			<Input
				class="input input-bordered"
				type="email"
				id="email"
				name="email"
				placeholder="Email"
				bind:value={$email}
			/>
		</div>
		<Button type="submit">Sign In</Button>
	</form>
</main>
