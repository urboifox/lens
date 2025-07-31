import type { LogQuery } from '$lib/types';
import { resolve } from '$lib/utils/resolve.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch(resolve('/api/queries'));

    if (!res.ok) {
        return { queries: [] };
    }

    const queries = (await res.json()) as LogQuery[];

    return { queries };
};
