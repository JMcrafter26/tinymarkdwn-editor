export function loadStored<T>(key: string, fallback: T, isValid: (value: unknown) => value is T): T {
	if (typeof localStorage === 'undefined') return fallback;

	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;

		const value: unknown = JSON.parse(raw);
		return isValid(value) ? value : fallback;
	} catch {
		return fallback;
	}
}

export function saveStored<T>(key: string, value: T): void {
	if (typeof localStorage === 'undefined') return;

	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Storage can be unavailable or full; the in-memory state remains usable.
	}
}
