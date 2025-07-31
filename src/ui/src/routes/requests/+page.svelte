<script lang="ts">
    import { resolve } from '$lib/utils/resolve.svelte';

    const { data } = $props();
</script>

<h1>All requests page</h1>

<ul class="list-inside list-disc">
    {#each data.requests as request (request.requestId)}
        <li class="flex items-center gap-2">
            <a class="underline" href={resolve(`/requests/${request.requestId}`)}>
                Request {request.requestId}
            </a>
            {request.method}
            {request.path}
        </li>
    {/each}
</ul>
