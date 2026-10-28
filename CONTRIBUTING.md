# Contributing to GameVault

Thanks for helping improve GameVault. Bug fixes, accessibility improvements, documentation, tests, and new games are welcome.

## Before you start

- Browse the [open issues](https://github.com/Aaqibhafeezkhan/GameVault/issues) and look for `good first issue`, `help wanted`, or `up-for-grabs`.
- For a substantial change or a new game, open or comment on an issue first so we can agree on the approach.
- Keep changes focused. If possible, work on one issue per pull request.

## Set up locally

1. Install a current LTS version of Node.js and npm.
2. Fork the repository and clone your fork.
3. Install dependencies with `npm ci`.
4. Start the development server with `npm run dev`.
5. Create a production build with `npm run build`.

## Making a change

- Create a descriptive branch for your change.
- Follow the existing React, JavaScript, and styled-components patterns.
- Keep each game's implementation in its own folder under `src/games/` where practical, and update game metadata or routing when required.
- Avoid adding dependencies unless they solve a clear problem.
- Do not include unrelated formatting changes, generated build output, secrets, or personal data.
- For UI changes, consider keyboard use, mobile layouts, and reduced-motion preferences.

## Pull requests

- Open a pull request against `main` and link the related issue.
- Explain what changed and why, and include screenshots for visible UI changes when useful.
- Run `npm run build` and any relevant checks before opening the PR. Mention the checks you actually ran.
- Keep the PR small enough to review and respond constructively to feedback.

By contributing, you agree that your contributions will be released under the repository's [MIT License](LICENSE).
