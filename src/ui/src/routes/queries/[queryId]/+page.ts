import type { LogRequest } from '$lib/types';
import { resolve } from '$lib/utils/resolve.svelte';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ fetch, params }) => {
    const res = await fetch(resolve('/api/queries/' + params.queryId));

    if (!res.ok) {
        throw redirect(302, '/queries');
    }

    const query = (await res.json()) as LogRequest;

    return { query };
};
