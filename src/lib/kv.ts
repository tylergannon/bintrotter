import { dev } from '$app/environment';
import * as env from '$env/static/private';

const KV_NAMESPACE = 'KV_NAMESPACE';

interface KVNamespace {
	get: {
		(key: string): Promise<string | null>;
		(key: string, opts: { cacheTtl?: number }): Promise<string | null>;
		(key: string, opts: { type: 'text'; cacheTtl?: number }): Promise<string | null>;
		<T extends {} = {}>(key: string, opts: { type: 'json'; cacheTtl?: number }): Promise<T | null>;
	};
	put: (key: string, value: any) => Promise<never>;
}

function getKv(platform: App.Platform | undefined | null) {
	if (dev || !Boolean(env[KV_NAMESPACE])) {
		return undefined;
	}
	const kvBindingName = env[KV_NAMESPACE];
	if (!(platform && platform.env && platform.env[kvBindingName])) {
		console.info(`Key/Value binding ${kvBindingName} configured but not found.`);
		console.debug(
			'Found the following keys on the platform env object:',
			platform?.env ? Object.keys(platform.env) : []
		);
		return undefined;
	}
	return platform.env[kvBindingName] as KVNamespace;
}

/**
 * Find a POJO in the cloudflare kv.  If not found, then
 * retrieve it and stash in kv before returning it.
 * @param key Key that the object will be stored under
 * @param platform App.platform object
 * @param fn Function to generate the desired object, if not found in KV
 * @param cacheTtl Cache expiry in seconds
 * @returns
 */
export async function getItemFromKv<T extends {}>(
	key: string,
	platform: App.Platform | undefined | null,
	fn: () => Promise<T>,
	cacheTtl: number = 60
): Promise<T> {
	const kv = getKv(platform);

	if (!kv) {
		return fn();
	}
	const valFromKv = await kv.get<T>(key, { type: 'json', cacheTtl });
	if (valFromKv !== null) return valFromKv;

	const val = await fn();
	await kv.put(key, JSON.stringify(val));
	return val;
}
