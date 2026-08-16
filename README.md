# Tinymark

Tinymark is a lightweight markdown editor for writing, previewing, and exporting notes in the browser. It is built with SvelteKit and uses the [tinymarkdwn](https://github.com/JMcrafter26/tinymarkdwn) parser to render Markdown into HTML without needing a heavy app or a separate service.

The interface is intentionally simple: a tabbed editor, a live preview pane, keyboard shortcuts, and file actions that feel close to a desktop writing app while still being easy to run locally.

## Features

- Split editor and preview layout with editor-only and preview-only modes
- Multiple tabs for working on more than one document at a time
- Browser autosave for quick drafts
- Open local Markdown files and save back to disk when supported by the browser
- Export documents as plain HTML or styled HTML
- Dark and light theme support
- Word wrap controls and a mobile-friendly layout
- Incognito mode for temporary, non-persistent editing sessions

## Getting started

This project uses Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

Then open the local dev server in your browser. The app is configured to run as a Vite dev server through SvelteKit.

## Production build

```bash
pnpm build
pnpm preview
```

This creates a production build and serves it locally so you can check the compiled version before deployment.

## Scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm check
pnpm check:watch
```

## Notes

The editor is designed to feel like a small local writing tool rather than a full CMS or document platform. It is best suited for Markdown notes, quick drafts, and single-file export tasks.

When browser file system access is available, the app can open and save real files directly. Otherwise, it still keeps your work in the browser so you can continue editing without losing progress.

## Stack

- SvelteKit
- Svelte 5
- TypeScript
- Tailwind CSS
- shadcn-svelte
- tinymarkdwn
