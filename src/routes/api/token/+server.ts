import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, cookies }) => {
    const payload = await request.json();
    const token = payload.token || '';

    if (token)     {
        cookies.set('token', token, {
            httpOnly: true,
            path: '/',
        });
    } else {
        cookies.delete('token', { path: '/' });
    }

    return json({});
}
