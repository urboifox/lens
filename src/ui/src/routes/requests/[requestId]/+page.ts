import type { LogRequest } from '$lib/types';
import { resolve } from '$lib/utils/resolve.svelte';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ fetch, params, parent }) => {
    const data = await parent();
    const res = await fetch(resolve('/api/requests/' + params.requestId, data.path));

    if (!res.ok) {
        throw redirect(302, '/requests');
    }

    const request = (await res.json()) as LogRequest;

    return { request };
};
