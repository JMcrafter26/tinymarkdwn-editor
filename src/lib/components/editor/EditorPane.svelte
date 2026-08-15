<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { editorRef } from '$lib/stores/editor-ref.svelte';
	import { useIsMobile } from '$lib/hooks/is-mobile.svelte';
	import { cn } from '$lib/utils.js';
	// import MarkdownToolbar from './MarkdownToolbar.svelte';

	const isMobile = useIsMobile();
	let textareaEl: HTMLTextAreaElement | null = $state(null);
	
	$effect(() => {
		editorRef.el = textareaEl ?? null;
	});

	function syncSelection() {
		if (!textareaEl) return;
		editorRef.selectionStart = textareaEl.selectionStart ?? 0;
		editorRef.selectionEnd = textareaEl.selectionEnd ?? 0;
	}

	function handleInput(e: Event & { currentTarget: HTMLTextAreaElement }) {
		if (!tabsStore.active) return;
		tabsStore.updateContent(tabsStore.active.id, e.currentTarget.value);
		syncSelection();
	}

	let wordCount = $derived(
		tabsStore.active?.content.trim() ? tabsStore.active.content.trim().split(/\s+/).length : 0
	);
	let charCount = $derived(tabsStore.active?.content.length ?? 0);
</script>

<div class="flex h-full flex-col">
	{#if tabsStore.active}
		<!-- {#if isMobile.current}
			<MarkdownToolbar />
		{/if} -->
		<Textarea
			bind:ref={textareaEl}
			value={tabsStore.active.content}
			oninput={handleInput}
			onselect={syncSelection}
			onkeyup={syncSelection}
			onmouseup={syncSelection}
			placeholder="Write some markdown..."
			autocapitalize="off"
			autocorrect="off"
			spellcheck="false"
			class={cn(
				'h-full flex-1 resize-none rounded-none border-0 font-mono text-sm shadow-none focus-visible:ring-0',
				settingsStore.wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'
			)}
		/>
		<div class="flex shrink-0 justify-end gap-3 border-t px-3 py-1 text-xs text-muted-foreground">
			<span>{wordCount} words</span>
			<span>{charCount} chars</span>
		</div>
	{:else}
		<div class="flex h-full items-center justify-center text-sm text-muted-foreground">
			No file open
		</div>
	{/if}
</div>