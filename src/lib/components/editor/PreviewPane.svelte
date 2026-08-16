<script lang="ts">
	import { tabsStore } from '$lib/stores/tabs.svelte';
    import { tinymarkdwn } from 'tinymarkdwn';

	let html = $derived(tabsStore.active ? tinymarkdwn(tabsStore.active.content) : '');
</script>

<div class="h-full overflow-y-auto p-6">
	{#if tabsStore.active}
		<article class="prose prose-sm dark:prose-invert max-w-none">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html html}
		</article>
	{:else}
		<div class="flex h-full items-center justify-center text-sm text-muted-foreground">
			Nothing to preview
		</div>
	{/if}
</div>