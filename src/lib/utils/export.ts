/*! tinymarkdwn v1.1.0 | MIT License | github.com/JMcrafter26/tinymarkdwn */
import { tinymarkdwn } from 'tinymarkdwn';

function escapeHtml(s: string) {
	// const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
	// return s.replace(/[&<>"']/g, (c) => map[c]);
}

function shell(title: string, head: string, bodyHtml: string) {
	return `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>${escapeHtml(title)}</title>
${head}
</head>
<body>
${bodyHtml}
</body>
</html>
`;
}

export function buildPlainHtml(title: string, markdown: string): string {
	return shell(title, '', tinymarkdwn(markdown));
}

const OFFLINE_STYLES = `
	:root { color-scheme: light dark; }
	body { margin: 0; padding: 3rem 1.5rem; font-family: ui-sans-serif, system-ui, sans-serif; line-height: 1.7; color: #1f2328; background: #fff; }
	@media (prefers-color-scheme: dark) {
		body { color: #d0d7de; background: #0d1117; }
		a { color: #58a6ff; } code, pre { background: #161b22; }
		blockquote { border-color: #30363d; color: #9198a1; } th, td { border-color: #30363d; }
	}
	main { max-width: 42rem; margin: 0 auto; }
	h1, h2, h3, h4 { line-height: 1.25; font-weight: 600; margin: 1.6em 0 0.6em; }
	h1 { font-size: 2em; } h2 { font-size: 1.5em; } h3 { font-size: 1.25em; }
	p, ul, ol, blockquote, pre, table { margin: 0.8em 0; }
	ul, ol { padding-left: 1.5em; }
	a { color: #0969da; }
	code { font-family: ui-monospace, SFMono-Regular, monospace; background: #f6f8fa; padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; }
	pre { background: #f6f8fa; padding: 1em; border-radius: 8px; overflow-x: auto; }
	pre code { background: none; padding: 0; }
	blockquote { border-left: 3px solid #d0d7de; margin-left: 0; padding-left: 1em; color: #59636e; }
	table { border-collapse: collapse; width: 100%; }
	th, td { border: 1px solid #d0d7de; padding: 0.5em 0.75em; text-align: left; }
	img { max-width: 100%; }
`;

export function buildStyledHtmlOffline(title: string, markdown: string): string {
	const head = `\t<style>${OFFLINE_STYLES}</style>`;
	const body = `<main>\n${tinymarkdwn(markdown)}\n</main>`;
	return shell(title, head, body);
}

export function downloadHtml(filename: string, html: string) {
	const blob = new Blob([html], { type: 'text/html' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename.endsWith('.html') ? filename : `${filename}.html`;
	a.click();
	URL.revokeObjectURL(url);
}