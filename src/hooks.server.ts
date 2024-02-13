import { verifyIdToken } from "$lib/server/firebase-admin";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('token') || '';
    const decodedToken = await verifyIdToken(token);
    if (decodedToken) {
        const { uid, email, name } = decodedToken;
        event.locals.userSession = { uid, email, name };
    }

    const response = await resolve(event);

    return response;
}