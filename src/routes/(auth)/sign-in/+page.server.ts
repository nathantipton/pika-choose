import { magicLinkSchema } from "$lib/schemas/magic-link";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {

    return {
        form: await superValidate(magicLinkSchema)
    }
};


export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, magicLinkSchema);
        if (!form.valid) {
            return fail(400, { form })
        }
        return { form }
    }
}