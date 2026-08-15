class EditorRefStore {
	el = $state<HTMLTextAreaElement | null>(null);
	selectionStart = $state(0);
	selectionEnd = $state(0);
}

export const editorRef = new EditorRefStore();