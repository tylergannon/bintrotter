import type { Handle } from '@sveltejs/kit';
import { ADMIN_LOGIN } from '$env/static/private';
import { dev } from '$app/environment';

/**
 * Enforce basic authentication
 * @param param0
 * @returns
 */
export const handle: Handle = async ({ event, resolve }) => {
	const auth = event.request.headers.get('Authorization');
	if (dev || auth === `Basic ${btoa(ADMIN_LOGIN)}`) {
		return resolve(event);
	}

	return new Response('Not authorized', {
		status: 401,
		headers: {
			'WWW-Authenticate': 'Basic realm="User Visible Realm", charset="UTF-8"'
		}
	});
};
