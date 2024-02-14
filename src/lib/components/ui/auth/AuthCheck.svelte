<script lang="ts">
	import Button from '../button/button.svelte';
	import AuthToggle from './AuthToggle.svelte';
</script>

<AuthToggle>
	<slot slot="authenticated" />
	<div class="h-72 flex flex-col items-center justify-center gap-4 my-8" slot="unauthenticated">
		<p class="text-muted-foreground">You must be signed in to view this page.</p>
		<Button href="/sign-in">Sign In</Button>
	</div>
</AuthToggle>
