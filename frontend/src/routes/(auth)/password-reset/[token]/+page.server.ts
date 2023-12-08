import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { HttpStatusCode } from '$lib/statusCode';
import { passwordResetSchema } from '$lib/schemas';

export const load = async ({ params }) => {
    const { token } = params;
    if (token == undefined || token == null) {
        throw redirect(HttpStatusCode.PERMANENT_REDIRECT, '/password-reset');
    }
    const form = await superValidate(passwordResetSchema);
    return { form };
};

export const actions = {
    default: async ({ locals, request, params }) => {
        const form = await superValidate(request, passwordResetSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const { token } = params;
        if (token) {
            let isReset = false;
            try {
                isReset = await locals.pbServer.collection('users').confirmPasswordReset(
                    token,
                    form.data.password,
                    form.data.passwordConfirm,
                );
            } catch (e: any) {
                console.error('password-reset--> error --> ', e);
                throw redirect(HttpStatusCode.PERMANENT_REDIRECT, '/password-reset');
            }
            if (isReset) { throw redirect(HttpStatusCode.FOUND, '/login') }
            else { throw redirect(HttpStatusCode.PERMANENT_REDIRECT, '/password-reset'); }
        } else {
            // No token found
            throw redirect(HttpStatusCode.PERMANENT_REDIRECT, '/password-reset');
        }
    }
};