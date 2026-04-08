---
name: frontend-skill
description: >-
  Builds production-grade React + TypeScript UIs with Tailwind CSS and shadcn/ui:
  layout, tokens, accessibility, and motion. Use when creating or refactoring
  components, pages, layouts, or design-system work; when the user mentions React,
  Tailwind, shadcn, or frontend polish.
---

# Frontend Development

Act as an expert frontend engineer and UI designer. When building any component, page, or interface, follow this process.

## Stack

- **React 18 + TypeScript**
- **Tailwind CSS 3.4.x** with CSS variables
- **shadcn/ui** from `@/components/ui/*`
- **lucide-react** for icons
- **Typography** — pick characterful fonts from Google Fonts (e.g. DM Sans, DM Mono, Geist, Sora). Do not default to Inter or Arial.

## Design thinking (before coding)

Define in one pass:

1. **Purpose** — What problem does this solve? Who uses it?
2. **Tone** — Commit to one: brutally minimal / luxury refined / editorial / soft pastel / industrial / playful / dark brutalist. Avoid vague in-between.
3. **One memorable detail** — What should the user remember about this UI?

## Code quality

### Styling

- Use CSS variables for colors: `--primary`, `--muted`, `--accent`, `--background` or `--bg`, `--border` (match project tokens if they exist).
- Tailwind for layout and spacing; `style` for dynamic or one-off branded values.
- Avoid generic patterns: purple gradients, `rounded-full` on everything, `text-center` everywhere.
- Dark mode: `dark:` variants and/or `[data-theme]` as the project does.

### Components

- Prefer composition — small focused components over monoliths.
- Type props with TypeScript interfaces (or `type` aliases consistent with the codebase).
- Use `useRef` + `useCallback` for scroll, drag, resize, or other hot paths.
- Clean up listeners and subscriptions in `useEffect` return functions.

### Animation and motion

- CSS transitions for hover and focus.
- Default micro-feedback: e.g. `transition-all duration-150` (adjust to match existing patterns).
- Complex orchestration: prefer **motion** (e.g. framer-motion) when the project already uses it.
- Prefer one coherent load or layout animation over many unrelated micro-animations.

### Accessibility

- Interactive controls must be keyboard-reachable; use real controls (`<button>`, `<a>`, inputs) with appropriate roles.
- Semantic HTML: `<button>`, `<label>`, `<nav>`, not `<div onClick>`.
- `aria-label` on icon-only buttons.
- Never remove focus outlines without an equivalent visible focus style.

## Component output format

When delivering a new or updated component, structure the reply like this:

1. **Purpose & tone** — One or two sentences (ties back to design thinking).
2. **Files** — List paths created or changed (e.g. `components/foo/Bar.tsx`).
3. **Implementation** — Main TSX in a fenced block:

```tsx
// Example shape — adapt names and imports to the repo

interface ThingProps {
  title: string;
  onAction?: () => void;
}

export function Thing({ title, onAction }: ThingProps) {
  return (
    <section className="...">
      {/* composition: small child components + shadcn primitives */}
    </section>
  );
}
```

4. **Notes** — Tokens used, a11y choices, and any follow-up (tests, Storybook, i18n) only if relevant.

Keep snippets focused: only the important structure and styling hooks, not boilerplate the project already has.

## Do not

- Introduce new UI libraries without aligning with the repo.
- Fight existing design tokens — extend them when possible.
- Ship inaccessible or keyboard-broken interactions for speed.
