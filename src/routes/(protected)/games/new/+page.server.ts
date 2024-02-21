import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {

    const fetchGenerations = async () => {

        const query = `
        query generationsWithSpecies {
            generations: pokemon_v2_generation(order_by: {id: asc}) {
                name
                id
                pokemon_species: pokemon_v2_pokemonspecies(order_by: {order: asc}) {
                    id
                    name
                    order
                }
            }
        }`

        const response = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query
            })
        });

        const { data } = await response.json();
        return data.generations;
    }


    return {

        generations: await fetchGenerations()

    }
}