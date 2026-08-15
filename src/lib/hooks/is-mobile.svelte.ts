import { getContext, setContext } from 'svelte';

const KEY = Symbol('is-mobile');
const BREAKPOINT = 768; // Tailwind's `md`

export class IsMobile {
	#current = $state(false);

	constructor() {
		if (typeof window === 'undefined') return;
		const mql = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);
		const update = () => (this.#current = mql.matches);
		update();
		mql.addEventListener('change', update);
		$effect(() => () => mql.removeEventListener('change', update));
	}

	get current() {
		return this.#current;
	}
}

export function provideIsMobile() {
	const instance = new IsMobile();
	setContext(KEY, instance);
	return instance;
}

export function useIsMobile(): IsMobile {
	return getContext(KEY);
}