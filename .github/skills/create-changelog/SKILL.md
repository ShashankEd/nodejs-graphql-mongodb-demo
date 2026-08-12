---
name: create-changelog
description: On request, create a changelog entry for code changes.
---

# Skill Instructions
Here you define step-by-step how ChatGPT should handle the task.

## Rules

- If `changelog.md` does not exist, create it in the repository root with a `# Changelog` heading.
- If `changelog.md` already exists, preserve all existing entries and append the new entry; never overwrite or recreate the file.
- Add each entry under the current date using this format:

	```md
	## YYYY-MM-DD

	- Description of the change.
	```

## Example

User: Create a changelog entry for the new user authentication feature

AI:

- Preserve the existing contents of `changelog.md`.
- Add or reuse the current date heading.
- Append the new entry under that date:

	```md
	- Added user authentication.
	```
