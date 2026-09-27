# Build Tags

You can list, add and delete build tags with tfx.

Build tags are free-form labels attached to a completed or in-progress build. They are commonly used
to mark builds for later querying — for example, recording that a particular artifact version has
already been deployed, so a later pipeline run can skip redundant work.

## List

Lists the tags currently on a build.

### Example
```bash
~$ tfx build tags list --project MyProject --build-id 182777723
Copyright Microsoft Corporation

onebranch_build_type_official
onebranch_release_PPE
dashboard-deployed-master-1.1.9763.39084
```

Combine with `--json` to consume the result from a script:

```bash
~$ tfx build tags list -p MyProject --build-id 182777723 --json | jq -r '.[]'
```

## Add

Adds one or more tags to a build. Existing tags are preserved. Adding a tag that is already present
is a no-op, so the command is safe to re-run.

### Example
```bash
~$ tfx build tags add --project MyProject --build-id 182777723 --tags "deployed-to-ppe"
Copyright Microsoft Corporation

Adding 1 tag(s) to build 182777723...

Build now has the following tags:
onebranch_release_PPE
deployed-to-ppe
```

Multiple tags are comma-separated:

```bash
~$ tfx build tags add -p MyProject --build-id 182777723 --tags "first-tag,second-tag"
```

> **Note:** because `--tags` is comma-separated, a tag whose text contains a comma cannot be
> expressed through this command.

## Delete

Removes one or more tags from a build. Tags are removed one at a time, in the order given, and the
remaining set is printed.

### Example
```bash
~$ tfx build tags delete --project MyProject --build-id 182777723 --tags "deployed-to-ppe"
Copyright Microsoft Corporation

Removing tag 'deployed-to-ppe' from build 182777723...

Build now has the following tags:
onebranch_release_PPE
```

## Permissions

Listing tags requires **Build (read)**. Adding and deleting tags require **Build (read & execute)**
on the project.
