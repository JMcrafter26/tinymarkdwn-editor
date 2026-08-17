<script lang="ts">
	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { userPrefersMode } from 'mode-watcher';
	import AboutDialog from './AboutDialog.svelte';
	import ShortcutsDialog from './ShortcutsDialog.svelte';
	import {
		newFile,
		openFile,
		saveActiveTab,
		saveActiveTabAs,
		closeActiveTab,
		undoActiveTab,
		redoActiveTab,
		exportActiveTab,
		copySelection,
		cutSelection,
		pasteClipboard
	} from '$lib/actions/editor-actions';

	let aboutOpen = $state(false);
	let shortcutsOpen = $state(false);

	function openDialog(setOpen: (v: boolean) => void) {
		return (e: Event) => {
			e.preventDefault(); // don't let the menu's own focus-return fight the dialog
			setOpen(true);
		};
	}


	const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
	const mod = isMac ? '⌘' : 'Ctrl';
	const alt = isMac ? '⌥' : 'Alt';

	const shortcuts = [
		{ keys: [mod,alt, 'N'], action: 'New file' },
		{ keys: [mod,alt, 'O'], action: 'Open file' },
		{ keys: [mod, 'S'], action: 'Save' },
		{ keys: [mod,alt, 'S'], action: 'Save As' },
		{ keys: [mod,alt, 'W'], action: 'Close tab' },
		{ keys: [mod,alt, '←/→'], action: 'Switch tabs' },
		{ keys: [mod,alt, '1-9'], action: 'Jump to tab' },
		{ keys: [mod, 'Z', '⇧+Z'], action: 'Undo / redo (native, while editing)' },
		{ keys: [mod, 'X', 'C', 'V'], action: 'Cut / copy / paste (native, while editing)' }
	];
</script>

<Menubar.Root class="rounded-none border-x-0 border-t-0 px-2">
	<Menubar.Menu>
		<Menubar.Trigger>File</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item onSelect={newFile}>New File <Menubar.Shortcut>{shortcuts[0].keys.join(' ')}</Menubar.Shortcut></Menubar.Item>
			<Menubar.Item onSelect={openFile}>Open File... <Menubar.Shortcut>{shortcuts[1].keys.join(' ')}</Menubar.Shortcut></Menubar.Item>
			<Menubar.Separator />
			<Menubar.Item onSelect={saveActiveTab}>Save <Menubar.Shortcut>{shortcuts[2].keys.join(' ')}</Menubar.Shortcut></Menubar.Item>
			<Menubar.Item onSelect={saveActiveTabAs}>Save As... <Menubar.Shortcut>{shortcuts[3].keys.join(' ')}</Menubar.Shortcut></Menubar.Item>
			<Menubar.Sub>
				<Menubar.SubTrigger>Export</Menubar.SubTrigger>
				<Menubar.SubContent>
					<Menubar.Item onSelect={() => exportActiveTab('plain')}>Plain HTML</Menubar.Item>
					<Menubar.Item onSelect={() => exportActiveTab('offline')}>Styled HTML</Menubar.Item>
				</Menubar.SubContent>
			</Menubar.Sub>
			<Menubar.Separator />
			<Menubar.Item onSelect={closeActiveTab}>Close Tab <Menubar.Shortcut>{shortcuts[4].keys.join(' ')}</Menubar.Shortcut></Menubar.Item>
			<Menubar.Separator />
			<Menubar.CheckboxItem
				checked={tabsStore.incognito}
				onCheckedChange={(v) => tabsStore.setIncognito(v)}
			>
				Incognito (don't save locally)
			</Menubar.CheckboxItem>
		</Menubar.Content>
	</Menubar.Menu>

	<Menubar.Menu>
		<Menubar.Trigger>Edit</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item onSelect={undoActiveTab}>Undo <Menubar.Shortcut>{shortcuts[6].keys.join(' ')}</Menubar.Shortcut></Menubar.Item>
			<Menubar.Item onSelect={redoActiveTab}>Redo <Menubar.Shortcut>{shortcuts[7].keys.join(' ')}</Menubar.Shortcut></Menubar.Item>
			<Menubar.Separator />
			<Menubar.Item onSelect={cutSelection}>Cut <Menubar.Shortcut>{shortcuts[8].keys.join(' ')}</Menubar.Shortcut></Menubar.Item>
			<Menubar.Item onSelect={copySelection}>Copy <Menubar.Shortcut>{shortcuts[8].keys.join(' ')}</Menubar.Shortcut></Menubar.Item>
			<Menubar.Item onSelect={pasteClipboard}>Paste <Menubar.Shortcut>{shortcuts[8].keys.join(' ')}</Menubar.Shortcut></Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>

	<Menubar.Menu>
		<Menubar.Trigger>View</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.CheckboxItem bind:checked={settingsStore.wordWrap}>Word Wrap</Menubar.CheckboxItem>
			<Menubar.Separator />
			<Menubar.RadioGroup bind:value={settingsStore.viewMode}>
				<Menubar.RadioItem value="split">Split View</Menubar.RadioItem>
				<Menubar.RadioItem value="editor">Editor Only</Menubar.RadioItem>
				<Menubar.RadioItem value="preview">Preview Only</Menubar.RadioItem>
			</Menubar.RadioGroup>
			<Menubar.Separator />
			<Menubar.Sub>
				<Menubar.SubTrigger>Theme</Menubar.SubTrigger>
				<Menubar.SubContent>
					<Menubar.RadioGroup bind:value={userPrefersMode.current}>
						<Menubar.RadioItem value="light">Light</Menubar.RadioItem>
						<Menubar.RadioItem value="dark">Dark</Menubar.RadioItem>
						<Menubar.RadioItem value="system">System</Menubar.RadioItem>
					</Menubar.RadioGroup>
				</Menubar.SubContent>
			</Menubar.Sub>
		</Menubar.Content>
	</Menubar.Menu>

	<Menubar.Menu>
		<Menubar.Trigger>Help</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item onSelect={openDialog((v) => (shortcutsOpen = v))}>Keyboard Shortcuts</Menubar.Item>
			<Menubar.Item onSelect={openDialog((v) => (aboutOpen = v))}>About</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>

	<a
		href="https://github.com/JMcrafter26/tinymarkdwn-editor"
		rel="noopener noreferrer"
		target="_blank"
		aria-label="Open project on GitHub"
		class="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
	>
		<svg
			role="img"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			class="h-4 w-4 fill-current"
		>
			<title>GitHub</title>
			<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
		</svg>
	</a>
</Menubar.Root>

<AboutDialog bind:open={aboutOpen} />
<ShortcutsDialog bind:open={shortcutsOpen} />