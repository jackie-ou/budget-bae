# CLAUDE.md

## Commit messages

Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). The allowed types are listed in [CONTRIBUTING.md](CONTRIBUTING.md).

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

- **type**: `feat`, `fix`, `refactor`, `docs`, `build`, `test`, `ci`, or `chore`, in lowercase.
- **scope**: the name of the component being changed, in lowercase kebab-case, e.g. `button`, `expense-list`, `month-heading`, `add-expense-form`.
  - Changes that don't touch a component use the area instead: `deps`, `supabase`, `storybook`, `theme`.
  - If a commit touches several unrelated components, split it into one commit per component. If it can't be split, leave the scope out.
- **description**:
  - Use the imperative mood ("add", not "added" or "adds").
  - Start with a lowercase letter and don't end with a period.
  - Keep the header line to 72 characters or fewer.
- **body** (optional): leave a blank line after the header, then explain *what* changed and *why*, not how.
- **breaking changes**: put a `!` before the colon (`feat(button)!: rename variant prop`) and add a `BREAKING CHANGE: <details>` footer.
- **footers**: reference issues with `Refs: #30` or `Closes: #30`.

Examples:

```
feat(button): add icon-only variant with required aria-label
fix(expense-list): show empty state when month has no expenses
refactor(button): replace tailwind classes with css module
build(deps): add @fontsource-variable/fraunces
docs: add commit convention to CLAUDE.md
```
