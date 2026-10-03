/**
 * Sidebar view of the Context View measurement.
 *
 * The numbers come from `src/context-view` (the vendored pi-context-view
 * measurement), not from a separate estimate, so the sidebar panel and
 * `/atelier context usage` always agree.
 */
import type { ContextUsageSnapshot, UsageCategory } from "./context-view/model.ts";
import { sanitizeInline } from "./text.js";

/** One context category shown in the sidebar panel. */
export interface ContextCategory {
	readonly id: string;
	readonly label: string;
	readonly tokens: number;
	readonly preview?: string;
}

/** Lightweight snapshot of what occupies the model context. */
export interface ContextInspectorSnapshot {
	readonly computedAt: Date;
	readonly totalTokens: number;
	readonly contextWindow: number;
	readonly contextPercent: number | null;
	readonly categories: readonly ContextCategory[];
}

const PREVIEW_MAX_CHARS = 120;

/** Flatten a Context View usage snapshot into sidebar rows, largest category first. */
export function toContextInspectorSnapshot(usage: ContextUsageSnapshot): ContextInspectorSnapshot {
	const contextWindow = usage.reported?.contextWindow ?? 0;
	const percent = usage.reported?.percent;
	return {
		computedAt: usage.computedAt,
		totalTokens: usage.reported?.tokens ?? usage.estimatedTokens,
		contextWindow,
		contextPercent: percent ?? null,
		categories: usage.categories
			.filter((category) => category.tokens > 0)
			.map(toCategory)
			.sort((a, b) => b.tokens - a.tokens),
	};
}

function toCategory(category: UsageCategory): ContextCategory {
	const preview = (category.children ?? [])
		.slice(0, 3)
		.map((child) => sanitizeInline(child.label))
		.join(", ");
	return {
		id: category.id,
		label: sanitizeInline(category.label),
		tokens: category.tokens,
		...(preview.length > 0 ? { preview: truncate(preview) } : {}),
	};
}

function truncate(text: string): string {
	const cleaned = text.replace(/\s+/g, " ").trim();
	return cleaned.length <= PREVIEW_MAX_CHARS ? cleaned : `${cleaned.slice(0, PREVIEW_MAX_CHARS - 1)}…`;
}
