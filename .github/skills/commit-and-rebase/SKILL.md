---
name: commit-and-rebase
description: "Use when asked to commit current changes, create a proper commit message, sync with the base branch, or rebase a feature branch before sharing it."
---

# Commit And Rebase

Follow this short workflow when the user asks to commit changes and rebase the current feature branch.

## Steps

1. Check `git status --short --branch`, the current branch, and recent commits. Find the base branch from `origin/HEAD`; fall back to `main` or `master`.
2. Review the diff and separate the user's intended files from unrelated or pre-existing changes. Do not stage everything automatically.
3. Group related files into logical commits. Each implementation commit should include its related tests and documentation, but never `changelog.md`. Keep changelog updates in their own commit.
4. Run the most relevant test, lint, or build command available in `package.json` or the README.
5. Propose the implementation commit and the separate changelog commit, list the exact files for each, and ask for confirmation.
6. After confirmation, stage only the approved implementation files and create the implementation commit. Then stage only `changelog.md` and create a separate changelog commit with the subject `docs: update changelog` and a concise body describing the documented changes, for example `Document the new commit-and-rebase and changelog workflow skills.`.
7. Fetch the base branch, show what will be rebased, and ask for confirmation before running `git rebase <base-ref>`.
8. Verify the final status and recent log. Report the commit, validation result, rebase result, and whether a force-with-lease push is needed.

## Rules

- Never discard work with `git reset --hard` or `git checkout --`.
- Never commit, rebase, amend, or push without confirmation.
- Stop on conflicts and let the user resolve them.
- If the current branch is the base branch, stop and ask the user to switch branches.
- Do not silently stash, include unrelated files, or force-push.
- Create one commit per logical change. Include the related implementation, tests, and documentation in that change's commit, but keep `changelog.md` separate.
- Do not place unrelated changes in the same commit.
- Keep changelog updates in a separate `docs: update changelog` commit, even when they describe another code change.
