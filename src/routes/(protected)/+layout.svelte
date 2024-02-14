<script>
	import { goto } from '$app/navigation';
	import { userData } from '$lib/client/firebase';
	import AuthCheck from '$lib/components/ui/auth/AuthCheck.svelte';
	import { onMount } from 'svelte';
</script>

<AuthCheck>
	<slot />
</AuthCheck>
