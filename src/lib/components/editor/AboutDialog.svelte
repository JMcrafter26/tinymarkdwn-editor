<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let { open = $bindable(false) }: { open?: boolean } = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>About TinyMarkdwn Editor</Dialog.Title>
			<Dialog.Description>
				A lightweight split-view markdown editor built with SvelteKit and shadcn-svelte, powered by
				<a
					href="https://github.com/JMcrafter26/tinymarkdwn/"
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary underline"
				>
					tinymarkdwn
				</a>
				for fast markdown parsing.
			</Dialog.Description>
		</Dialog.Header>

			<p class="text-muted-foreground">
				Your notes are auto-saved in this browser unless Incognito mode is enabled from the File menu.
				Use File -> Open / Save to work with files on disk where your browser supports it.
			</p>

		<Dialog.Footer class="sm:justify-between" showCloseButton={true}>
			<a
				href="https://github.com/JMcrafter26/tinymarkdwn-editor"
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm text-primary underline"
			>
				View editor source
			</a>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>