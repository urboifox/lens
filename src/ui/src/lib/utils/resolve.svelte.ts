import { page } from '$app/state';

export function resolve(href: string, base?: string) {
    const path = base ?? page.data.path;
    if (!path) {
        return href;
    }
    if (path.endsWith('/')) {
        return path + href.slice(1);
    }
    return path + href;
}
