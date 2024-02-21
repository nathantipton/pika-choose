import { createBracket } from "$lib/bracket/bracket";
import type { CreateBracketPayload } from "$lib/models/api";
import type { Competitor } from "$lib/models/bracket";
import type { PokemonSpecies } from "$lib/models/generation";
import admin from "$lib/server/firebase-admin";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {

    const payload: CreateBracketPayload<PokemonSpecies> = await request.json();

    const competitors: Competitor[] = [];

    for (const [index, competitor] of payload.competitors.entries()) {
        competitors.push({
            id: competitor.id,
            name: competitor.name,
            photoUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${competitor.id}.png`,
            seed: index + 1
        });
    }

    const bracket = await createBracket(competitors, payload.name);

    const doc = await admin.firestore().collection(`user-brackets/${payload.uid}/brackets`).add(bracket);

    bracket.id = doc.id;

    return json({ message: "success", count: bracket.matches.length, bracket });
}