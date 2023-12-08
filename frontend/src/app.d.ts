import type PocketBase from 'pocketbase';
import PocketBase, { Admin } from 'pocketbase';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pbServer: PocketBase,
			user: Record | Admin | null;
		}
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface PageData {
		}
		// interface Platform {}
	}
}

export { };