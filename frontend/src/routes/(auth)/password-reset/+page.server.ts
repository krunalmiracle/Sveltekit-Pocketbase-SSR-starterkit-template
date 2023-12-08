import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { emailSchema } from '$lib/schemas';

export const load = async ({ locals }) => {

    if (locals.pbServer?.authStore?.model) {
        return { form: await superValidate({ email: locals.pbServer?.authStore?.model?.email ?? "" }, emailSchema) };
    }
    // Server API:
    const form = await superValidate(emailSchema);

    // Always return { form } in load and form actions.
    return { form };
};

export const actions = {
    default: async ({ locals, request }) => {
        const form = await superValidate(request, emailSchema);
        console.log('POST', form);

        if (!form.valid) {
            return fail(400, { form });
        }

        // TODO: Do something with the validated data
        // Recovery Password In user 
        try {
            await locals.pbServer.collection('users').requestPasswordReset(form.data.email);
        } catch (error: any) {
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                /* result[key] = [value.message]; */

                setError(form, key as keyof typeof form.data, value.message);
            }
            setError(form, "email", error.message);
            return fail(error.code, {
                form
            });
        }
    }
};