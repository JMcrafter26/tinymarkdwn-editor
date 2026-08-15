<script lang="ts">
	import './app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { provideIsMobile } from '$lib/hooks/is-mobile.svelte';

	provideIsMobile();

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster richColors closeButton position="bottom-right" />
{@render children?.()}