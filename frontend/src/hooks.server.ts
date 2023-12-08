// src/hooks.server.ts
import { COOKIE_OPTIONS } from "$lib/constants";
import { handleLoginRedirectAsResponse } from '$lib/util/helpers';
import { pocketbase } from '$lib/server/pocketbase';
import { HttpStatusCode } from "$lib/util/statusCode";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.pbServer = pocketbase
    // load the store data from the request cookie string
    event.locals.pbServer.authStore.loadFromCookie(event.request.headers.get('cookie') || '')
    try {
        // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
        event.locals.pbServer.authStore.isValid && await event.locals.pbServer.collection('users').authRefresh();
    } catch (_) {
        // clear the auth store on failed refresh
        event.locals.pbServer.authStore.clear();
    }

    // PROTECT ROUTES + User verified via email
    /* console.log("pathname", event.url) */
    if (event.route.id?.startsWith('/(app)')) {
        if (!event.locals.pbServer.authStore.isValid) {
            return handleLoginRedirectAsResponse(HttpStatusCode.FOUND, event);
        }
        if (event.locals.pbServer?.authStore?.model) {
            //console.log("Hoooks model --> ", event.locals.pbServer?.authStore?.model)
            if (event.locals.pbServer?.authStore?.model?.verified === false) {
                /* throw redirect(HttpStatusCode.FOUND, '/email-verification') */
                return new Response(null, {
                    status: HttpStatusCode.PERMANENT_REDIRECT,
                    headers: { location: '/email-verification', 'set-cookie': event.locals.pbServer.authStore.exportToCookie(COOKIE_OPTIONS) }
                });
            }
        }
    }
    /* const response = await resolve(event, {
        
        // * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
        // *
        // * https://github.com/sveltejs/kit/issues/8061
        
        filterSerializedResponseHeaders(name) {
            return name === "content-range";
        }
    }); */
    const response = await resolve(event);
    // send back the default 'pb_auth' cookie to the client with the latest store state
    response.headers.append('set-cookie', event.locals.pbServer.authStore.exportToCookie(COOKIE_OPTIONS));

    return response;
};
