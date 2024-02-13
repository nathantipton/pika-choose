<script>
	import { user, userData } from '$lib/client/firebase';
	import AuthCheck from '$lib/components/ui/auth/AuthCheck.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<AuthCheck>
	{#if $user && $userData}
		<slot />
	{:else if !$userData}
		<div class="container mx-auto flex max-w-md flex-col items-center gap-4">
			<h3 class="text-center text-2xl">Almost ready!</h3>
			<p>Let's pick a username next!</p>
			<Button href="/username">Finish your profile</Button>
		</div>
	{/if}
</AuthCheck>
