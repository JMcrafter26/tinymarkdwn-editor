import type { ViewMode } from '$lib/types/editor';

class SettingsStore {
	wordWrap = $state(false);
	viewMode = $state<ViewMode>('split');
}

export const settingsStore = new SettingsStore();