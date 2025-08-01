<script>
    const { data } = $props();
</script>

<h1>Request {data.request.requestId} page</h1>

<pre>
    {JSON.stringify(data.request, null, 2)}
</pre>

<p>
    <a href="./">Go Back</a>
</p>
