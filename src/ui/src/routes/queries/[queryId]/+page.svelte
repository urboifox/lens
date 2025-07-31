<script>
    import { resolve } from '$lib/utils/resolve.svelte.js';

    const { data } = $props();
</script>

<h1>Query {data.query.requestId} page</h1>

<pre>
    {JSON.stringify(data.query, null, 2)}
</pre>

<a href={resolve('/')}>Go home</a>
