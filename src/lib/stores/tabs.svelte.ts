import type { Tab } from '$lib/types/editor';

const STORAGE_KEY = 'md-editor:tabs';
const INCOGNITO_KEY = 'md-editor:incognito';

function makeId() {
	return crypto.randomUUID();
}

function loadIncognito(): boolean {
	if (typeof localStorage === 'undefined') return false;
	try {
		return localStorage.getItem(INCOGNITO_KEY) === '1';
	} catch {
		return false;
	}
}

function loadPersisted(): { tabs: Tab[]; activeId: string | null } | null {
	if (typeof localStorage === 'undefined') return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		// file handles can't survive JSON — drop them, user can re-save to reattach
		const tabs = (parsed.tabs as Tab[]).map((t) => ({ ...t, fileHandle: undefined }));
		return { tabs, activeId: parsed.activeId ?? null };
	} catch {
		return null;
	}
}

interface HistoryEntry {
	stack: string[];
	index: number;
}

class TabsStore {
	tabs = $state<Tab[]>([]);
	activeId = $state<string | null>(null);
	incognito = $state(loadIncognito());

	active = $derived(this.tabs.find((t) => t.id === this.activeId) ?? null);
	hasDirty = $derived(this.tabs.some((t) => t.isDirty));

	#history = new Map<string, HistoryEntry>();
	#historyTimers = new Map<string, ReturnType<typeof setTimeout>>();
	#saveTimer: ReturnType<typeof setTimeout> | undefined;

	constructor() {
		const persisted = !this.incognito ? loadPersisted() : null;

		if (persisted && persisted.tabs.length > 0) {
			this.tabs = persisted.tabs;
			this.activeId = persisted.activeId ?? persisted.tabs[0].id;
		} else {
			this.newTab('welcome.md', '# Hello\n\nStart **typing** _markdown_ on the left.');
		}

		for (const tab of this.tabs) {
			this.#history.set(tab.id, { stack: [tab.content], index: 0 });
		}
	}

	newTab(title = 'untitled.md', content = '') {
		const tab: Tab = { id: makeId(), title, content, isDirty: false };
		this.tabs.push(tab);
		this.activeId = tab.id;
		this.#history.set(tab.id, { stack: [content], index: 0 });
		this.#save();
		return tab;
	}

	closeTab(id: string) {
		const idx = this.tabs.findIndex((t) => t.id === id);
		if (idx === -1) return;

		this.tabs.splice(idx, 1);
		this.#history.delete(id);
		clearTimeout(this.#historyTimers.get(id));
		this.#historyTimers.delete(id);

		if (this.activeId === id) {
			const fallback = this.tabs[idx] ?? this.tabs[idx - 1];
			this.activeId = fallback?.id ?? null;
		}

		this.#save();
	}

	selectTab(id: string) {
		this.activeId = id;
		this.#save();
	}

	updateContent(id: string, content: string) {
		const tab = this.tabs.find((t) => t.id === id);
		if (!tab) return;
		tab.content = content;
		tab.isDirty = true;

		clearTimeout(this.#historyTimers.get(id));
		this.#historyTimers.set(
			id,
			setTimeout(() => this.#pushHistory(id, content), 600)
		);

		this.#save();
	}

	undo(id: string) {
		const entry = this.#history.get(id);
		const tab = this.tabs.find((t) => t.id === id);
		if (!entry || !tab || entry.index === 0) return;
		entry.index -= 1;
		tab.content = entry.stack[entry.index];
		tab.isDirty = true;
	}

	redo(id: string) {
		const entry = this.#history.get(id);
		const tab = this.tabs.find((t) => t.id === id);
		if (!entry || !tab || entry.index >= entry.stack.length - 1) return;
		entry.index += 1;
		tab.content = entry.stack[entry.index];
		tab.isDirty = true;
	}

	renameTab(id: string, title: string) {
		const tab = this.tabs.find((t) => t.id === id);
		if (tab && title.trim()) tab.title = title.trim();
		this.#save();
	}

	reorderTab(fromId: string, toId: string) {
		if (fromId === toId) return;
		const fromIdx = this.tabs.findIndex((t) => t.id === fromId);
		const toIdx = this.tabs.findIndex((t) => t.id === toId);
		if (fromIdx === -1 || toIdx === -1) return;
		const [moved] = this.tabs.splice(fromIdx, 1);
		this.tabs.splice(toIdx, 0, moved);
		this.#save();
	}

	markSaved(id: string, fileHandle?: FileSystemFileHandle) {
		const tab = this.tabs.find((t) => t.id === id);
		if (!tab) return;
		tab.isDirty = false;
		if (fileHandle) tab.fileHandle = fileHandle;
	}

	setIncognito(value: boolean) {
		this.incognito = value;
		try {
			localStorage.setItem(INCOGNITO_KEY, value ? '1' : '0');
			if (value) localStorage.removeItem(STORAGE_KEY);
			else this.#save();
		} catch {
			// storage unavailable — incognito already achieves the intent
		}
	}

	#pushHistory(id: string, content: string) {
		const entry = this.#history.get(id);
		if (!entry) {
			this.#history.set(id, { stack: [content], index: 0 });
			return;
		}
		entry.stack = entry.stack.slice(0, entry.index + 1);
		entry.stack.push(content);
		if (entry.stack.length > 100) entry.stack.shift();
		entry.index = entry.stack.length - 1;
	}

	#save() {
		if (this.incognito || typeof localStorage === 'undefined') return;
		clearTimeout(this.#saveTimer);
		this.#saveTimer = setTimeout(() => {
			try {
				const serializable = this.tabs.map(({ fileHandle, ...rest }) => rest);
				localStorage.setItem(
					STORAGE_KEY,
					JSON.stringify({ tabs: serializable, activeId: this.activeId })
				);
			} catch {
				// quota exceeded / unavailable — fail silently, editor still works
			}
		}, 300);
	}
}

export const tabsStore = new TabsStore();