<script lang="ts">
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from "$lib/components/ui/input/index.js";
  	import { cn } from '$lib/utils.js';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import XIcon from '@lucide/svelte/icons/x';

	let scrollEl: HTMLDivElement | undefined = $state();
	let overflowing = $state(false);
	let renamingId = $state<string | null>(null);
	let renameValue = $state('');
	let draggingId = $state<string | null>(null);

	function checkOverflow() {
		if (!scrollEl) return;
		overflowing = scrollEl.scrollWidth > scrollEl.clientWidth + 1;
	}

	$effect(() => {
		tabsStore.tabs.length; // re-check whenever tabs are added/removed
		checkOverflow();
	});

	$effect(() => {
		if (!scrollEl) return;
		const observer = new ResizeObserver(checkOverflow);
		observer.observe(scrollEl);
		return () => observer.disconnect();
	});

	$effect(() => {
		const id = tabsStore.activeId;
		if (!id || !scrollEl) return;
		scrollEl
			.querySelector<HTMLElement>(`[data-tab-id="${id}"]`)
			?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
	});

	function handleWheel(e: WheelEvent) {
		if (!scrollEl || e.deltaY === 0) return;
		e.preventDefault();
		scrollEl.scrollLeft += e.deltaY;
	}

	function handleBarDblClick(e: MouseEvent) {
		if (e.target !== e.currentTarget) return;
		tabsStore.newTab();
	}

	function startRename(id: string, current: string) {
		renamingId = id;
		renameValue = current;
	}

	function commitRename() {
		if (renamingId) tabsStore.renameTab(renamingId, renameValue);
		renamingId = null;
	}

	function handleDrop(e: DragEvent, targetId: string) {
		e.preventDefault();
		const fromId = e.dataTransfer?.getData('text/plain');
		if (fromId) tabsStore.reorderTab(fromId, targetId);
		draggingId = null;
	}
</script>
<div class="flex items-center gap-1 border-b bg-muted/30 px-2 py-1.5">
	<div
		bind:this={scrollEl}
		onwheel={handleWheel}
		ondblclick={handleBarDblClick}
		role="tablist"
		tabindex={0}
		class="flex flex-1 items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30"
	>
		{#each tabsStore.tabs as tab (tab.id)}
			{@const isActive = tab.id === tabsStore.activeId}
			<div
				data-tab-id={tab.id}
				draggable="true"
				ondragstart={(e) => {
					draggingId = tab.id;
					e.dataTransfer?.setData('text/plain', tab.id);
				}}
				ondragover={(e) => e.preventDefault()}
				ondrop={(e) => handleDrop(e, tab.id)}
				onauxclick={(e) => {
					if (e.button === 1) {
						e.preventDefault();
						tabsStore.closeTab(tab.id);
					}
				}}
				class={cn(
					'group flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
					isActive
						? 'bg-primary text-primary-foreground shadow-sm'
						: 'text-muted-foreground hover:bg-muted',
					draggingId === tab.id && 'opacity-50'
				)}
				role="tab"
				tabindex={isActive ? 0 : -1}
			>
				{#if renamingId === tab.id}
					<Input
						autofocus
						value={renameValue}
						oninput={(e) => (renameValue = e.currentTarget.value)}
						onblur={commitRename}
						onkeydown={(e) => {
							if (e.key === 'Enter') commitRename();
							if (e.key === 'Escape') renamingId = null;
						}}
						class="h-6 w-28 px-1 text-sm"
					/>
				{:else}
					<button
						type="button"
						onclick={() => tabsStore.selectTab(tab.id)}
						ondblclick={(e) => {
							e.stopPropagation();
							startRename(tab.id, tab.title);
						}}
						class="max-w-40 truncate text-left"
					>
						{tab.title}
					</button>
					{#if tab.isDirty}
						<span class={cn('size-1.5 shrink-0 rounded-full', isActive ? 'bg-primary-foreground/70' : 'bg-foreground/50')}></span>
					{/if}
					<button
						tabindex={-1}
						aria-label="Close tab"
						onclick={(e) => {
							e.stopPropagation();
							tabsStore.closeTab(tab.id);
						}}
						class={cn(
							'rounded p-0.5 opacity-0 group-hover:opacity-100',
							isActive ? 'hover:bg-primary-foreground/20 opacity-100' : 'hover:bg-muted-foreground/20'
						)}
					>
						<XIcon class="size-3.5" />
						</button>
				{/if}
			</div>
		{/each}

		{#if !overflowing}
			<Button variant="ghost" size="icon-sm" class="shrink-0 rounded" aria-label="New tab" onclick={() => tabsStore.newTab()}>
				<PlusIcon class="size-4" />
			</Button>
		{/if}
	</div>

	{#if overflowing}
		<Button variant="ghost" size="icon-sm" class="shrink-0 rounded-full" aria-label="New tab" onclick={() => tabsStore.newTab()}>
			<PlusIcon class="size-4" />
		</Button>
	{/if}
</div>