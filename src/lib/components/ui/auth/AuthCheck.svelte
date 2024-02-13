<script lang="ts">
	import AuthToggle from './AuthToggle.svelte';
</script>

<AuthToggle>
	<slot slot="authenticated" />
	<div class="h-72 flex flex-col items-center justify-center gap-4" slot="unauthenticated">
		<p>You must be signed in to view this page.</p>
		<a class="btn" href="/sign-in">Sign In</a>
	</div>
</AuthToggle>
