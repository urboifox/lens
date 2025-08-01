<script>
    import { goto } from '$app/navigation';

    $effect(() => {
        goto('./requests');
    });
</script>

<!-- <a href={resolve('/requests')}>Requests page</a> -->
