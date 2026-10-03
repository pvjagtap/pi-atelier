import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineConfig } from "vitest/config";

const agentDir = mkdtempSync(join(tmpdir(), "pi-atelier-vitest-"));
process.once("exit", () => rmSync(agentDir, { recursive: true, force: true }));

export default defineConfig({
	test: {
		// Vendored pi-context-view suites use node:test; `npm run test:context-view` runs them.
		exclude: ["node_modules/**", "tests/context-view/**"],
		// Keep each run off the developer's real ~/.pi/agent configuration and away
		// from state left by earlier runs.
		env: {
			PI_CODING_AGENT_DIR: agentDir,
		},
	},
});
