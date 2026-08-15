<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let { open = $bindable(false) }: { open?: boolean } = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>About this editor</Dialog.Title>
			<Dialog.Description>
				A small split-view markdown editor built with SvelteKit, shadcn-svelte, and uses <a href="https://github.com/JMcrafter26/tinymarkdwn/" target="_blank" rel="noopener noreferrer" class="text-primary underline">tinymarkdwn</a>, a tiny but powerful markdown parser under the hood.<br/>It supports tables, code blocks, checkboxes, and more.
			</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-2 text-sm text-muted-foreground">
			<p>
				Everything you write is saved to this browser automatically, unless Incognito is turned
				on in the File menu.
			</p>
			<p>Use File → Open / Save to work with real files on disk, where your browser supports it.</p>
		</div>
	</Dialog.Content>
</Dialog.Root>