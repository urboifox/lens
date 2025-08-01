<script lang="ts">
    import Table from '$lib/components/table.svelte';
    import { type LogRequest } from '$lib/types.js';
    import { CircleArrowRightIcon, PlusIcon } from '@lucide/svelte';
    import dayjs from 'dayjs';

    const { data } = $props();

    const mockData = Array.from(
        { length: 10 },
        () =>
            ({
                requestId: '123',
                method: 'GET',
                path: '/api/requests',
                status: 200,
                durationMs: 52,
                timestamp: Date.now()
            }) as LogRequest
    );
</script>

{#snippet methodSnippet(request: LogRequest)}
    <span class="rounded-lg bg-neutral-800 px-2 py-1 text-sm font-semibold text-neutral-200">
        {request.method}
    </span>
{/snippet}

{#snippet pathSnippet(request: LogRequest)}
    <a
        href="./requests/{request.requestId}"
        class="line-clamp-2 max-w-80 min-w-40 text-base text-neutral-200 hover:underline"
    >
        {request.path}
    </a>
{/snippet}

{#snippet statusSnippet(request: LogRequest)}
    {@const status = request.status}
    <span
        class={[
            'rounded-lg px-2 py-1 text-sm font-semibold text-neutral-200',
            status >= 200 && status < 300 && 'bg-green-700',
            status >= 300 && status < 400 && 'bg-yellow-700',
            status >= 400 && status < 500 && 'bg-red-700'
        ]}
    >
        {request.status}
    </span>
{/snippet}

{#snippet actionsSnippet(request: LogRequest)}
    <a
        href="./requests/{request.requestId}"
        class="transition-colors duration-100 hover:text-white"
    >
        <CircleArrowRightIcon size={20} />
    </a>
{/snippet}

<main class="w-full">
    <Table
        columns={[
            {
                name: 'Method',
                render: methodSnippet
            },
            {
                name: 'Path',
                render: pathSnippet
            },
            {
                name: 'Status',
                render: statusSnippet,
                position: 'end'
            },
            {
                name: 'Duration',
                value: (request) => `${request.durationMs}ms`,
                position: 'end'
            },
            {
                name: 'Happend',
                value: (request) => dayjs(request.timestamp).fromNow(),
                position: 'end',
                class: 'min-w-32'
            },
            {
                name: 'Actions',
                render: actionsSnippet,
                position: 'end'
            }
        ]}
        data={data.requests}
    />

    {#if !data.requests.length}
        <p class="py-10 text-center text-neutral-400">No requests found</p>
    {/if}

    <button
        class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 p-3 font-medium transition-colors duration-100 hover:bg-neutral-900 hover:underline active:bg-neutral-950"
    >
        <PlusIcon size={20} />
        Load more
    </button>
</main>
