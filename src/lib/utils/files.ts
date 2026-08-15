import type { Tab } from '$lib/types/editor';

export async function pickFilesToOpen(): Promise<{ name: string; content: string }[]> {
	if (typeof window === 'undefined') return [];

	if ('showOpenFilePicker' in window) {
		try {
			// @ts-expect-error - File System Access API types not in lib.dom yet
			const handles: FileSystemFileHandle[] = await window.showOpenFilePicker({
				multiple: true,
				types: [
					{
						description: 'Markdown',
						accept: { 'text/markdown': ['.md', '.markdown', '.txt'] }
					}
				]
			});
			return Promise.all(
				handles.map(async (handle) => {
					const file = await handle.getFile();
					return { name: file.name, content: await file.text() };
				})
			);
		} catch (err) {
			if ((err as DOMException).name === 'AbortError') return [];
			throw err;
		}
	}

	return new Promise((resolve) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.md,.markdown,.txt';
		input.multiple = true;
		input.onchange = async () => {
			const files = Array.from(input.files ?? []);
			resolve(await Promise.all(files.map(async (f) => ({ name: f.name, content: await f.text() }))));
		};
		input.click();
	});
}

export async function saveTab(tab: Tab): Promise<FileSystemFileHandle | undefined> {
	if (tab.fileHandle) {
		const writable = await tab.fileHandle.createWritable();
		await writable.write(tab.content);
		await writable.close();
		return tab.fileHandle;
	}
	return saveTabAs(tab);
}

export async function saveTabAs(tab: Tab): Promise<FileSystemFileHandle | undefined> {
	if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
		try {
			// @ts-expect-error - File System Access API types not in lib.dom yet
			const handle: FileSystemFileHandle = await window.showSaveFilePicker({
				suggestedName: tab.title,
				types: [{ description: 'Markdown', accept: { 'text/markdown': ['.md'] } }]
			});
			const writable = await handle.createWritable();
			await writable.write(tab.content);
			await writable.close();
			return handle;
		} catch (err) {
			if ((err as DOMException).name === 'AbortError') return undefined;
			throw err;
		}
	}

	downloadAsFile(tab.title, tab.content);
	return undefined;
}

function downloadAsFile(filename: string, content: string) {
	const blob = new Blob([content], { type: 'text/markdown' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename.endsWith('.md') ? filename : `${filename}.md`;
	a.click();
	URL.revokeObjectURL(url);
}