/**
 * Plain-text extraction from Payload's Lexical richText JSON. Used by the
 * CMS adapter (lib/cmsAdapter.ts) to convert editable rich text back into
 * the plain strings the app's existing types (lib/types.ts) expect.
 *
 * Only handles the node types the seed script produces (paragraph, text,
 * bullet list) — sufficient for the adapter's needs, not a general-purpose
 * Lexical renderer.
 */

type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
};

export type LexicalRichText = { root?: { children?: LexicalNode[] } } | null | undefined;

function extractText(node: LexicalNode): string {
  if (node.type === "text") return node.text ?? "";
  if (Array.isArray(node.children)) return node.children.map(extractText).join("");
  return "";
}

/** One string per top-level paragraph node. Bullet lists are skipped. */
export function richTextToParagraphs(doc: LexicalRichText): string[] {
  const children = doc?.root?.children ?? [];
  return children.filter((c) => c.type === "paragraph").map((p) => extractText(p).trim());
}

/** The first paragraph's text, or undefined if there is none. */
export function richTextToString(doc: LexicalRichText): string | undefined {
  return richTextToParagraphs(doc)[0];
}

/** One string per list item, from the first bullet list found. */
export function richTextToBullets(doc: LexicalRichText): string[] {
  const children = doc?.root?.children ?? [];
  const list = children.find((c) => c.type === "list");
  if (!list?.children) return [];
  return list.children.map((li) => extractText(li).trim());
}
