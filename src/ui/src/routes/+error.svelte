<script>
    import { page } from '$app/state';
</script>

<div class="flex min-h-[80svh] w-full flex-1 flex-col items-center justify-center">
    <h1 class="text-lg font-medium">{page.status}</h1>
    {page.url.toString()}
    <p>{page.error?.message}</p>
    <a href="/lens">Go Home</a>
</div>

<style>
    h1 {
        font-size: 3rem;
        font-weight: 700;
    }

    p {
        font-size: 1.5rem;
        margin: 1em auto;
    }

    a {
        text-decoration: underline;
    }
</style>
