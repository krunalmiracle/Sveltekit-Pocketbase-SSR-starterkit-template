import { env } from '$env/dynamic/public';
import { HttpStatusCode } from '$lib/util/statusCode';
import { error, redirect } from '@sveltejs/kit';
import type { AuthProviderInfo } from 'pocketbase';

export const GET = async ({ locals, url, cookies }) => {

    const errorParam = url.searchParams.get('error')
    if (errorParam) {
        throw error(401, errorParam)
    }

    const errorParamDescription = url.searchParams.get('error_description')
    if (errorParamDescription) {
        throw error(401, errorParamDescription)
    }

    const provider: AuthProviderInfo | undefined = JSON.parse(cookies.get('provider') || 'null');
    if (!provider) throw error(400, 'Missing provider');

    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code || !state) {
        throw error(400, 'Missing code or state');
    }

    if (state !== provider.state) {
        throw error(400, 'Invalid state');
    }

    // clear the cookie after use
    cookies.delete('provider');

    try {
        await locals.pbServer
            .collection('users')
            .authWithOAuth2Code(provider.name, code, provider.codeVerifier, + env.PUBLIC_SITE_URL + '/redirect');
    } catch (err) {
        console.error(err);
        throw redirect(HttpStatusCode.PERMANENT_REDIRECT, '/login');
    }

    // redirect back home
    throw redirect(HttpStatusCode.PERMANENT_REDIRECT, '/dashboard');
};