/**
 * Converts TinaCMS rich-text content to an HTML string.
 *
 * TinaCMS rich-text fields store markdown strings on disk. This function
 * uses the remark/rehype pipeline (already installed as TinaCMS dependencies)
 * to convert markdown → HTML.
 *
 * Also handles the Plate AST format (served via the GraphQL API) as a fallback.
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify);

function markdownToHtml(md: string): string {
  const result = processor.processSync(md);
  return String(result);
}

// --- Plate AST rendering (fallback for GraphQL API responses) ---

interface RichTextNode {
  type: string;
  children?: RichTextNode[];
  text?: string;
  url?: string;
  alt?: string;
  lang?: string;
  value?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderChildren(children?: RichTextNode[]): string {
  if (!children) return "";
  return children.map(renderNode).join("");
}

function renderNode(node: RichTextNode): string {
  if (node.type === "text" || (!node.type && typeof node.text === "string")) {
    let html = escapeHtml(node.text ?? "");
    if (node.bold) html = `<strong>${html}</strong>`;
    if (node.italic) html = `<em>${html}</em>`;
    if (node.underline) html = `<u>${html}</u>`;
    if (node.strikethrough) html = `<s>${html}</s>`;
    if (node.code) html = `<code>${html}</code>`;
    return html;
  }

  const inner = renderChildren(node.children);

  switch (node.type) {
    case "root":
      return inner;
    case "p":
      return `<p>${inner}</p>`;
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return `<${node.type}>${inner}</${node.type}>`;
    case "blockquote":
    case "block_quote":
      return `<blockquote>${inner}</blockquote>`;
    case "ul":
      return `<ul>${inner}</ul>`;
    case "ol":
      return `<ol>${inner}</ol>`;
    case "li":
      return `<li>${inner}</li>`;
    case "lic":
      return inner;
    case "a":
      return `<a href="${escapeHtml(node.url ?? "")}">${inner}</a>`;
    case "img":
      return `<img src="${escapeHtml(node.url ?? "")}" alt="${escapeHtml(node.alt ?? "")}" />`;
    case "break":
      return "<br />";
    case "hr":
      return "<hr />";
    case "code_block": {
      const code =
        node.value ??
        (node.children ?? [])
          .map((line) => renderChildren(line.children))
          .join("\n");
      return `<pre><code>${escapeHtml(code)}</code></pre>`;
    }
    default:
      return inner;
  }
}

export function richTextToHtml(
  value: RichTextNode | string | null | undefined,
): string {
  if (value == null) return "";
  if (typeof value === "string") return markdownToHtml(value);
  if (typeof value === "object" && value.type) return renderNode(value);
  return "";
}
