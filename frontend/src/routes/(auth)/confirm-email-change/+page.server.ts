import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { passwordSchema } from '$lib/schemas';
import { HttpStatusCode } from '$lib/util/statusCode';

export const load = async () => {
    // Server API:
    const form = await superValidate(passwordSchema);

    // Always return { form } in load and form actions.
    return { form };
};

export const actions = {
    default: async ({ locals, request, url }) => {
        const form = await superValidate(request, passwordSchema);
        console.log('POST', form);

        if (!form.valid) {
            return fail(400, { form });
        }
        const token = url.searchParams.get('token');
        if (token) {
            try {
                await locals.pbServer.collection('users').confirmEmailChange(
                    token,
                    form.data.password,
                );

            } catch (error: any) {
                const errorData: {
                    [index: string]: { code: string, message: string }
                } = error.response.data;
                for (const [key, value] of Object.entries(errorData)) {
                    /* result[key] = [value.message]; */

                    setError(form, key as keyof typeof form.data, value.message);
                }
                setError(form, "password", error.message);
                return fail(error.code, {
                    form
                });
            }
            throw redirect(HttpStatusCode.PERMANENT_REDIRECT, '/login');
        } else {
            // No token found
            throw redirect(HttpStatusCode.PERMANENT_REDIRECT, '/recovery');
        }
    }
};