import args = require("../../../lib/arguments");
import buildBase = require("../default");

export interface BuildTagArguments extends buildBase.BuildArguments {
	tags: args.ArrayArgument;
}

export function getCommand(args: string[]): BuildTagBase<void> {
	return new BuildTagBase<void>(args);
}

export class BuildTagBase<T> extends buildBase.BuildBase<BuildTagArguments, T> {
	protected description = "Commands for managing Build Tags.";
	protected serverCommand = false;

	protected setCommandArgs(): void {
		super.setCommandArgs();

		this.registerCommandArgument(
			"tags",
			"Build Tag(s)",
			"Comma-separated list of build tags. Note: tags containing a comma cannot be expressed.",
			args.ArrayArgument,
			null,
		);
	}

	public exec(cmd?: any): Promise<any> {
		return this.getHelp(cmd);
	}
}
