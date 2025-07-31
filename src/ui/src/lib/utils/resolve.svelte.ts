import { page } from '$app/state';

export function resolve(href: string) {
    if (!page.data.path) {
        return href;
    }
    if (page.data.path.endsWith('/')) {
        return page.data.path + href.slice(1);
    }
    return page.data.path + href;
}
