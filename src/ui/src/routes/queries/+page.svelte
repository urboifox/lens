<script lang="ts">
    import Table from '$lib/components/table.svelte';
    import { type LogQuery } from '$lib/types.js';
    import { CircleArrowRightIcon, PlusIcon } from '@lucide/svelte';
    import dayjs from 'dayjs';

    const { data } = $props();

    const mockData = Array.from(
        { length: 10 },
        () =>
            ({
                requestId: '123',
                query: 'SELECT * FROM users',
                durationMs: 1.2,
                type: 'query',
                timestamp: Date.now()
            }) as LogQuery
    );
</script>

{#snippet actionsSnippet(query: LogQuery)}
    <a href="./queries/{query.requestId}" class="transition-colors duration-100 hover:text-white">
        <CircleArrowRightIcon size={20} />
    </a>
{/snippet}

<main class="w-full">
    <Table
        columns={[
            {
                name: 'Query',
                value: (query) => query.query
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
        data={data.queries}
    />

    {#if !data.queries.length}
        <p class="py-10 text-center text-neutral-400">No queries found</p>
    {/if}

    <button
        class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 p-3 font-medium transition-colors duration-100 hover:bg-neutral-900 hover:underline active:bg-neutral-950"
    >
        <PlusIcon size={20} />
        Load more
    </button>
</main>
