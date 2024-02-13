<script>
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="container mx-auto flex max-w-sm flex-col items-center gap-4 py-8">
	<h1 class="text-4xl">Pika Choose</h1>
	<p>Which Pokemon is your favorite?</p>

	<Button href="/games/new">New Bracket</Button>
	<div class="divider">or</div>
	<Button href="/games" variant="outline">Continue another bracket</Button>
</div>
