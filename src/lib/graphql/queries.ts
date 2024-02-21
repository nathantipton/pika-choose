export const GENERATIONS_WITH_SPECIES = `
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

export const POKEMON_IDS = `
        query pokemonIds {
            pokemonIds: pokemon_v2_pokemon(distinct_on: id) {
                id
            }
        }`