<script lang="ts">
    import { config } from '$lib/stores/config.svelte';
    import '../app.css';

    let { data, children } = $props();

    $effect(() => {
        config.path = data.path;
    });
</script>

{@render children()}
