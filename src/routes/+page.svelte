<script lang="ts">
	import AppMenubar from '$lib/components/editor/AppMenubar.svelte';
	import TabBar from '$lib/components/editor/TabBar.svelte';
	import SplitView from '$lib/components/editor/SplitView.svelte';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { newFile, openFile, saveActiveTab, saveActiveTabAs, closeActiveTab } from '$lib/actions/editor-actions';
	import MobileViewSwitch from '$lib/components/editor/MobileViewSwitch.svelte';
	import { useIsMobile } from '$lib/hooks/is-mobile.svelte';

	const isMobile = useIsMobile();

	function handleKeydown(e: KeyboardEvent) {
		const mod = e.metaKey || e.ctrlKey;
		if (!mod) return;
		const key = e.code;

		// Ctrl/Cmd+N, +W, +Tab and +1..8 are reserved by every major browser for its own
		// tab/window chrome and never reach page JS — so app-level shortcuts use +Alt instead.
		if (e.altKey && key === 'KeyN' || e.altKey && key === 'KeyT') {
			e.preventDefault();
			newFile();
		} else if (e.altKey && key === 'KeyO') {
			e.preventDefault();
			openFile();
		} else if (e.altKey && key === 'KeyS') {
			e.preventDefault();
			saveActiveTabAs();
		} else if (!e.altKey && key === 'KeyS') {
			e.preventDefault();
			saveActiveTab();
		} else if (e.altKey && key === 'KeyW') {
			e.preventDefault();
			closeActiveTab();
		} else if (e.altKey && (key === 'ArrowRight' || key === 'ArrowLeft')) {
			e.preventDefault();
			const tabs = tabsStore.tabs;
			if (tabs.length < 2) return;
			const idx = tabs.findIndex((t) => t.id === tabsStore.activeId);
			const dir = key === 'ArrowRight' ? 1 : -1;
			tabsStore.selectTab(tabs[(idx + dir + tabs.length) % tabs.length].id);
		} else if (e.altKey && /^Digit[1-9]$/.test(key)) {
			const tab = tabsStore.tabs[Number(key.slice(-1)) - 1];
			if (tab) {
				e.preventDefault();
				tabsStore.selectTab(tab.id);
			}
		}
		// Ctrl/Cmd+Z, +X, +C, +V are intentionally left alone — the browser's native
		// textarea handling already covers them while the editor is focused.
	}

	function handleBeforeUnload(e: BeforeUnloadEvent) {
		if (tabsStore.hasDirty && !tabsStore.incognito) {
			e.preventDefault();
			e.returnValue = '';
		}
	}
</script>


<svelte:window onkeydown={handleKeydown} onbeforeunload={handleBeforeUnload} />

<div class="flex h-dvh flex-col overflow-hidden [padding-bottom:env(safe-area-inset-bottom)]">
	<AppMenubar />
	<TabBar />
	{#if isMobile.current}
		<MobileViewSwitch />
	{/if}
	<main class="min-h-0 flex-1">
		<SplitView />
	</main>
</div>