<script>
    import { goto } from '$app/navigation';
    import { resolve } from '$lib/utils/resolve.svelte';

    $effect(() => {
        goto(resolve('/requests'));
    })
</script>

<!-- <a href={resolve('/requests')}>Requests page</a> -->
