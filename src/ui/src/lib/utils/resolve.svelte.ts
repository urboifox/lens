import { config } from '$lib/stores/config.svelte';

export function resolve(href: string) {
    return config.path + href;
}
