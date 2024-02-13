<script lang="ts">
	import { get } from 'svelte/store';

	export let slug: string;

	$: if (slug) {
		getSpecies(slug);
	}

    const getSpecies = async (slug: string) => {
        const response = await fetch(`/api/pokemon/${slug}`);
        const data = await response.json();
        console.log(data);
    };
</script>

{slug}
