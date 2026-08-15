<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { editorRef } from '$lib/stores/editor-ref.svelte';
	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import CodeIcon from '@lucide/svelte/icons/code';
	import LinkIcon from '@lucide/svelte/icons/link';
	import HeadingIcon from '@lucide/svelte/icons/heading-2';
	import ListIcon from '@lucide/svelte/icons/list';

	function wrapSelection(before: string, after = before) {
		const tab = tabsStore.active;
		const el = editorRef.el;
		if (!tab || !el) return;
		const { selectionStart: start, selectionEnd: end } = editorRef;
		const selected = tab.content.slice(start, end);
		const next = tab.content.slice(0, start) + before + selected + after + tab.content.slice(end);
		tabsStore.updateContent(tab.id, next);
		const caretStart = start + before.length;
		const caretEnd = caretStart + selected.length;
		requestAnimationFrame(() => {
			el.focus();
			el.setSelectionRange(selected ? caretStart : caretEnd, caretEnd);
		});
	}

	function insertLinePrefix(prefix: string) {
		const tab = tabsStore.active;
		const el = editorRef.el;
		if (!tab || !el) return;
		const { selectionStart: start } = editorRef;
		const lineStart = tab.content.lastIndexOf('\n', start - 1) + 1;
		const next = tab.content.slice(0, lineStart) + prefix + tab.content.slice(lineStart);
		tabsStore.updateContent(tab.id, next);
		const caret = start + prefix.length;
		requestAnimationFrame(() => {
			el.focus();
			el.setSelectionRange(caret, caret);
		});
	}
</script>

<div class="flex shrink-0 items-center gap-0.5 overflow-x-auto border-b bg-muted/30 p-1">
	<Button variant="ghost" size="icon-sm" aria-label="Bold" onclick={() => wrapSelection('**')}>
		<BoldIcon class="size-4" />
	</Button>
	<Button variant="ghost" size="icon-sm" aria-label="Italic" onclick={() => wrapSelection('_')}>
		<ItalicIcon class="size-4" />
	</Button>
	<Button variant="ghost" size="icon-sm" aria-label="Code" onclick={() => wrapSelection('`')}>
		<CodeIcon class="size-4" />
	</Button>
	<Button variant="ghost" size="icon-sm" aria-label="Link" onclick={() => wrapSelection('[', '](url)')}>
		<LinkIcon class="size-4" />
	</Button>
	<Button variant="ghost" size="icon-sm" aria-label="Heading" onclick={() => insertLinePrefix('#')}>
		<HeadingIcon class="size-4" />
	</Button>
	<Button variant="ghost" size="icon-sm" aria-label="List" onclick={() => insertLinePrefix('- ')}>
		<ListIcon class="size-4" />
	</Button>
</div>