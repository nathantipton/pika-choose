

// 1. Get all available pokemon ids
// 2. For each pokemon id, check if it exists in cloudinary and if not, upload it

import { POKEMON_IDS } from "$lib/graphql/queries";
import { PokeAPI } from "$lib/pokeapi";
import cloudinary from "$lib/server/cloudinary";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

type PokemonIdObject = {
    id: number
}

export const GET: RequestHandler = async ({ fetch }) => {
    const addedIds: number[] = [];
    const errorIds: number[] = [];

    const pokeapi = new PokeAPI(fetch);
    const { pokemonIds } = await pokeapi.query(POKEMON_IDS) as { pokemonIds: PokemonIdObject[] };
    const idArray = pokemonIds.map(({ id }) => id.toString());
    const batchSize = 50;

    while (idArray.length > 0) {
        const batch = idArray.splice(0, batchSize);
        const set = new Set(batch);
        const existingImgs = await cloudinary.api.resources_by_ids(batch);
        const existingIds = existingImgs.resources.map(({ public_id }) => public_id.split("/")[1]);
        const existingSet = new Set(existingIds);

        // Get the ids that are not in cloudinary yet
        const missingIds = new Set([...set].filter(x => !existingSet.has(x)));

        for (const id of missingIds) {
            const imgUrl = pokeapi.getImageString(parseInt(id));

            try {
                const res = await cloudinary.uploader.upload(imgUrl, { public_id: `pokemon/${id}`, tags: `pokemon` });
                addedIds.push(parseInt(id));
            } catch (error) {
                errorIds.push(parseInt(id));
                console.error(error);
            }
        }

    }



    return json({
        added: addedIds,
        error: errorIds,
        message: `Added ${addedIds.length} ids. Failed to add ${errorIds.length} ids.`
    })
};
