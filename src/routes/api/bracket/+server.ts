import { createBracket } from "$lib/bracket/bracket";
import type { CreateBracketPayload } from "$lib/models/api";
import type { Competitor } from "$lib/models/bracket";
import { POKEMON_COMPETITORS } from "$lib/models/pokemon-competitors";
import admin from "$lib/server/firebase-admin";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {

    const payload: CreateBracketPayload = await request.json();

    const competitors: Competitor[] = [];

    for (const [index, competitor] of payload.competitors.entries()) {
        const pokemon = POKEMON_COMPETITORS[competitor as keyof typeof POKEMON_COMPETITORS];
        competitors.push({
            id: pokemon.id,
            name: pokemon.name,
            photoUrl: pokemon.photoUrl,
            seed: index + 1
        });
    }

    const bracket = await createBracket(competitors, payload.name);

    const doc = await admin.firestore().collection(`user-brackets/${payload.uid}/brackets`).add(bracket);

    bracket.id = doc.id;

    return json({ message: "success", count: bracket.matches.length, bracket });
}