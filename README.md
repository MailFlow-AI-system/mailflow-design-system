# MailFlow Design System

`@mailflow/ui` provides the shared foundation for `mailflow-web` and `mailflow-site`: semantic colors, light and dark palettes, typography, spacing, radii, shadows, motion, Lucide icons, theme management, and reusable components.

The reference is the [MailFlow Lovable project](https://lovable.dev/projects/c481592e-bf4d-4e71-a3cc-24366319ec79), including its landing page and inbox. Values were extracted from its source styles and component code. The violet palette, Inter typography, and component proportions are shared; layouts and business behavior belong to the consuming applications.

## Development

Use Node.js 24.20.0, as pinned in `.github/workflows/ci.yml`, and Bun from `package.json#packageManager`.

```sh
bun install --frozen-lockfile
bun run storybook
bun run check
```

Storybook runs on port 6006. `bun run build` produces `storybook-static/` without publishing it. `bun run check` runs Biome, formatting, TypeScript, behavior tests, and the catalog build.

## Package contract

This source package ships React/TypeScript and CSS for TypeScript-aware Vite applications, without a generated JavaScript distribution or install-time build. React, React DOM, and Tailwind CSS 4 are peer dependencies owned by the host.

| Import | Responsibility |
| --- | --- |
| `@mailflow/ui` | All JavaScript and TypeScript exports |
| `@mailflow/ui/components` | Shared components, variants, and component types |
| `@mailflow/ui/icons` | Named Lucide exports |
| `@mailflow/ui/theme` | Theme provider and hook |
| `@mailflow/ui/theme-script` | Synchronous browser theme bootstrap |
| `@mailflow/ui/tokens.css` | Framework-independent CSS variables |
| `@mailflow/ui/styles.css` | Fonts, tokens, Tailwind mappings, and base styles |

Import the required subpath. Do not copy shared components into an application or import unpublished source paths.

Install from a full, reviewed commit SHA:

```sh
bun add '@mailflow/ui@git+https://github.com/MailFlow-AI-system/mailflow-design-system.git#<full-commit-sha>'
```

Commit the manifest and `bun.lock`. Do not release a moving branch, local dependency, or development symlink. During coordinated review, consumers can pin the design-system feature commit; after its approved merge, update to the accepted `main` commit before merging consumers. No registry credentials are required.

## Styles and fonts

Import Tailwind once in the consumer stylesheet, followed by the shared styles:

```css
@import 'tailwindcss';
@import '@mailflow/ui/styles.css';
```

The shared stylesheet registers the package source for Tailwind scanning. Local layout CSS follows these imports and uses semantic variables or mapped utilities. `tokens.css` also works without React or Tailwind.

Inter is self-hosted through `@fontsource/inter`, with weights 400, 500, 600, and 700 and features `cv02`, `cv03`, `cv04`, and `cv11`. No Google Fonts request is needed. Use semantic HTML with typography utilities rather than a component for every heading or paragraph.

For server rendering, add `@mailflow/ui` to Vite's `ssr.noExternal` so the framework compiles its source. Applications own their Tailwind integration and runtime configuration. Astro can render Button statically; only interactive controls need hydration.

## Theme integration

Render `themeScript` from `@mailflow/ui/theme-script` as an inline script in the document head, before application rendering. In React use `dangerouslySetInnerHTML={{ __html: themeScript }}`; in Astro use `<script is:inline data-mailflow-theme set:html={themeScript} />`. The string is package-owned code, never user input. An application enforcing CSP must authorize this script through its existing nonce or hash policy.

The bootstrap reads `mailflow-theme`, accepts only `light`, `dark`, or `system`, and falls back to dark when storage is absent, invalid, or blocked. It sets the root's `dark` class, `data-theme`, and `color-scheme` before the first paint. Render a dark fallback on the server. In a React document, apply `suppressHydrationWarning` only to the `<html>` element whose theme attributes the bootstrap changes.

Wrap interactive theme consumers with `ThemeProvider`:

```tsx
import { ThemeProvider, useTheme } from '@mailflow/ui/theme'

function ThemeControl() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  return (
    <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current palette: {resolvedTheme}
    </button>
  )
}

export function ThemeIsland() {
  return <ThemeProvider><ThemeControl /></ThemeProvider>
}
```

Call `setTheme('system')` to follow the operating system. Explicit light or dark ignores system changes. The provider uses `useSyncExternalStore` subscription initialization rather than `useEffect`; its deterministic server snapshot keeps hydration consistent. Multiple providers share one browser store, allowing independent Astro islands to stay synchronized. Storage events synchronize tabs on the same origin. No preference is written merely by mounting a provider.

## Components and icons

```tsx
import { Button } from '@mailflow/ui/components'
import { ArrowRight } from '@mailflow/ui/icons'

<Button variant="default" size="lg">Continue <ArrowRight aria-hidden="true" /></Button>
<Button nativeButton={false} render={<a href="/app" />} variant="outline">Open app</Button>
<label htmlFor="email">Email address</label>
<input id="email" type="email" />
```

Button variants are `default`, `secondary`, `outline`, `ghost`, `destructive`, and `link`. Sizes are `sm` (32px), `default` (36px), `lg` (40px), and `icon` (36px square). Use an accessible name for icon-only controls and hide decorative icons from assistive technology. Base UI's `render` composition replaces Radix's `asChild`; set `nativeButton={false}` for anchors or router links. Use native `label` and `htmlFor` for field association. The package does not export Label or Input components.

## Foundation tokens

`src/styles/tokens.css` is the source of truth. `src/styles/styles.css` maps it to Tailwind. Colors use OKLCH; both palettes expose the same names.

| Family | Tokens |
| --- | --- |
| Page | `background`, `foreground` |
| Surfaces | `card`, `card-foreground`, `popover`, `popover-foreground` |
| Brand | `primary`, `primary-foreground` |
| Secondary | `secondary`, `secondary-foreground` |
| Muted | `muted`, `muted-foreground` |
| Accent | `accent`, `accent-foreground` |
| Feedback | `destructive`, `destructive-foreground`, `success`, `warning` |
| Boundaries | `border`, `input`, `ring` |
| Charts | `chart-1` through `chart-5` |
| Sidebar | `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring` |

Examples: `bg-background text-foreground`, `bg-primary text-primary-foreground`, `border-border`, or `var(--primary)` in ordinary CSS. Validate foreground/background contrast for the actual pairing and state.

| Scale | Values |
| --- | --- |
| Font size | micro 10px; xs 12px; sm 14px; base 16px; lg 18px; xl 20px; 2xl 24px; 3xl 30px; 4xl 36px; 5xl 48px; 6xl 60px; 7xl 72px |
| Font weight | normal 400; medium 500; semibold 600; bold 700 |
| Spacing | 4px base unit; Tailwind multiples: 1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px, 6 = 24px, 8 = 32px |
| Radius | xs 4px; sm 8px; md 10px; lg 12px; xl 16px; 2xl 20px; 3xl 24px |
| Shadow | xs, sm, md, lg, xl, 2xl |
| Motion | 150ms standard; cubic-bezier(0.4, 0, 0.2, 1); reduced-motion preference respected |

Storybook displays the foundation scales and both palettes alongside rendered controls.

## Adding shared UI

This repository owns the shadcn source and uses Base UI primitives. `components.json` configures the style, variables, icons, and generation paths. Generate future components here, adapt them to MailFlow, and export them through `@mailflow/ui/components`. Labels use native HTML when a shared abstraction adds no behavior.

The `@/*` TypeScript paths support shadcn authoring. Replace generated internal `@/` imports with relative imports before exposing a component: consumers must not inherit these aliases. `src/lib/utils.ts` supplies the `cn` adapter. Review generated changes before overwriting customized files.

Every export needs documentation, a Storybook example, and behavior tests for state or interaction. Keep routing, authentication, APIs, analytics, and layouts in the applications. Preserve `THIRD_PARTY_NOTICES.md`.

## Branches and delivery

`main` is the only long-lived branch. Feature branches start from `main` and pull requests target `main`. CI Required must pass before a pull request is ready; merging to `main` deploys Storybook through GitHub Pages.

Validate package changes through real imports in both consumers: production builds, first theme paint, reload persistence, navigation, keyboard controls, label association, font loading, and absence of hydration errors. A Storybook build alone does not validate these integrations.

## Listening

A separate source package pinned by Git SHA serves two independent frontends without introducing a registry release process. A monorepo migration and generated JavaScript distribution would add work beyond the current scope.

Base UI supplies interactive primitives while shadcn supplies editable structure, keeping one MailFlow implementation per shared control. More components and product patterns can follow when screens require them.

The reference's destructive button failed WCAG AA normal-text contrast in browser checks: 4.29:1 in light mode and 3.83:1 in dark mode. Its OKLCH lightness is reduced to 0.58 in both palettes, retaining the source chroma and hue. The adjusted rendered variants pass the same Axe check; the remaining palette values retain the reference.

Both applications default to dark and support light, dark, or system preference. A shared browser store allows independent Astro islands to observe the same selection; a synchronous bootstrap establishes the document palette before hydration. Preferences remain local to each origin. Cross-domain synchronization requires a separate product decision.
