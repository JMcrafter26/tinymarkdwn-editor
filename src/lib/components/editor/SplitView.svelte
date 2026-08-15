<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import EditorPane from './EditorPane.svelte';
	import PreviewPane from './PreviewPane.svelte';
	import { settingsStore } from '$lib/stores/settings.svelte';
</script>

{#if settingsStore.viewMode === 'editor'}
	<div class="h-full"><EditorPane /></div>
{:else if settingsStore.viewMode === 'preview'}
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