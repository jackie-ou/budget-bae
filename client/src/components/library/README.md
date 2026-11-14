# Component library conventions

Every component in `client/src/components/library/` is built the same way, so any of them can be read and changed by anyone on the team. Read this before adding or editing a component. `Button` is the reference implementation; copy its shape.

## 1. File layout

One folder per component, in this folder, re-exported from `library/index.ts`:

```
library/
  Button/
    Button.tsx
    Button.module.css
    index.ts          // export * from "./Button"
  index.ts            // export * from "./Button"
```

- Folder and file names are PascalCase and match the component name.
- Each component folder has its own `index.ts` that re-exports the component and its types.
- Anything the component needs besides its `.tsx` and `.module.css` (sub-components, helpers) goes in the same folder.
- Add a line to `library/index.ts` for every new component. Import components from `@/components/library`, never from the component's folder or file directly.
- The Storybook story lives in `client/src/stories/<Component>.stories.tsx` (see [section 8](#8-storybook)).

## 2. Styling

- **CSS Modules**, one `<Component>.module.css` per component.
- **Wrap every rule in `@layer components`.** This lets Tailwind utilities passed through `className` (for example `hidden md:inline-flex`) override the component's layout.
- **Use design tokens only.** Colors, radii, shadows and fonts come from the tokens in `client/src/index.css` (`--primary`, `--ring`, `--radius`, `--shadow-soft`, `--font-sans`, and so on). Do not hardcode hex, rgb or oklch values, or font names.
- **Join class names with `clsx`.** Do not add `class-variance-authority` or `tailwind-merge`; layer order already decides who wins.
- **Hang variants and sizes off class names** that match the prop value, so `styles[variant]` and `styles[size]` just work.

```css
/* Thing.module.css */
@layer components {
  .thing {
    border-radius: var(--radius);
    background: var(--card);
    color: var(--foreground);
  }

  /* Variants: one class per `variant` value */
  .primary { background: var(--primary); color: var(--primary-foreground); }

  /* Sizes: one class per `size` value */
  .sm { --icon-size: 1rem; }
  .md { --icon-size: 1rem; }
  .lg { --icon-size: 1.25rem; }
}
```

```tsx
className={clsx(styles.thing, styles[variant], styles[size], className)}
```

Always put the caller's `className` **last** in `clsx`.

## 3. Prop naming

Use these names for the same ideas in every component. Do not invent synonyms (`kind`, `color`, `isDisabled`).

| Prop | Meaning | Values |
| --- | --- | --- |
| `variant` | Visual style | Component-specific, e.g. `primary`, `secondary`, `outline`, `ghost` |
| `size` | Scale | `sm` \| `md` \| `lg` (default `md`) |
| `tone` | Semantic color | `success`, `warning`, `danger` (map to the `--success`, `--warning`, `--danger` tokens) |
| `disabled` | Not interactive | boolean |
| `loading` | Busy, waiting on something | boolean |
| `invalid` | Value fails validation | boolean |

- `variant` and `tone` are independent: `variant` is how it looks, `tone` is what it means.
- Only add the props a component needs. A component without a loading state has no `loading` prop.
- Export the prop value types (`ButtonVariant`, `ButtonSize`) so stories and callers can reuse them.
- State props should also set the matching ARIA attribute: `invalid` sets `aria-invalid`, `loading` sets `aria-busy`.

## 4. Required component shape

Every component must:

1. **Spread the remaining native props** onto the root element.
2. **Accept `className`** and merge it last (see [section 2](#2-styling)).
3. **Forward `ref`.** React 19 passes `ref` as a normal prop, so do not use `forwardRef`. Typing props with `React.ComponentProps<"element">` includes `ref`, and `...props` forwards it.
4. Use a **named function** and a **named export** (`export { Thing }`), not a default export.

```tsx
import * as React from "react"
import { clsx } from "clsx"

import styles from "./Thing.module.css"

export type ThingVariant = "primary" | "secondary"
export type ThingSize = "sm" | "md" | "lg"

export type ThingProps = React.ComponentProps<"div"> & {
  variant?: ThingVariant
  size?: ThingSize
}

function Thing({ className, variant = "primary", size = "md", ...props }: ThingProps) {
  return (
    <div
      className={clsx(styles.thing, styles[variant], styles[size], className)}
      {...props}
    />
  )
}

export { Thing }
```

Set sensible defaults for anything that would otherwise surprise the caller (for example `Button` defaults `type="button"` so it never submits a form by accident).

## 5. Icons

- Icons come from `lucide-react`. Do not add another icon set.
- Use the standard sizes only:

| Size | Pixels | Typical use |
| --- | --- | --- |
| Small | 16px (`1rem`) | `sm` and `md` components |
| Medium | 20px (`1.25rem`) | `lg` components |
| Large | 24px (`1.5rem`) | Large icon-only controls |

- Set the size through the `--icon-size` custom property on the component's size class, and size the `svg` from it. Do not set `width`/`height` on individual icons.
- Decorative icons get `aria-hidden="true"`. Icon-only controls need an accessible name (see below).

## 6. Accessibility checklist

Every component ticket must meet all of these before it is merged:

- [ ] **Semantic HTML first.** Use the native element (`button`, `a`, `input`, `label`, `ul`) before reaching for `div` plus ARIA.
- [ ] **Visible focus ring** on `:focus-visible`, using `--ring`:
  ```css
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring);
  }
  ```
- [ ] **Labels for icon-only controls.** Require `aria-label` in the prop types so it cannot be forgotten.
- [ ] **Keyboard only.** Everything works with Tab, Shift+Tab, Enter, Space and Escape as appropriate, with no mouse.
- [ ] **State is announced.** `disabled`, `invalid` and `loading` map to the native attribute or the matching `aria-*` attribute.
- [ ] **Color is not the only signal.** A `tone` should also be conveyed by text or an icon.

## 7. Documenting props

- Add a short TSDoc comment to any prop whose meaning is not obvious from its name.
- Use TypeScript to make invalid combinations impossible. For example, `Button` requires `aria-label` whenever `icon` is set, and forbids `children` in that case.

## 8. Storybook

- Every component ships with a story at `client/src/stories/<Component>.stories.tsx`, titled `Library/<Component>`.
- Provide `argTypes` controls for `variant` and `size`, plus one story per variant and one for each state (`disabled`, `loading`, `invalid`) the component supports.
- The **a11y addon must pass** with no violations.

## 9. Commits

Follow the conventions in `CLAUDE.md`. The scope is the component name in kebab-case:

```
feat(button): add icon-only variant with required aria-label
fix(expense-list): show empty state when month has no expenses
```

## 10. New component checklist

1. Create a `<Component>/` folder here with `<Component>.tsx`, `<Component>.module.css` and an `index.ts`.
2. Wrap all CSS in `@layer components`, using tokens only.
3. Use the standard prop names, spread native props, accept `className`, forward `ref`.
4. Export from the component's `index.ts` and from `library/index.ts`.
5. Meet the accessibility checklist.
6. Add the Storybook story and confirm the a11y addon passes.
7. Commit with the component name as the scope.