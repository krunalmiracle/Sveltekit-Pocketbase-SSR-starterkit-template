import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/schemas';
import { HttpStatusCode } from '$lib/util/statusCode';


export const load = async ({ locals }) => {

    if (locals.pbServer.authStore.isValid) {
        if (locals.pbServer?.authStore?.model) {
            throw redirect(HttpStatusCode.FOUND, '/dashboard');
        }
    }
    // Server API:
    /*     const form = await superValidate(loginSchema); */
    // Always return { form } in load and form actions.
    return { form: superValidate(loginSchema), providers: locals.pbServer.collection('users').listAuthMethods() };
};

export const actions = {
    default: async ({ locals, request, url }) => {
        const form = await superValidate(request, loginSchema);
        console.log('POST', form);

        if (!form.valid) {
            return fail(400, { form });
        }

        // Do something with the validated data
        // Sign In user 
        try {
            await locals.pbServer.collection('users').authWithPassword(form.data.email, form.data.password);
        } catch (error) {
            console.error("Loggin Error --> ", error);
            setError(form, "email", "Invalid credentials");
            setError(form, "password", "Invalid credentials");
            return fail(400, {
                form
            });
        }
        if (url.searchParams.has('redirectTo')) {
            console.log("Redirect on login executed --> redirectTo --> ", url.searchParams.get('redirectTo'));
            throw redirect(303, url.searchParams.get('redirectTo') ?? '/dashboard');
        } else {
            throw redirect(HttpStatusCode.PERMANENT_REDIRECT, '/dashboard');
        }

    }
};