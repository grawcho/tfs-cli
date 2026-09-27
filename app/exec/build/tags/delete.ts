import buildTagBase = require("./default");
import trace = require("../../../lib/trace");

export function describe(): string {
	return "delete tag(s) from a build";
}

export function getCommand(args: string[]): BuildTagDelete {
	return new BuildTagDelete(args);
}

export class BuildTagDelete extends buildTagBase.BuildTagBase<string[]> {
	protected serverCommand = true;
	protected description = "Delete tag(s) from a build.";

	protected getHelpArgs(): string[] {
		return ["project", "buildId", "tags"];
	}

	public async exec(): Promise<string[]> {
		trace.debug("build-tags-delete.exec");

		const api = await this.webApi.getBuildApi();
		const project = await this.commandArgs.project.val();
		const buildId = await this.commandArgs.buildId.val();
		const tags = await this.commandArgs.tags.val();

		if (!tags || tags.length === 0) {
			throw new Error("You must supply at least one tag via --tags.");
		}

		// deleteBuildTag removes a single tag and returns the remaining set. Run sequentially
		// rather than in parallel: concurrent deletes race on the same build's tag list.
		let remaining: string[] = [];
		for (const tag of tags) {
			trace.info("Removing tag '%s' from build %s...", tag, buildId);
			remaining = await api.deleteBuildTag(project, buildId, tag);
		}

		return remaining;
	}

	public friendlyOutput(tags: string[]): void {
		trace.println();
		trace.info("Build now has the following tags:");
		if (!tags || tags.length === 0) {
			trace.info("(none)");
			return;
		}
		// "%s" rather than passing the tag as the format string: tags may contain % sequences.
		tags.forEach(tag => trace.info("%s", tag));
	}
}
