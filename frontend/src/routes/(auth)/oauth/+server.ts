import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { HttpStatusCode } from '$lib/util/statusCode';

export const GET = async ({ url, cookies, locals }) => {
    // redirect if no provider is provided
    const queryProvider = url.searchParams.get('provider');
    if (!queryProvider) throw redirect(HttpStatusCode.FOUND, '/');

    const providers = await locals.pbServer.collection('users').listAuthMethods();
    const provider = providers.authProviders.find((provider) => provider.name === queryProvider);

    // redirect if provider is not available
    if (!provider) throw redirect(HttpStatusCode.FOUND, '/');

    const authUrl = provider.authUrl + env.PUBLIC_SITE_URL + '/redirect';

    cookies.set(
        'provider',
        JSON.stringify({
            state: provider.state,
            name: provider.name,
            codeVerifier: provider.codeVerifier,
            codeChallenge: provider.codeChallenge,
            codeChallengeMethod: provider.codeChallengeMethod,
        })
    );
    // redirect to the provider's auth url
    return new Response(null, {
        status: HttpStatusCode.PERMANENT_REDIRECT,
        headers: {
            location: authUrl,
        },
    });
};