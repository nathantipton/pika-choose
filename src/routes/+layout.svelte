<script lang="ts">
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import '../app.pcss';
	import '@fontsource/bungee';
	import '@fontsource-variable/nunito';
	import { Toaster } from '$lib/components/ui/sonner';
	import AuthToggle from '$lib/components/ui/auth/AuthToggle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { auth, user, userData } from '$lib/client/firebase';
	import { goto } from '$app/navigation';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Moon, Sun, User } from 'lucide-svelte';

	const handleSignOut = async () => {
		await auth?.signOut();

		goto('/sign-in');
	};
</script>

<Toaster />
<ModeWatcher />
<div class="min-h-screen-safe">
	<header class="p-4">
		<nav class="mx-auto flex flex-row items-center justify-between md:container">
			<a href="/" title="Home" class="flex flex-row items-center gap-2">
				<img src="/logo.svg" alt="PikaChoose Logo" class="w-24" />
				<h1 class="text-2xl">PikaChoose</h1>
			</a>
			<div class="flex flex-row items-center gap-4">
				<Button on:click={toggleMode} variant="ghost">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
				<AuthToggle>
					<div class="flex flex-row items-center justify-end gap-4" slot="authenticated">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#if $userData?.photoURL}
									<img
										class="h-8 w-8 rounded-full"
										src={$userData.photoURL}
										alt={$userData.username}
									/>
								{:else}
									<User></User>
								{/if}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content side="bottom" align="end">
								<DropdownMenu.Group>
									<DropdownMenu.Item>
										<Button variant="ghost" size="sm" on:click={handleSignOut}>Sign Out</Button>
									</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
					<Button slot="unauthenticated" href="/sign-in">Sign In</Button>
				</AuthToggle>
			</div>
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
