<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, user } from '$lib/client/firebase';
	import { GoogleAuthProvider, signInAnonymously, signInWithPopup } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import MagicLinkForm from './_components/MagicLinkForm.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import AuthToggle from '$lib/components/ui/auth/AuthToggle.svelte';
	import { authStatus } from '$lib/stores/auth.stores';
	import { AuthStatus } from '$lib/models/auth';

	export let data;

	const signInWithGoogle = async () => {
		const loader = toast.loading('Signing in...');
		try {
			await signInWithPopup(auth, new GoogleAuthProvider());
			toast.success('Signed in successfully!');
		} catch (error) {
			toast.error('Failed to sign in. Please try again later');
			console.error(error);
		} finally {
			toast.dismiss(loader);
		}
	};

	const signInAnon = async () => {
		let loader;
		try {
			await signInAnonymously(auth);
		} catch (error) {
			loader = toast.error('Failed to sign in. Please try again later');
			console.error(error);
		} finally {
			if (loader) toast.dismiss(loader);
		}
	};

	onMount(() => {
		const unsubscribe = user.subscribe(async (user) => {
			if (user) {
				await goto('/');
			}
		});
		return () => unsubscribe();
	});
</script>

<AuthToggle>
	<main
		class="mx-auto flex max-w-sm flex-col items-stretch justify-start gap-4 py-8"
		slot="unauthenticated"
	>
		<h1 class="text-center text-3xl">Sign In</h1>
		<MagicLinkForm dataForm={data.form} />

		<div class="divider">or</div>
		<!-- social sign on -->
		<div class="flex flex-row items-stretch justify-center gap-4">
			<Button variant="outline" on:click={() => signInWithGoogle()}>Sign in with Google</Button>
		</div>
		<div class="flex flex-row items-stretch justify-center gap-4">
			<Button variant="ghost" class="btn btn-icon" on:click={() => signInAnon()}
				>Continue as guest</Button
			>
		</div>
	</main>
	<main
		class="mx-auto flex max-w-sm flex-col items-stretch justify-start gap-4 py-8"
		slot="authenticated"
	>
		<h1 class="text-center text-3xl">You're already Signed In</h1>
		<Button href="/" variant="outline">Go to Home</Button>
		<Button on:click={() => auth.signOut()}>Sign Out</Button>
	</main>
</AuthToggle>
