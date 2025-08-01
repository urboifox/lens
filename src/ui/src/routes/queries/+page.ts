import type { LogQuery } from '$lib/types';
import { resolve } from '$lib/utils/resolve.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
    const data = await parent();
    const res = await fetch(resolve('/api/queries', data.path));

    if (!res.ok) {
        return { queries: [] };
    }

    const queries = (await res.json()) as LogQuery[];

    return { queries };
};
