import type { ViewMode } from '$lib/types/editor';
import { loadStored } from './storage';

const STORAGE_KEY = 'md-editor:settings';

interface PersistedSettings {
	wordWrap: boolean;
	viewMode: ViewMode;
	disableAnimations: boolean;
}

const DEFAULT_SETTINGS: PersistedSettings = {
	wordWrap: true,
	viewMode: 'split',
	disableAnimations: false
};

function isPersistedSettings(value: unknown): value is PersistedSettings {
	if (!value || typeof value !== 'object') return false;

	const settings = value as Partial<PersistedSettings>;
	return (
		typeof settings.wordWrap === 'boolean' &&
		(settings.viewMode === 'split' || settings.viewMode === 'editor' || settings.viewMode === 'preview') &&
		typeof settings.disableAnimations === 'boolean'
	);
}

class SettingsStore {
	wordWrap = $state(DEFAULT_SETTINGS.wordWrap);
	viewMode = $state<ViewMode>(DEFAULT_SETTINGS.viewMode);
	disableAnimations = $state(DEFAULT_SETTINGS.disableAnimations);

	constructor() {
		const persisted = loadStored(STORAGE_KEY, DEFAULT_SETTINGS, isPersistedSettings);
		this.wordWrap = persisted.wordWrap;
		this.viewMode = persisted.viewMode;
		this.disableAnimations = persisted.disableAnimations;
	}

	toJSON(): PersistedSettings {
		return {
			wordWrap: this.wordWrap,
			viewMode: this.viewMode,
			disableAnimations: this.disableAnimations
		};
	}
}

export const settingsStore = new SettingsStore();
