import { createBracket } from "$lib/bracket/bracket";
import admin from "$lib/server/firebase-admin";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { CreateBracketPayload } from "$lib/models/api";

export const POST: RequestHandler = async ({ request }) => {

    const body: CreateBracketPayload = await request.json();

    const bracket = await createBracket(body.competitors, body.name);

    const doc = await admin.firestore().collection(`user-brackets/${body.uid}/brackets`).add(bracket);

    bracket.id = doc.id;

    return json({ message: "success", count: bracket.matches.length, bracket });
}