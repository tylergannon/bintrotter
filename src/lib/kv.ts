export async function getItemFromKv<T extends {}>(
	key: string,
	kv: App.KVNamespace | undefined | null,
	fn: () => Promise<T>,
	cacheTtl: number = 60
): Promise<T> {
	if (kv === null || typeof kv === 'undefined') {
		return fn();
	}
	const valFromKv = await kv.get<T>(key, { type: 'json', cacheTtl });
	if (valFromKv !== null) return valFromKv;

	const val = await fn();
	await kv.put(key, val);
	return val;
}
