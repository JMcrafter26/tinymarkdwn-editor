<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea/index.js";
import { tabsStore } from '$lib/stores/tabs.svelte';

	let { wordWrap = false }: { wordWrap?: boolean } = $props();

	function handleInput(e: Event & { currentTarget: HTMLTextAreaElement }) {
		if (!tabsStore.active) return;
		tabsStore.updateContent(tabsStore.active.id, e.currentTarget.value);
	}
</script>

<div class="flex h-full flex-col">
	{#if tabsStore.active}
		<Textarea
			value={tabsStore.active.content}
			oninput={handleInput}
			placeholder="Write some markdown..."
			class={[
				'h-full flex-1 resize-none rounded-none border-0 font-mono text-sm shadow-none focus-visible:ring-0',
				wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'
			]}
		/>
	{:else}
		<div class="flex h-full items-center justify-center text-sm text-muted-foreground">
			No file open
		</div>
	{/if}
</div>