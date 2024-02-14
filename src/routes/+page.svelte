<script>
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="container mx-auto flex flex-col items-stretch gap-4 py-8">
	<p class="mb-8 text-center">Do you know which Pokemon is your favorite?</p>

	<Button href="/games/new">New Bracket</Button>
	<Button href="/games" variant="outline">Continue another bracket</Button>
</div>
