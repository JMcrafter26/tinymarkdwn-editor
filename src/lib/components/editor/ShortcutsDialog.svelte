<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Kbd } from '$lib/components/ui/kbd/index.js';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
	const mod = isMac ? '⌘' : 'Ctrl';
	const alt = isMac ? '⌥' : 'Alt';

	const shortcuts = [
		{ keys: `${mod}+${alt}+N`, action: 'New file' },
		{ keys: `${mod}+${alt}+O`, action: 'Open file' },
		{ keys: `${mod}+S`, action: 'Save' },
		{ keys: `${mod}+${alt}+S`, action: 'Save As' },
		{ keys: `${mod}+${alt}+W`, action: 'Close tab' },
		{ keys: `${mod}+${alt}+←/→`, action: 'Switch tabs' },
		{ keys: `${mod}+${alt}+1–9`, action: 'Jump to tab' },
		{ keys: `${mod}+Z / ${mod}+⇧+Z`, action: 'Undo / redo (native, while editing)' },
		{ keys: `${mod}+X / ${mod}+C / ${mod}+V`, action: 'Cut / copy / paste (native, while editing)' }
	];
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Keyboard shortcuts</Dialog.Title>
			<Dialog.Description>
				We use {alt} on a few combos to avoid clashing with your browser's own shortcuts.
			</Dialog.Description>
		</Dialog.Header>
		<div class="text-sm">
			{#each shortcuts as s (s.action)}
				<div class="flex items-center justify-between border-b py-1.5 last:border-0">
					<span class="text-muted-foreground">{s.action}</span>
					<Kbd>{s.keys}</Kbd>
				</div>
			{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>