import autoAnimate, { type AutoAnimateOptions } from '@formkit/auto-animate';
import { settingsStore } from '$lib/stores/settings.svelte';

export function animate(node: HTMLElement, options: AutoAnimateOptions = {}) {
    const controller = autoAnimate(node, options);

    // This automatically watches settingsStore.disableAnimations for changes
    $effect(() => {
        if (settingsStore.disableAnimations) {
            controller.disable();
        } else {
            controller.enable();
        }
    });

    return {
        // Only needed if your options (like duration) change reactively
        // update(newOptions: AutoAnimateOptions) { ... } 
        destroy() {
            controller.disable();
        }
    };
}