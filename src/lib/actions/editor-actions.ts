import { toast } from 'svelte-sonner';
import { tabsStore } from '$lib/stores/tabs.svelte';
import { editorRef } from '$lib/stores/editor-ref.svelte';
import { saveTab, saveTabAs, pickFilesToOpen } from '$lib/utils/files';
import { buildPlainHtml, buildStyledHtmlCdn, buildStyledHtmlOffline, downloadHtml } from '$lib/utils/export';

export function newFile() {
	tabsStore.newTab();
}

export async function openFile() {
	const files = await pickFilesToOpen();
	for (const file of files) tabsStore.newTab(file.name, file.content);
}

export async function saveActiveTab() {
	const tab = tabsStore.active;
	if (!tab) return;

	// already linked to a real file on disk — write to it silently
	if (tab.fileHandle) {
		const handle = await saveTab(tab);
		tabsStore.markSaved(tab.id, handle);
		toast.success(`Saved to ${tab.title}`);
		return;
	}

	// no file handle — this is what autosave already does, just confirm it
	tabsStore.markSaved(tab.id);
	if (tabsStore.incognito) {
		toast.warning("Incognito is on — changes aren't being saved anywhere");
	} else {
		toast.success('Autosaved in your browser', {
			description: 'Use "Save As" to also save a copy to disk.'
		});
	}
}

export async function saveActiveTabAs() {
	const tab = tabsStore.active;
	if (!tab) return;
	const handle = await saveTabAs(tab);
	if (handle) {
		tabsStore.markSaved(tab.id, handle);
		toast.success(`Saved as ${tab.title}`);
	}
}

export function closeActiveTab() {
	if (tabsStore.active) tabsStore.closeTab(tabsStore.active.id);
}

export function undoActiveTab() {
	if (tabsStore.active) tabsStore.undo(tabsStore.active.id);
}

export function redoActiveTab() {
	if (tabsStore.active) tabsStore.redo(tabsStore.active.id);
}

export function exportActiveTab(kind: 'plain' |'offline') {
	const tab = tabsStore.active;
	if (!tab) return;
	const name = tab.title.replace(/\.[^./]+$/, '');
	const builders = { plain: buildPlainHtml, offline: buildStyledHtmlOffline };
	downloadHtml(name, builders[kind](name, tab.content));
	toast.success(`Exported ${name}.html`);
}

function restoreSelection(start: number, end: number) {
	const el = editorRef.el;
	if (!el) return;
	requestAnimationFrame(() => {
		el.focus();
		el.setSelectionRange(start, end);
	});
}

export async function copySelection() {
	const tab = tabsStore.active;
	if (!tab) return;
	const { selectionStart, selectionEnd } = editorRef;
	const text = tab.content.slice(selectionStart, selectionEnd);
	if (!text) return;
	try {
		await navigator.clipboard.writeText(text);
	} catch {
		toast.error("Couldn't copy — clipboard access was blocked.");
	}
}

export async function cutSelection() {
	const tab = tabsStore.active;
	if (!tab) return;
	const { selectionStart, selectionEnd } = editorRef;
	if (selectionStart === selectionEnd) return;
	const text = tab.content.slice(selectionStart, selectionEnd);
	try {
		await navigator.clipboard.writeText(text);
	} catch {
		toast.error("Couldn't cut — clipboard access was blocked.");
		return;
	}
	const next = tab.content.slice(0, selectionStart) + tab.content.slice(selectionEnd);
	tabsStore.updateContent(tab.id, next);
	restoreSelection(selectionStart, selectionStart);
}

export async function pasteClipboard() {
	const tab = tabsStore.active;
	if (!tab) return;
	let text: string;
	try {
		text = await navigator.clipboard.readText();
	} catch {
		toast.error('Paste blocked — try ⌘V directly in the editor instead.');
		return;
	}
	if (!text) return;
	const { selectionStart, selectionEnd } = editorRef;
	const next = tab.content.slice(0, selectionStart) + text + tab.content.slice(selectionEnd);
	tabsStore.updateContent(tab.id, next);
	const caret = selectionStart + text.length;
	restoreSelection(caret, caret);
}