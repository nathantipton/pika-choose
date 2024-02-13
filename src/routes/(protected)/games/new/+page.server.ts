import type { GenerationDTO } from '$lib/models/generation';
import Pokedex from 'pokedex-promise-v2';
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {

    const fetchGenerations = async () => {
        const P = new Pokedex();
        const generations = await P.getGenerationsList();

        const genResults: GenerationDTO[] = [];

        for (const gen of generations.results) {
            const genData = await P.getGenerationByName(gen.name);
            genResults.push({
                name: genData.name,
                pokemon_species: genData.pokemon_species.map(p => p.name)
            });
        }

        return genResults;
    }


    return {
        async: {
            generations$: fetchGenerations()
        }
    }
}