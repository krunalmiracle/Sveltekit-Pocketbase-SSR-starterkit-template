import { PRIVATE_BACKEND_URL } from '$env/static/private'
import PocketBase from 'pocketbase';

export const pocketbase = new PocketBase(PRIVATE_BACKEND_URL);
