import buildTagBase = require("./default");
import trace = require("../../../lib/trace");

export function describe(): string {
	return "get the tags on a build";
}

export function getCommand(args: string[]): BuildTagList {
	return new BuildTagList(args);
}

export class BuildTagList extends buildTagBase.BuildTagBase<string[]> {
	protected serverCommand = true;
	protected description = "Get the tags on a build.";

	protected getHelpArgs(): string[] {
		return ["project", "buildId"];
	}

	public async exec(): Promise<string[]> {
		trace.debug("build-tags-list.exec");

		const api = await this.webApi.getBuildApi();
		const project = await this.commandArgs.project.val();
		const buildId = await this.commandArgs.buildId.val();

		trace.debug("Getting tags for build %s...", buildId);
		return api.getBuildTags(project, buildId);
	}

	public friendlyOutput(tags: string[]): void {
		trace.println();
		if (!tags || tags.length === 0) {
			trace.info("This build has no tags.");
			return;
		}
		// "%s" rather than passing the tag as the format string: tags may contain % sequences.
		tags.forEach(tag => trace.info("%s", tag));
	}
}
