<script lang="ts">
    import { page } from '$app/state';
    import { resolve } from '$lib/utils/resolve.svelte';
    import { ArrowRightLeftIcon, DatabaseIcon } from '@lucide/svelte';
    import '../app.css';

    let { children } = $props();

    const routes = [
        { label: 'Requests', path: '/requests', icon: ArrowRightLeftIcon },
        { label: 'Queries', path: '/queries', icon: DatabaseIcon }
    ];
</script>

<svelte:head>
    <title>Lens</title>
</svelte:head>

<header class="container my-5 flex items-center justify-between gap-4">
    <a href={resolve('/requests')}>
        <p class="text-2xl font-bold">🔭 Lens</p>
    </a>
</header>

<hr class="container my-6 border-neutral-800" />

<div class="container flex gap-8">
    <aside class="min-w-60 sticky top-0">
        <ul class="flex flex-col gap-2 text-neutral-300">
            {#each routes as route}
                {@const active = resolve(route.path) === page.url.pathname}
                <li class="contents">
                    <a
                        href={resolve(route.path)}
                        class={[
                            'flex items-center gap-2 rounded-lg px-3 py-2 font-medium',
                            active
                                ? 'bg-neutral-950 text-white'
                                : 'text-neutral-500 hover:bg-neutral-950'
                        ]}
                    >
                        <route.icon size={16} />
                        {route.label}
                    </a>
                </li>
            {/each}
        </ul>
    </aside>
    {@render children()}
</div>
