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

Install the exact Git tag after the design-system release exists:

```sh
bun add '@mailflow/ui@git+https://github.com/MailFlow-AI-system/mailflow-design-system.git#v0.1.0'
```

For new shared UI, finish and review the design-system pull request first. After it merges, create its tag and GitHub Release. Then integrate the released component in the consumer application, pin the exact tag in its manifest and lockfile, and validate that application's behavior before merging its pull request. A design-system commit on `main` is not a release until the tag and GitHub Release exist.

New consumer integrations use release tags, not commit SHAs. Existing SHA pins are migrated in separate tasks after a release; this repository does not change them. Do not pin a moving branch, local dependency, or development symlink. No registry credentials are required.

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

### Email primitives (0.7.0)

`Badge`, `Avatar`, and `Tabs` are exported with their prop types from both the package root and `@mailflow/ui/components`.

| Component | Public contract | Email reference |
| --- | --- | --- |
| `Badge`, `badgeVariants`, `BadgeProps` | `default`, `secondary`, `destructive`, or `outline`; native span props, ref, `className`, and Base UI `render` composition. Passive by default; links and buttons retain their own semantics. | Secondary list labels use 16px height, 9px text and normal weight. Reader labels use 10px text. |
| `Avatar`, `AvatarImage`, `AvatarFallback` | Styled Base UI avatar parts and corresponding `*Props` types. Images have native `src`/`alt` props; fallback children appear when no image is supplied or loading fails. | Compose `className` for 24px workspace, 28px sidebar user, 36px sender, or 40px reader avatars. |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Styled Base UI tabs parts and corresponding `*Props` types. Selection may be controlled or uncontrolled; disabled state, orientation, keyboard navigation, and tab/panel associations belong to Base UI. | Compose a transparent 32px list with 28px triggers and 12px text for compact email tabs. |

Avatar initials, identity colors, Badge labels, and Tabs filtering belong to the consumer. The components contain no email, routing, or authentication rules. Use an empty image `alt` or `aria-hidden` for an avatar that repeats an adjacent person's name; otherwise supply a useful accessible name.

```tsx
import { Avatar, AvatarFallback, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@mailflow/ui/components'

<Avatar className="size-9">
  <AvatarFallback className="bg-primary/15 text-[11px] text-violet-700 dark:text-violet-300">AL</AvatarFallback>
</Avatar>
<Badge variant="secondary" className="h-4 px-1.5 text-[9px] font-normal">Work</Badge>
<Tabs defaultValue="all">
  <TabsList aria-label="Email views" className="h-8 bg-transparent p-0">
    <TabsTrigger value="all" className="h-7 text-xs">Inbox</TabsTrigger>
    <TabsTrigger value="unread" className="h-7 text-xs">Unread</TabsTrigger>
  </TabsList>
  <TabsContent value="all">All messages</TabsContent>
  <TabsContent value="unread">Unread messages</TabsContent>
</Tabs>
```

`AvatarImage` supports Base UI's `keepMounted` option. Image and fallback share the same box; a loading or failed mounted image stays hidden while the fallback remains visible.

Storybook demonstrates compact labels, image and fallback states, reference avatar dimensions, and controlled, disabled, and vertical tabs. Its theme control previews each example in both palettes. These examples are visual compositions, not an email feature implementation.

### Toast notifications

Mount one `Toaster` near the application root and call the exported `toast` API from feature code:

```tsx
import { Toaster, toast } from '@mailflow/ui/components'

function App() {
  return <><Toaster /><button onClick={() => toast.error('Unable to sign out')}>Sign out</button></>
}
```

The default presentation uses Mailflow's existing surface, typography, radius, shadow and semantic success, primary/info, warning and destructive/error colors in light and dark palettes. `toast()` and `toast.success`, `toast.info`, `toast.warning`, `toast.error`, `toast.loading`, `toast.promise`, and `toast.custom` are available. `Toaster` accepts Sonner's full prop surface (`position`, `closeButton`, `icons`, `style`, `toastOptions`, and so on), and each toast accepts Sonner's options. Override `--mailflow-toast-success`, `--mailflow-toast-info`, `--mailflow-toast-warning`, or `--mailflow-toast-error` on the toaster for status accents, or use custom classes and `toast.custom` for an entirely different rendering. Applications own notification text and when to show it.

```tsx
import { Button, Input } from '@mailflow/ui/components'
import { ArrowRight } from '@mailflow/ui/icons'

<Button variant="default" size="lg">Continue <ArrowRight aria-hidden="true" /></Button>
<Button nativeButton={false} render={<a href="/app" />} variant="outline">Open app</Button>
<label htmlFor="email">Email address</label>
<Input id="email" type="email" />
```

Button variants are `default`, `secondary`, `outline`, `ghost`, `destructive`, and `link`. Sizes are `sm` (32px), `default` (36px), `lg` (40px), and `icon` (36px square). Use an accessible name for icon-only controls and hide decorative icons from assistive technology. Base UI's `render` composition replaces Radix's `asChild`; set `nativeButton={false}` for anchors or router links. `Input` wraps a native input and accepts its standard HTML props. Use native `label` and `htmlFor` for field association; the package does not export a Label component.

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

This repository owns the shadcn source and uses Base UI primitives. `components.json` configures the style, variables, icons, and generation paths. Generate future components here, adapt them to MailFlow, and export them through `@mailflow/ui/components`. Form controls use their native HTML elements when they need no additional interaction behavior; field labels stay native HTML.

The `@/*` TypeScript paths support shadcn authoring. Replace generated internal `@/` imports with relative imports before exposing a component: consumers must not inherit these aliases. `src/lib/utils.ts` supplies the `cn` adapter. Review generated changes before overwriting customized files.

Every export needs documentation, a Storybook example, and behavior tests for state or interaction. Keep routing, authentication, APIs, analytics, and layouts in the applications. Preserve `THIRD_PARTY_NOTICES.md`.

## Pull requests and delivery

`main` is the only long-lived branch. Feature branches start from `main` and pull requests target `main`. CI Required must pass before a pull request is ready; merging to `main` deploys Storybook through GitHub Pages.

Each pull request records its public-contract impact, proposed SemVer impact, and a short release note in the PR template. A pull request that changes public package behavior, including components, variants, tokens, styles, or themes, includes the library version and matching changelog for that release, alongside the affected documentation, Storybook stories, and behavior tests. Review these together before merging to `main`; explain when a check does not apply. Changes with no package release impact may keep the current version and omit a new changelog.

The deployed Storybook follows the latest merged `main`; it is a live catalog, not a versioned release or snapshot. Release-specific notes are kept in `changelogs/<version>/CHANGELOG.md` and linked from the matching GitHub Release.

## Versioning and releases

The package declares `0.1.0` as its initial baseline. That version declaration alone does not constitute a release; `0.1.0` is formally released when the `v0.1.0` tag and matching GitHub Release exist.

Before `1.0.0`, the public API is not stable. Under this repository's `0.x` policy, fixes that do not change the public API increment the patch version; new capabilities increment the minor version. A minor version may include a breaking change before `1.0.0`, and the changelog must call it out clearly. Adopt `1.0.0` only after an explicit decision that the package has reached its stable/MVP boundary. From `1.0.0` onward, compatible fixes increment patch, compatible features increment minor, and breaking changes increment major.

For `0.1.0`, keep the initial baseline version in `package.json` and include `changelogs/0.1.0/CHANGELOG.md` in the pull request. For each later release, update `package.json#version` and add `changelogs/<version>/CHANGELOG.md` in the same design-system pull request as the package change. Review the changelog before merge. After the approved commit merges to `main`, create the matching `v<version>` tag on that exact commit and publish a GitHub Release linking to its changelog. Tag creation is a separate step after merge: a tag is a Git reference separate from the `main` branch, so creating or pushing the tag does not require a push to `main`. The current repository workflow does not create release tags automatically. Consumer integration begins after this release step.

Consumers learn about changes through the pull request, version changelog, and GitHub Release. Dependency installation does not provide a custom terminal notice or automatically migrate consumer pins; each consuming application reviews and updates its dependency separately.

When a consumer integrates a package change, validate it through real imports there: production builds, first theme paint, reload persistence, navigation, keyboard controls, label association, font loading, and absence of hydration errors. A Storybook build alone does not validate an application integration.

## Listening

Sprint 03 adds Badge, Avatar, and Tabs from concrete email references instead of extending the catalog with Table or an invented RBAC screen. Avatar remains a generic image/fallback primitive; applications own initials and deterministic identity colors. The catalog retains the reference's saturated avatar backgrounds and uses darker text in light mode for readable initials. Email sizes remain `className` compositions, avoiding additional size and product-state APIs.

A separate source package with exact Git tag pinning supports independently managed frontends without introducing a registry release process. Releasing the design system before consumer integration keeps the reviewed package contract and application dependency aligned. A monorepo migration and generated JavaScript distribution would add work beyond the current scope.

Base UI supplies interactive primitives while shadcn supplies editable structure, keeping one MailFlow implementation per shared control. More components and product patterns can follow when screens require them.

`Input` is a native `<input>` styled with the shared semantic tokens, preserving browser form, keyboard, disabled, and ARIA behavior. Native `<label>` remains the field association API; a Base UI wrapper or Label abstraction would add no behavior here. Consumer integration follows the approved `0.3.0` release.

The reference's destructive button failed WCAG AA normal-text contrast in browser checks: 4.29:1 in light mode and 3.83:1 in dark mode. Its OKLCH lightness is reduced to 0.58 in both palettes, retaining the source chroma and hue. The adjusted rendered variants pass the same Axe check; the remaining palette values retain the reference.

The package defaults to dark and supports light, dark, or system preference. A shared browser store allows independent Astro islands to observe the same selection; a synchronous bootstrap establishes the document palette before hydration. Preferences remain local to each origin. Cross-domain synchronization requires a separate product decision.

## Persistent workspace windows (0.4.0)

`Window` is a generic modal workspace independent of Sidebar and the application shell. Compose its optional controls, body, toolbar, and auxiliary panels in the consuming feature. It contains no recipient, subject, editor, draft, authentication, sending, or AI rules.

| Export | Public contract |
| --- | --- |
| `Window` / `WindowProps` | `open`, `defaultOpen` (false), `onOpenChange(open, details)`; `state`, `defaultState` (normal), `onStateChange(state)`. Controlled and uncontrolled operation. |
| `WindowState` | `normal`, `minimized`, `maximized`. Logical open state is independent of size state. |
| `WindowOpenChangeDetails` | `reason` (Base UI Dialog reason) and `cancel()`. Consumers intercept close here and present confirmation when their data requires it. |
| `WindowTrigger` / `WindowTriggerProps` | Base UI trigger props, ref, and `render` composition; reopens or restores a minimized window. Use one trigger per window. |
| `WindowContent` / `WindowContentProps` | Base UI popup props including ref, `initialFocus`, `finalFocus`, and `className`. Persistent portal, modal focus management, centered 896px maximum width, viewport height cap, and maximized geometry. |
| `WindowHeader`, `WindowBody` | Native div attributes and `className`; header boundary and scrollable body. Place optional sections and footer actions inside the body. |
| `WindowTitle`, `WindowDescription` | Base UI title/description props and `className`; provide a title for every window and an optional useful description. |
| `WindowMinimize`, `WindowMaximize`, `WindowRestore` / `WindowControlProps` | Button props. Named default controls, replaceable children and accessible names. Maximize toggles normal/maximized; restore returns to the state preceding minimize. |
| `WindowMinimized` / `WindowMinimizedProps` | Native section attributes plus required `aria-label`; a nonmodal region at bottom right. Compose a `WindowRestore` here whenever minimizing is available, and optionally `WindowClose`. |
| `WindowClose` / `WindowCloseProps` | Base UI close props and `render`; requests cancellable logical close in every size state. |
| `Toolbar` / `ToolbarProps` | Base UI toolbar props with required `aria-label`; arrows, roving tab stop, Home/End for toolbar buttons, horizontal/vertical orientation and looping. |
| `ToolbarButton` / `ToolbarButtonProps` | Base UI toolbar button props and `render`. Consumers own `aria-label`, `aria-pressed`, and activation. Disabled controls remain discoverable by arrows by default; use `focusableWhenDisabled={false}` to skip them. |
| `ToolbarSeparator` / `ToolbarSeparatorProps` | Base UI separator props; defaults to the opposite of toolbar orientation. |
| `AlertDialog` / `AlertDialogProps` | Base UI alert dialog root, controlled or uncontrolled. No implicit confirmation policy. |
| `AlertDialogTrigger`, `AlertDialogClose` | Base UI trigger/close props and `render`, exported corresponding `*Props` types. The feature decides which close button confirms an action. |
| `AlertDialogContent`, `AlertDialogTitle`, `AlertDialogDescription` | Styled Base UI popup/title/description and corresponding `*Props` types. `initialFocus` and `finalFocus` configure the safe action and return target. |

All components and types above are available from `@mailflow/ui/components` and the package root. Icons are available from `@mailflow/ui/icons` and the root. No new Button/Input variant or dependency is required; existing contracts and defaults are preserved.

Normal and maximized windows trap Tab/Shift+Tab, lock page scroll, and make the outside page unavailable. Outside presses do not close a workspace. Escape and `WindowClose` both request a cancellable close. Minimized windows release the modal lock and move focus to `WindowRestore`; restoring normally returns to the last content focus unless the consumer supplies `initialFocus`. Closing returns to the trigger, including a minimized close. Toolbar controls form one Tab stop with arrow navigation and Home/End; consumers using editable inputs inside a toolbar retain native Home/End behavior. Default control labels are English; override `aria-label` for localization.

Size transitions preserve the same mounted content, native input values and selections, and child component state. Closing also keeps content mounted. The feature decides when to reset data (for example by changing a content key after an explicit discard), and owns persistence beyond a `Window` unmount or navigation. The minimized region is not a dialog or a focus trap.

```tsx
import { useRef, useState } from 'react'
import {
  AlertDialog, AlertDialogClose, AlertDialogContent, AlertDialogDescription,
  AlertDialogTitle, Button, Input, Window, WindowBody, WindowClose,
  WindowContent, WindowHeader, WindowMaximize, WindowMinimize,
  WindowMinimized, WindowRestore, WindowTitle, WindowTrigger,
} from '@mailflow/ui/components'

function Workspace() {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [value, setValue] = useState('') // feature-owned data and dirty policy
  const cancelRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  return (
    <Window open={open} onOpenChange={(next, details) => {
      if (!next && value !== '') {
        details.cancel()
        setConfirm(true)
      } else setOpen(next)
    }}>
      <WindowTrigger ref={triggerRef} render={<Button />}>Open workspace</WindowTrigger>
      <WindowContent>
        <WindowHeader>
          <WindowTitle>New message</WindowTitle>
          <div className="flex gap-1">
            <WindowMinimize /><WindowMaximize />
            <WindowClose render={<Button variant="ghost" />}>Close</WindowClose>
          </div>
        </WindowHeader>
        <WindowBody className="p-4">
          <label htmlFor="workspace-value">Subject</label>
          <Input id="workspace-value" value={value} onChange={e => setValue(e.target.value)} />
          {/* Feature-owned editor, toolbar actions, optional panel and footer */}
        </WindowBody>
      </WindowContent>
      <WindowMinimized aria-label="Minimized message">
        <WindowRestore>New message</WindowRestore>
        <WindowClose>Close</WindowClose>
      </WindowMinimized>
      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent initialFocus={cancelRef} finalFocus={() => open ? true : triggerRef.current}>
          <AlertDialogTitle>Close without saving?</AlertDialogTitle>
          <AlertDialogDescription>There are unsaved changes.</AlertDialogDescription>
          <AlertDialogClose render={<Button ref={cancelRef} variant="outline" />}>
            Continue editing
          </AlertDialogClose>
          <AlertDialogClose render={<Button variant="destructive" />}
            onClick={() => { setValue(''); setOpen(false) }}>
            Close without saving
          </AlertDialogClose>
        </AlertDialogContent>
      </AlertDialog>
    </Window>
  )
}
```

Keep the alert dialog within `Window` so Base UI coordinates the nested focus scopes. Use the least destructive action for `initialFocus`. When confirmation closes the parent, supply `finalFocus` pointing to the window trigger; when cancelling, allow the default to restore the requesting control. This avoids returning focus to a closed parent. Direct changes to controlled `open` are the feature's responsibility and intentionally bypass close requests; handle navigation and explicit discard there as well.

The Window stories show normal, closed, minimized, maximized, confirmation, and optional-panel compositions. Their textarea, field expansion, dirty detection, local save indicator, and AI panel belong to the examples. Sending, rich text commands, scheduling, attachment upload, storage, and AI execution are not implemented by those demonstrations. On narrow screens the example provides an additional IA button to access the optional panel.

### Lovable reference and icon mapping

Inspected the open compose at [Lovable inbox](https://id-preview--c481592e-bf4d-4e71-a3cc-24366319ec79.lovable.app/inbox) on 2026-09-28 through computer use in the integrated browser. Visual observations and rendered DOM confirm a centered modal with black 80% overlay, 896 × 571px desktop surface, 49px header, 520px content area, 220px optional assistant panel at `md`, 1px boundaries, 16px desktop radius, shadow-lg, Inter, 14px body/title and 12px labels. Header padding is 10px/16px; field inputs are 32px high; body has 16px padding plus an 8px editor inset; panel has 12px padding and 4px gaps. Both palettes match the existing semantic tokens. At 390 × 844px it is 390 × 571px, centered with square corners and no assistant panel.

Confirmed fields: Para, optional Cc/Bcc (expandable by keyboard), Assunto, and a contenteditable body. Controls: nine formatting/insert actions, Send, scheduling (Clock), Rascunho, save status, and eight AI actions. No formatting dropdown or scheduling menu was established during this inspection; only their entry controls are mapped. No email was sent, no draft was saved, no attachments or AI actions were invoked, and no existing typed content was edited. The initially observed inputs were empty and the editor contained its default prompt.

The minus control produced no minimized state when activated by keyboard. A pointer interaction dismissed the blank surface without a minimized region; this is not evidence of a working minimization contract. The redundant built-in Close icon overlaps the custom X in the reference. No maximize control was present. A blank close worked without confirmation; dirty-close confirmation and preservation of edited content in the reference were not verified. Window minimization/restoration, maximization/restoration, safe close confirmation, constrained small-height scrolling and the mobile assistant entry are additions required by this task, not confirmed reference visuals. DS examples improve labels, focus indicators, title/description association and the overlapping close control; they use a native textarea to demonstrate composition rather than introducing an email editor into the DS.

| Exact icon export | Function | Status |
| --- | --- | --- |
| `SquarePen` | Open compose | Added; matches the reference, unlike the existing Pencil/FilePenLine |
| `Minus` | Minimize | Added |
| `X` | Close | Reused |
| `Bold` | Bold text | Added |
| `Italic` | Italic text | Added |
| `Underline` | Underlined text | Added |
| `List` | Bulleted list | Added |
| `ListOrdered` | Numbered list | Added |
| `Link2` | Insert link | Added; reference uses Link2, not existing Link |
| `Image` | Insert image | Added |
| `Smile` | Insert emoji | Added |
| `Paperclip` | Attach file | Reused |
| `Send` | Send | Reused |
| `Clock` | Schedule | Reused |
| `Save` | Draft action | Added |
| `Sparkles` | Assistant heading, persuasive rewrite, CTA | Reused |
| `WandSparkles` | Write email, generate subject | Reused |
| `ScanText` | Improve text, summarize | Added |
| `SpellCheck` | Correct grammar | Added |
| `Languages` | Translate | Added |
| `Maximize2` | Maximize, restore minimized window | Added for new required behavior; absent from reference |
| `Minimize2` | Restore normal size | Added for new required behavior; absent from reference |

Every added icon is a named re-export of the exact `lucide-react` symbol, with no drawing substitutions.
