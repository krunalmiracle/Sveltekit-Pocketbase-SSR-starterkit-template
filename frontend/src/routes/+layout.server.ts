import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ locals: { pbServer } }) => {
    if (pbServer) {
        return {
            user: pbServer.authStore.isValid ? pbServer.authStore.model : null,
            isLoggedIn: pbServer.authStore.isValid ? true : false
        };
    }
    return {
        user: null,
        isLoggedIn: false
    };
};