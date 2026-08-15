<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import EditorPane from './EditorPane.svelte';
	import PreviewPane from './PreviewPane.svelte';
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { useIsMobile } from '$lib/hooks/is-mobile.svelte';

	const isMobile = useIsMobile();

	let effectiveMode = $derived(
		isMobile.current && settingsStore.viewMode === 'split' ? 'editor' : settingsStore.viewMode
	);
</script>

{#if effectiveMode === 'editor'}
	<div class="h-full"><EditorPane /></div>
{:else if effectiveMode === 'preview'}
	<div class="h-full"><PreviewPane /></div>
{:else}
	<Resizable.PaneGroup direction="horizontal" class="h-full">
		<Resizable.Pane defaultSize={50} minSize={20}>
			<EditorPane />
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={50} minSize={20}>
			<PreviewPane />
		</Resizable.Pane>
	</Resizable.PaneGroup>
{/if}