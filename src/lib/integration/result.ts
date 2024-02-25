import type { Result } from './types';

export function mapResult<T extends {}, U extends {}>(
	result: Result<T>,
	fn: (val: T) => U
): Result<U> {
	if (result.ok) return { ...fn(result), ok: true };
	return result;
}
