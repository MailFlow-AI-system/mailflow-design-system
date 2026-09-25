# MailFlow Design System

`@mailflow/ui` is a private, source-based React package for shared MailFlow design foundations: semantic colors, light and dark palettes, typography, spacing, radii, shadows, motion, Lucide icons, theme management, and reusable components. It is not published to a package registry.

The reference is the [MailFlow Prototype project](https://github.com/mateusmenesesDev/mailflow-ai-suite), including its landing page and inbox. Values were extracted from its source styles and component code. The violet palette, Inter typography, and component proportions are shared; layouts and business behavior belong to the consuming applications.

## Development

Use Node.js 24.20.0, as pinned in `.github/workflows/ci.yml`, and Bun from `package.json#packageManager`.

```sh
bun install --frozen-lockfile
bun run storybook
bun run check
```

Storybook runs on port 6006. `bun run build` produces `storybook-static/` without publishing it. `bun run check` runs Biome, formatting, TypeScript, behavior tests, and the catalog build.

## Package contract

This private source package ships React/TypeScript and CSS for TypeScript-aware Vite applications, without a generated JavaScript distribution or install-time build. One SemVer version in `package.json` covers the complete `@mailflow/ui` export surface, including every subpath and stylesheet. React, React DOM, and Tailwind CSS 4 are peer dependencies owned by the host.

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

For a released integration, install the exact Git tag after it exists:

```sh
bun add '@mailflow/ui@git+https://github.com/MailFlow-AI-system/mailflow-design-system.git#v0.1.0'
```

While a design-system change is still unreleased, a consumer feature branch may temporarily pin its full commit SHA to test the integration:

```sh
bun add '@mailflow/ui@git+https://github.com/MailFlow-AI-system/mailflow-design-system.git#<full-commit-sha>'
```

Before merging that consumer pull request, replace the SHA with the matching released `vX.Y.Z` tag and update its lockfile. If the tag has not been created, keep the consumer pull request open. New consumer integrations do not merge with a commit SHA as their final dependency pin. Existing SHA pins are migrated in separate tasks after the release; this policy does not change them in this repository. Do not pin a moving branch, local dependency, or development symlink. No registry credentials are required.

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

## Pull requests and delivery

`main` is the only long-lived branch. Feature branches start from `main` and pull requests target `main`. CI Required must pass before a pull request is ready; merging to `main` deploys Storybook through GitHub Pages.

Each pull request records its public-contract impact, proposed SemVer impact, and a short release note in the PR template. Update documentation, Storybook stories, and behavior tests when the affected public behavior requires them; explain when a check does not apply. A release PR may collect notes from several change PRs, but its version and changelog must be reviewed before merge.

The deployed Storybook follows the latest merged `main`; it is a live catalog, not a versioned release or snapshot. Release-specific notes are kept in `changelogs/<version>/CHANGELOG.md` and linked from the matching GitHub Release.

## Versioning and releases

The package declares `0.1.0` as its initial baseline. That version declaration alone does not constitute a release; `0.1.0` is formally released when the `v0.1.0` tag and matching GitHub Release exist.

Before `1.0.0`, the public API is not stable. Under this repository's `0.x` policy, fixes that do not change the public API increment the patch version; new capabilities increment the minor version. A minor version may include a breaking change before `1.0.0`, and the changelog must call it out clearly. Adopt `1.0.0` only after an explicit decision that the package has reached its stable/MVP boundary. From `1.0.0` onward, compatible fixes increment patch, compatible features increment minor, and breaking changes increment major.

For `0.1.0`, keep the initial baseline version in `package.json` and include `changelogs/0.1.0/CHANGELOG.md` in the pull request. For each later release, update `package.json#version` and add `changelogs/<version>/CHANGELOG.md` in the same pull request. Review the changelog as part of that pull request. After the approved commit merges to `main`, create the matching `v<version>` tag on that exact commit and publish a GitHub Release linking to its changelog. Tag creation is a separate step after merge: a tag is a Git reference separate from the `main` branch, so creating or pushing the tag does not require a push to `main`. The current repository workflow does not create release tags automatically.

Consumers learn about changes through the pull request, version changelog, and GitHub Release. Dependency installation does not provide a custom terminal notice or automatically migrate consumer pins; each consuming application reviews and updates its dependency separately.

When a consumer integrates a package change, validate it through real imports there: production builds, first theme paint, reload persistence, navigation, keyboard controls, label association, font loading, and absence of hydration errors. A Storybook build alone does not validate an application integration.

## Listening

A separate source package with exact Git tag pinning supports independently managed frontends without introducing a registry release process. Full commit SHAs remain available for temporary integration review before a release. A monorepo migration and generated JavaScript distribution would add work beyond the current scope.

Base UI supplies interactive primitives while shadcn supplies editable structure, keeping one MailFlow implementation per shared control. More components and product patterns can follow when screens require them.

The reference's destructive button failed WCAG AA normal-text contrast in browser checks: 4.29:1 in light mode and 3.83:1 in dark mode. Its OKLCH lightness is reduced to 0.58 in both palettes, retaining the source chroma and hue. The adjusted rendered variants pass the same Axe check; the remaining palette values retain the reference.

The package defaults to dark and supports light, dark, or system preference. A shared browser store allows independent Astro islands to observe the same selection; a synchronous bootstrap establishes the document palette before hydration. Preferences remain local to each origin. Cross-domain synchronization requires a separate product decision.
