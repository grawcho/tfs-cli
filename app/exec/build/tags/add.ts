import buildTagBase = require("./default");
import trace = require("../../../lib/trace");

export function describe(): string {
	return "add tag(s) to a build";
}

export function getCommand(args: string[]): BuildTagAdd {
	return new BuildTagAdd(args);
}

export class BuildTagAdd extends buildTagBase.BuildTagBase<string[]> {
	protected serverCommand = true;
	protected description = "Add tag(s) to a build.";

	protected getHelpArgs(): string[] {
		return ["project", "buildId", "tags"];
	}

	public async exec(): Promise<string[]> {
		trace.debug("build-tags-add.exec");

		const api = await this.webApi.getBuildApi();
		const project = await this.commandArgs.project.val();
		const buildId = await this.commandArgs.buildId.val();
		const tags = await this.commandArgs.tags.val();

		if (!tags || tags.length === 0) {
			throw new Error("You must supply at least one tag via --tags.");
		}

		trace.info("Adding %s tag(s) to build %s...", tags.length, buildId);

		// Note the argument order: addBuildTags takes (tags, project, buildId), which is
		// inconsistent with every other BuildApi tag method. Verified against
		// azure-devops-node-api BuildApi.d.ts.
		return api.addBuildTags(tags, project, buildId);
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
