<script lang="ts">
	import { tabsStore } from '$lib/stores/tabs.svelte';
    
    /*! tinymarkdwn v1.1.0 | MIT License | github.com/JMcrafter26/tinymarkdwn */
    (function(){
    function tinymarkdwn(e){if("string"!=typeof e)return"";e=e.replace(/\r\n?/g,"\n");const t=e=>/^(https?:|mailto:|\/|#|\.{1,2}\/)/i.test(e.trim())?e.trim():"#",r=[],l=e=>"\0"+(r.push(e)-1)+"\0",n=/\\([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])/g,o=e=>e.replace(/(?<!\\)`([^`\n]+)(?<!\\)`/g,(e,t)=>l(`<code>${t}</code>`)).replace(n,(e,t)=>l("&"===t?"&":`&#${t.charCodeAt(0)};`)).replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,(e,r,l,n)=>`<img src="${t(l)}" alt="${r}"${n?` title="${n}"`:""}>`).replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,(e,r,l,n)=>`<a href="${t(l)}"${n?` title="${n}"`:""} rel="noopener noreferrer">${r}</a>`).replace(/&lt;((?:https?|mailto):[^\s&]+)&gt;/g,(e,r)=>`<a href="${t(r)}" rel="noopener noreferrer">${r}</a>`).replace(/(\*\*\*|___)(.+?)\1/g,"<strong><em>$2</em></strong>").replace(/(\*\*|__)(.+?)\1/g,"<strong>$2</strong>").replace(/(\*|_)(.+?)\1/g,"<em>$2</em>").replace(/~~(.+?)~~/g,"<del>$1</del>");let a=(p=e,p.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[e]))).replace(/(?<!\\)```(\S*)\n([\s\S]*?)(?<!\\)```/g,(e,t,r)=>l(`<pre><code${t?` class="language-${t}"`:""}>${r}</code></pre>`));var p;return a=a.replace(/^(\|.+\|)\n\|[-: |]+\|\n((?:\|.*\|\n?)*)/gm,(e,t,r)=>{const l=(e,t)=>"<tr>"+e.replace(/^\||\|$/g,"").split(/(?<!\\)\|/).map(e=>`<${t}>${o(e.trim())}</${t}>`).join("")+"</tr>",n=r.trim().split("\n").filter(Boolean).map(e=>l(e,"td")).join("");return`<table><thead>${l(t,"th")}</thead><tbody>${n}</tbody></table>\n`}).replace(/^ {0,3}(#{1,6}) +(.*)$/gm,(e,t,r)=>`<h${t.length}>${o(r)}</h${t.length}>`).replace(/^ {0,3}([-*_])( *\1){2,} *$/gm,"<hr>").replace(/^(?: {0,3}&gt;.*\n?)+/gm,e=>`<blockquote>${e.replace(/^ {0,3}&gt;\s?/gm,"").trim().split("\n").map(o).join("<br>")}</blockquote>`).replace(/^(?: {0,3}\d+\.\s+.*\n?)+/gm,e=>`<ol>${e.trim().split("\n").map(e=>{const t=e.replace(/^ {0,3}\d+\.\s+/,"").replace(/^\[( |x|X)\]\s*/,(e,t)=>`<input type="checkbox" disabled${" "!==t?" checked":""}> `);return`<li>${o(t)}</li>`}).join("")}</ol>`).replace(/^(?: {0,3}[-*+]\s+.*\n?)+/gm,e=>`<ul>${e.trim().split("\n").map(e=>{const t=e.replace(/^ {0,3}[-*+]\s+/,"").replace(/^\[( |x|X)\]\s*/,(e,t)=>`<input type="checkbox" disabled${" "!==t?" checked":""}> `);return`<li>${o(t)}</li>`}).join("")}</ul>`).split(/\n{2,}/).map(e=>{const t=e=>/^<(h\d|ul|ol|blockquote|hr|table)/.test(e)||/^\u0000\d+\u0000$/.test(e);let r="",l=[];const n=()=>{l.length&&(r+=`<p>${l.map(o).join("<br>")}</p>\n`,l=[])};for(const o of e.split("\n")){const e=o.trim();e&&(t(e)?(n(),r+=e+"\n"):l.push(e))}return n(),r.trim()}).join("\n"),a.replace(/\u0000(\d+)\u0000/g,(e,t)=>r[t]).trim()}"undefined"!=typeof module&&module.exports?(module.exports=tinymarkdwn,module.exports.tinymarkdwn=tinymarkdwn):"undefined"!=typeof globalThis&&(globalThis.tinymarkdwn=tinymarkdwn);
    })();

	let html = $derived(tabsStore.active ? tinymarkdwn(tabsStore.active.content) : '');
</script>

<div class="h-full overflow-y-auto p-6">
	{#if tabsStore.active}
		<article class="prose prose-sm dark:prose-invert max-w-none">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html html}
		</article>
	{:else}
		<div class="flex h-full items-center justify-center text-sm text-muted-foreground">
			Nothing to preview
		</div>
	{/if}
</div>