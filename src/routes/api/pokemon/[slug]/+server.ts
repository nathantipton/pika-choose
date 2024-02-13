import { error, json } from "@sveltejs/kit";
import PokeAPI from "pokedex-promise-v2";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {

    const { slug } = params;

    const P = new PokeAPI();
    const pokemon = await P.getPokemonByName(slug);

    if (!pokemon) {
        throw error(404, "Pokemon not found");
    }


    return json({ pokemon })
};