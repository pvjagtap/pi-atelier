import { describe, expect, it } from "vitest";
import { toContextInspectorSnapshot } from "../src/context-inspector.js";
import type { ContextUsageSnapshot } from "../src/context-view/model.ts";

const snapshot: ContextUsageSnapshot = {
	computedAt: new Date(0),
	estimatedTokens: 900,
	reported: { tokens: 1000, contextWindow: 128_000, percent: 0.8 },
	categories: [
		{ id: "tools", label: "Tools", tokens: 300, children: [{ id: "t:read", label: "read", tokens: 200 }] },
		{ id: "prompt", label: "System Prompt", tokens: 600 },
		{ id: "empty", label: "Nothing", tokens: 0 },
	],
};

describe("toContextInspectorSnapshot", () => {
	it("keeps request order, drops empty categories, and prefers reported totals", () => {
		const result = toContextInspectorSnapshot(snapshot);
		expect(result.categories.map((category) => category.label)).toEqual(["Tools", "System Prompt"]);
		expect(result.totalTokens).toBe(1000);
		expect(result.contextWindow).toBe(128_000);
		expect(result.contextPercent).toBe(0.8);
		expect(result.categories[0]?.preview).toBe("read");
		expect(result.categories[1]?.preview).toBeUndefined();
	});

	it("falls back to the estimate when pi reports no usage", () => {
		const result = toContextInspectorSnapshot({ ...snapshot, reported: undefined });
		expect(result.totalTokens).toBe(900);
		expect(result.contextWindow).toBe(0);
		expect(result.contextPercent).toBeNull();
	});
});
