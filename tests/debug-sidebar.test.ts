import { describe, it } from "vitest";
import { renderSidebarLines, buildSidebarSnapshot } from "../src/sidebar.js";
import { DEFAULT_CONFIG } from "../src/config.js";
import { EMPTY_RUN_ACTIVITY } from "../src/run-activity.js";

const theme = {
	fg: (_role: string, text: string) => text,
	bold: (text: string) => text,
};

const state = {
	activity: "ready" as const,
	modelId: "gpt",
	provider: "openai",
	thinkingLevel: "medium",
	branch: "feature/sidebar",
	dirty: true,
	workspacePulse: {
		status: "changed" as const,
		data: {
			root: "/Users/example/projects/pi-atelier",
			relativeCwd: "",
			branch: "feature/sidebar",
			snapshot: {
				trackedFiles: 5,
				untrackedFiles: 2,
				linesAdded: 182,
				linesRemoved: 47,
				binaryFiles: 0,
				submodules: 0,
				conflicts: 0,
			},
		},
	},
	metrics: {
		usageAvailable: true,
		costAvailable: true,
		input: 50_000,
		output: 1_900,
		cacheRead: 100_000,
		cacheWrite: 0,
		cacheHitPercent: 96,
		cost: 0.479,
		subscription: true,
		contextTokens: 32_400,
		contextWindow: 400_000,
		contextPercent: 8.1,
		autoCompact: true,
	},
	extensionStatuses: [],
};

function snapshot() {
	return buildSidebarSnapshot({
		state: { ...state, extensionStatuses: ["tests passing"] },
		cwd: "/Users/example/projects/pi-atelier",
		sessionName: "Sidebar implementation",
		sessionFile: "/tmp/session.jsonl",
		branchEntryCount: 38,
		activeToolCount: 8,
		availableToolCount: 12,
		runActivity: EMPTY_RUN_ACTIVITY,
	});
}

describe("debug", () => {
	it("dump", () => {
		for (const h of [40, 36, 30]) {
			const lines = renderSidebarLines(snapshot(), DEFAULT_CONFIG, theme as never, 44, h, {
				colorEnabled: false,
			});
			console.log(`--- height ${h} ---`);
			console.log(lines.join("\n"));
		}
	});
});
