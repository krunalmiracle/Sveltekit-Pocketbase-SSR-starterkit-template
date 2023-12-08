import { HttpStatusCode } from '$lib/util/statusCode';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    locals.pbServer.authStore.clear();
    locals.user = null;
    throw redirect(HttpStatusCode.FOUND, '/');
};