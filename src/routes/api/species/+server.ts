import type { Competitor } from "$lib/models/bracket";
import { SPECIES } from "$lib/models/pokemon-species";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";


export const GET: RequestHandler = async ({ params }) => {
    const competitors: { [key: string]: Competitor } = {};

    for (let pokemon of SPECIES) {
        // remove the last character from the url and split the string by "/"
        // then get the last element of the array using the pop() method
        // example  "https://pokeapi.co/api/v2/pokemon/1/"
        // id = 1
        const id = pokemon.url.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', '');
        const competitor: Competitor = {
            id: Number(id),
            name: pokemon.name,
            photoUrl: `https://res.cloudinary.com/dswsojmgx/image/upload/f_auto,q_auto/v1/pokemon/${id}`
        };
        competitors[pokemon.name] = competitor;
    }
    return json(competitors)
}  