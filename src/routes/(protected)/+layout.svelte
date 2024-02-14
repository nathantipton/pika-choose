<script>
	import { goto } from '$app/navigation';
	import { userData } from '$lib/client/firebase';
	import AuthCheck from '$lib/components/ui/auth/AuthCheck.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		const unsubscribe = userData.subscribe((data) => {
			if(!data){
				goto('/username')
			}
		});
		return () => unsubscribe();
	});
</script>

<AuthCheck>
	<slot />
</AuthCheck>
