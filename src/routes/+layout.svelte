<script lang="ts">
	import './app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { provideIsMobile } from '$lib/hooks/is-mobile.svelte';
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { saveStored } from '$lib/stores/storage';

	provideIsMobile();

	let { children } = $props();

	$effect(() => {
		saveStored('md-editor:settings', settingsStore.toJSON());
	});
</script>

<ModeWatcher />
<Toaster richColors closeButton position="bottom-right" />
{@render children?.()}