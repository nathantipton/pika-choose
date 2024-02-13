import Pokedex from 'pokedex-promise-v2';
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {

    const fetchGen1Pokemon = async () => {
        const P = new Pokedex();
        return P.getGenerationByName('generation-i');
    }


    const fetchPokemon = async (name: string) => {
        const P = new Pokedex();


        return P.getPokemonByName(name);
    }


    return {
        async: {
            generation$: fetchGen1Pokemon().then((gen) => {
                gen.pokemon_species.sort((a, b) => Number(a.url.slice(0, -1).split('/').pop()) - Number(b.url.slice(0, -1).split('/').pop()));
                return gen;
            }),
            pokemon$: fetchPokemon('bulbasaur'),
        }

    }
}