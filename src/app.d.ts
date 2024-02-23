// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		declare class KVNamespace {
			get: {
				(key: string): Promise<string | null>;
				(key: string, opts: { cacheTtl?: number }): Promise<string | null>;
				(key: string, opts: { type: 'text'; cacheTtl?: number }): Promise<string | null>;
				<T extends {} = {}>(key: string, opts: { type: 'json', cacheTtl?: number }): Promise<T | null>;
			};
			put: (key: string, value: any) => Promise<never>;
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				TROTTERBIN_KV: KVNamespace;
			};
		}
	}
}

export {};
