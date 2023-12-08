import { handleLoginRedirect } from "$lib/util/helpers";
import { redirect } from "@sveltejs/kit";
import { HttpStatusCode } from '$lib/util/statusCode';
import { Collections, type UsersResponse, type ServiceResponse, type AvailabilityResponse } from "$lib/pocketbase-types";

export const load = async (event) => {
    // Server API:
    if (event.locals.pbServer.authStore.isValid) {
        try {
            const id: string | null = event.locals.pbServer.authStore.model?.id;
            const user = await event.locals.pbServer.collection(Collections.Users).getOne<UsersResponse<{ services: ServiceResponse[]; availabilities: AvailabilityResponse[] }>>(id ?? '', { "expand": 'services,availabilities' });
            console.log("Dashboard --> ", user)
            return {
                user
            }
        } catch (e) {
            console.error("dashboard --> error --> ", e);
            throw redirect(HttpStatusCode.TEMPORARY_REDIRECT, handleLoginRedirect(event))
        }
    } else {
        console.error("dashboard --> error --> notLoggedIn");
        throw redirect(HttpStatusCode.TEMPORARY_REDIRECT, handleLoginRedirect(event))
    }

};