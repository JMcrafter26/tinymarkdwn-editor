<script lang="ts">
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { cn } from '$lib/utils.js';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import EyeIcon from '@lucide/svelte/icons/eye';
</script>

<div class="flex shrink-0 items-center gap-1 border-b bg-muted/30 p-1.5">
	<button
		type="button"
		onclick={() => (settingsStore.viewMode = 'editor')}
		class={cn(
			'flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors',
			settingsStore.viewMode !== 'preview'
				? 'bg-primary text-primary-foreground'
				: 'text-muted-foreground'
		)}
	>
		<PencilIcon class="size-3.5" /> Write
	</button>
	<button
		type="button"
		onclick={() => (settingsStore.viewMode = 'preview')}
		class={cn(
			'flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors',
			settingsStore.viewMode === 'preview'
				? 'bg-primary text-primary-foreground'
				: 'text-muted-foreground'
		)}
	>
		<EyeIcon class="size-3.5" /> Preview
	</button>
</div>