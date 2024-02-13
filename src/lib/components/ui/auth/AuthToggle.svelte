<script lang="ts">
	import { user, authUpdated } from '$lib/client/firebase';
</script>

{#if $user}
	<slot name="authenticated" />
{:else if !$authUpdated}
	<slot name="loading" />
{:else}
	<slot name="unauthenticated" />
{/if}
