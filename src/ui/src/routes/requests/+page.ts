import type { LogRequest } from '$lib/types';
import { resolve } from '$lib/utils/resolve.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
    const data = await parent();
    const res = await fetch(resolve('/api/requests', data.path));

    if (!res.ok) {
        return { requests: [] };
    }

    const requests = (await res.json()) as LogRequest[];

    return { requests };
};
