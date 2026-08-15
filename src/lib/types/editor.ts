export interface Tab {
	id: string;
	title: string;
	content: string;
	isDirty: boolean;
	fileHandle?: FileSystemFileHandle;
}

export type ViewMode = 'split' | 'editor' | 'preview';