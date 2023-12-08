import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { registerSchema } from '$lib/schemas';
import { HttpStatusCode } from '$lib/util/statusCode';
import { Collections, UsersCurrencyOptions, UsersRoleOptions, type UsersResponse, UsersModeOptions, UsersThemeOptions } from '$lib/pocketbase-types';
import { DEFAULT_USER_BIO, DEFAULT_USER_WORK_RANGE } from '$lib/constants';

export const load = async () => {
    // Server API:
    const form = await superValidate({
        role: UsersRoleOptions.USER
    }, registerSchema, { errors: false });

    // Always return { form } in load and form actions.
    return { form };
};

export const actions = {
    default: async ({ locals, request }) => {
        const form = await superValidate(request, registerSchema);
        console.log('POST', form);

        if (!form.valid) {
            return fail(400, { form });
        }

        // TODO: Do something with the validated data
        // Sign Up user 
        try {
            await locals.pbServer.collection(Collections.Users).create<UsersResponse>({
                email: form.data.email,
                password: form.data.password,
                passwordConfirm: form.data.passwordConfirm,
                firstName: form.data.firstName,
                lastName: form.data.lastName,
                bio: DEFAULT_USER_BIO,
                currency: UsersCurrencyOptions.EUR,
                role: UsersRoleOptions.USER,
                workRange: DEFAULT_USER_WORK_RANGE,
                mode: UsersModeOptions.SYSTEM,
                theme: UsersThemeOptions.DEFAULT,
            });
            await locals.pbServer.collection(Collections.Users).authWithPassword(form.data.email, form.data.password);
        } catch (error: any) {
            console.log(error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                /* result[key] = [value.message]; */

                setError(form, key as keyof typeof form.data, value.message);
            }
            setError(form, "passwordConfirm", error.message);
            return fail(error.code, {
                form
            });
        }
        throw redirect(HttpStatusCode.TEMPORARY_REDIRECT, '/email-verification');
    }
};