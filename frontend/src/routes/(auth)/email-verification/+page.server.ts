import { fail, redirect } from '@sveltejs/kit';
import { HttpStatusCode } from '$lib/statusCode';
import { emailSchema } from '$lib/schemas';
import { setError, superValidate } from 'sveltekit-superforms/server';


export const load = async ({ locals }) => {
    if (locals.pbServer?.authStore?.model) {
        if (locals.pbServer?.authStore?.model?.verified) {
            throw redirect(HttpStatusCode.FOUND, '/dashboard');
        }
        return { form: await superValidate({ email: locals.pbServer?.authStore?.model?.email ?? "" }, emailSchema) };
    }
    // Always return { form } in load and form actions.
    return { form: await superValidate(emailSchema) };
};

export const actions = {
    default: async ({ locals, request }) => {
        const form = await superValidate(request, emailSchema);
        console.log('POST', form);

        if (!form.valid) {
            return fail(400, { form });
        }
        try {
            await locals.pbServer.collection('users').requestVerification(
                form.data.email
            );
        } catch (error: any) {
            setError(form, "email", 'No registered user with this email');
            return fail(HttpStatusCode.BAD_REQUEST, {
                form
            });
        }
    }
};