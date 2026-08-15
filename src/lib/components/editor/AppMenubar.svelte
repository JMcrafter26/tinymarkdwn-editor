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
</Menubar.Root>

<AboutDialog bind:open={aboutOpen} />
<ShortcutsDialog bind:open={shortcutsOpen} />