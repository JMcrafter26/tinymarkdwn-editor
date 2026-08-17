<script lang="ts">
    import { tabsStore } from '$lib/stores/tabs.svelte';
    import { tinymarkdwn } from 'tinymarkdwn';
	import { animate } from '$lib/utils/actions.svelte';

    let html = $derived(tabsStore.active ? tinymarkdwn(tabsStore.active.content) : '');
</script>

<!-- 1. Move the action to the parent container -->
<div class="h-full overflow-y-auto p-6" use:animate={{ duration: 80 }}>
    
    {#if tabsStore.active}
        <!-- 2. Wrap the article in a key block tracking the unique tab ID -->
        {#key tabsStore.active.id}
            <article class="prose prose-sm dark:prose-invert max-w-none">
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html html}
            </article>
        {/key}
    {:else}
        <div class="flex h-full items-center justify-center text-sm text-muted-foreground">
            Nothing to preview
        </div>
    {/if}
    
</div>