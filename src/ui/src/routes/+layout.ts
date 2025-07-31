import type { LensConfig } from '$lib/types';
import type { LayoutLoad } from './$types';

export const prerender = true;
export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
    const res = await fetch('/lens-config');
    if (res.ok) {
        const config = (await res.json()) as LensConfig;
        return { path: config.path };
    }

    return { path: '/' } as LensConfig;
};
