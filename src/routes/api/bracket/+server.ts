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
            photoUrl: `https://res.cloudinary.com/dswsojmgx/image/upload/f_auto,q_auto/v1/pokemon/${competitor.id}`,
            seed: index + 1
        });
    }

    const bracket = await createBracket(competitors, payload.name);

    const doc = await admin.firestore().collection(`user-brackets/${payload.uid}/brackets`).add(bracket);

    bracket.id = doc.id;

    return json({ message: "success", count: bracket.matches.length, bracket });
}