
import type { RequestHandler } from './$types';
import { HttpStatusCode } from '$lib/statusCode';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
    const { token } = event.params;

    if (token) {
        try {
            await event.locals.pbServer.collection('users').confirmVerification(
                token
            );
        } catch (_) {
            throw redirect(HttpStatusCode.PERMANENT_REDIRECT, '/email-verification');
        }
        throw redirect(HttpStatusCode.PERMANENT_REDIRECT, '/login');
    }
    throw redirect(HttpStatusCode.PERMANENT_REDIRECT, '/dashboard');
};
