import { GENERATIONS_WITH_SPECIES } from "$lib/graphql/queries";
import { PokeAPI } from "$lib/pokeapi";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {

    const fetchGenerations = async () => {
        const pokeapi = new PokeAPI(fetch);
        return await pokeapi.query(GENERATIONS_WITH_SPECIES).then(data => data.generations);
    }


    return {
        generations: await fetchGenerations()
    }
}