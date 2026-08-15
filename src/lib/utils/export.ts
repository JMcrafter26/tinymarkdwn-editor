/*! tinymarkdwn v1.1.0 | MIT License | github.com/JMcrafter26/tinymarkdwn */
(function(){
function tinymarkdwn(e){if("string"!=typeof e)return"";e=e.replace(/\r\n?/g,"\n");const t=e=>/^(https?:|mailto:|\/|#|\.{1,2}\/)/i.test(e.trim())?e.trim():"#",r=[],l=e=>"\0"+(r.push(e)-1)+"\0",n=/\\([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])/g,o=e=>e.replace(/(?<!\\)`([^`\n]+)(?<!\\)`/g,(e,t)=>l(`<code>${t}</code>`)).replace(n,(e,t)=>l("&"===t?"&":`&#${t.charCodeAt(0)};`)).replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,(e,r,l,n)=>`<img src="${t(l)}" alt="${r}"${n?` title="${n}"`:""}>`).replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,(e,r,l,n)=>`<a href="${t(l)}"${n?` title="${n}"`:""} rel="noopener noreferrer">${r}</a>`).replace(/&lt;((?:https?|mailto):[^\s&]+)&gt;/g,(e,r)=>`<a href="${t(r)}" rel="noopener noreferrer">${r}</a>`).replace(/(\*\*\*|___)(.+?)\1/g,"<strong><em>$2</em></strong>").replace(/(\*\*|__)(.+?)\1/g,"<strong>$2</strong>").replace(/(\*|_)(.+?)\1/g,"<em>$2</em>").replace(/~~(.+?)~~/g,"<del>$1</del>");let a=(p=e,p.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[e]))).replace(/(?<!\\)```(\S*)\n([\s\S]*?)(?<!\\)```/g,(e,t,r)=>l(`<pre><code${t?` class="language-${t}"`:""}>${r}</code></pre>`));var p;return a=a.replace(/^(\|.+\|)\n\|[-: |]+\|\n((?:\|.*\|\n?)*)/gm,(e,t,r)=>{const l=(e,t)=>"<tr>"+e.replace(/^\||\|$/g,"").split(/(?<!\\)\|/).map(e=>`<${t}>${o(e.trim())}</${t}>`).join("")+"</tr>",n=r.trim().split("\n").filter(Boolean).map(e=>l(e,"td")).join("");return`<table><thead>${l(t,"th")}</thead><tbody>${n}</tbody></table>\n`}).replace(/^ {0,3}(#{1,6}) +(.*)$/gm,(e,t,r)=>`<h${t.length}>${o(r)}</h${t.length}>`).replace(/^ {0,3}([-*_])( *\1){2,} *$/gm,"<hr>").replace(/^(?: {0,3}&gt;.*\n?)+/gm,e=>`<blockquote>${e.replace(/^ {0,3}&gt;\s?/gm,"").trim().split("\n").map(o).join("<br>")}</blockquote>`).replace(/^(?: {0,3}\d+\.\s+.*\n?)+/gm,e=>`<ol>${e.trim().split("\n").map(e=>{const t=e.replace(/^ {0,3}\d+\.\s+/,"").replace(/^\[( |x|X)\]\s*/,(e,t)=>`<input type="checkbox" disabled${" "!==t?" checked":""}> `);return`<li>${o(t)}</li>`}).join("")}</ol>`).replace(/^(?: {0,3}[-*+]\s+.*\n?)+/gm,e=>`<ul>${e.trim().split("\n").map(e=>{const t=e.replace(/^ {0,3}[-*+]\s+/,"").replace(/^\[( |x|X)\]\s*/,(e,t)=>`<input type="checkbox" disabled${" "!==t?" checked":""}> `);return`<li>${o(t)}</li>`}).join("")}</ul>`).split(/\n{2,}/).map(e=>{const t=e=>/^<(h\d|ul|ol|blockquote|hr|table)/.test(e)||/^\u0000\d+\u0000$/.test(e);let r="",l=[];const n=()=>{l.length&&(r+=`<p>${l.map(o).join("<br>")}</p>\n`,l=[])};for(const o of e.split("\n")){const e=o.trim();e&&(t(e)?(n(),r+=e+"\n"):l.push(e))}return n(),r.trim()}).join("\n"),a.replace(/\u0000(\d+)\u0000/g,(e,t)=>r[t]).trim()}"undefined"!=typeof module&&module.exports?(module.exports=tinymarkdwn,module.exports.tinymarkdwn=tinymarkdwn):"undefined"!=typeof globalThis&&(globalThis.tinymarkdwn=tinymarkdwn);
})();

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