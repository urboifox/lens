<script>
    import { resolve } from '$lib/utils/resolve.svelte.js';

    const { data } = $props();
</script>

<h1>Request {data.request.requestId} page</h1>

<pre>
    {JSON.stringify(data.request, null, 2)}
</pre>

<a href={resolve('/')}>Go home</a>
