import type { ViewMode } from '$lib/types/editor';

class SettingsStore {
	wordWrap = $state(true);
	viewMode = $state<ViewMode>('split');
	disableAnimations = $state(false);
}

export const settingsStore = new SettingsStore();