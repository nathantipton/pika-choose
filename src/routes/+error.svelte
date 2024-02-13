<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex min-h-screen-safe flex-col items-center justify-center">
	<h1 class="text-4xl">{$page.status.toLocaleString()}</h1>
	<div>{$page.error?.message}</div>
	<Button class="mt-4" href="/">Go back</Button>
</div>
