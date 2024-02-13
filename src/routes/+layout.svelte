<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.pcss';
	import '@fontsource/bungee';
	import '@fontsource-variable/nunito';
	import { Toaster } from '$lib/components/ui/sonner';
	import AuthToggle from '$lib/components/ui/auth/AuthToggle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { auth, user, userData } from '$lib/client/firebase';
	import { goto } from '$app/navigation';

	const handleSignOut = async () => {
		await auth?.signOut();

		goto('/sign-in');
	};
</script>

<Toaster />
<ModeWatcher />
<div class="min-h-screen-safe">
	<header class="p-4">
		<nav class="container mx-auto flex flex-row items-center justify-between">
			<a href="/" title="Home"><h1 class="text-2xl">PikaChoose</h1></a>

			<AuthToggle>
				<div class="flex flex-row items-center justify-end gap-4" slot="authenticated">
					{#if $user && $userData}
						{#if $userData.photoURL}
							<img class="h-8 w-8 rounded-full" src={$userData.photoURL} alt={$userData.username} />
						{/if}
						<span>{$userData?.username ?? $user.email}</span>
					{/if}
					<Button on:click={handleSignOut}>Sign Out</Button>
				</div>

				<Button slot="unauthenticated" href="/sign-in">Sign In</Button>
			</AuthToggle>
		</nav>
	</header>
	<slot />
</div>

<style>
	:global(body) {
		font-family: 'Nunito Variable', sans-serif;
	}

	:global(h1, h2, h3, h4, h5) {
		font-family: 'Bungee', sans-serif;
	}
</style>
