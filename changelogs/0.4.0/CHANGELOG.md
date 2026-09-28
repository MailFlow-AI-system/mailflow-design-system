# 0.4.0

Add persistent, accessible workspace primitives for composing a future Email Composer independently of the Application Shell.

## Added

- `Window`, `WindowBody`, `WindowClose`, `WindowContent`, `WindowDescription`, `WindowHeader`, `WindowMaximize`, `WindowMinimize`, `WindowMinimized`, `WindowRestore`, `WindowTitle`, and `WindowTrigger` with public props/state/event types.
- Controlled or uncontrolled logical open and size state. Modal normal/maximized surfaces, a nonmodal minimized region, and unchanged mounted contents across size transitions.
- Cancellable close requests through `WindowOpenChangeDetails.cancel()`. Dirty detection, confirmation policy and data reset remain consumer responsibilities.
- `Toolbar`, `ToolbarButton`, and `ToolbarSeparator` with public props types, arrow navigation, roving Tab behavior and Home/End button navigation.
- `AlertDialog`, `AlertDialogClose`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogTitle`, and `AlertDialogTrigger` with public props types for consumer-owned confirmations.
- Exact Lucide exports: `Bold`, `Image`, `Italic`, `Languages`, `Link2`, `List`, `ListOrdered`, `Maximize2`, `Minimize2`, `Minus`, `Save`, `ScanText`, `Smile`, `SpellCheck`, `SquarePen`, and `Underline`.
- Stories for closed, normal, minimized, maximized, close confirmation, optional-panel composition, toolbar and standalone alert dialog; behavior tests for state, content/selection preservation, close interception, focus and keyboard behavior.
- README public contract, composition example, confirmed Lovable observations, proposed behavior and complete icon mapping.

## SemVer impact

Minor feature under the repository's pre-1.0 policy. Existing components, variants, tokens and exports retain their defaults. No dependencies or peer requirements change.

## Accessibility and compatibility

Normal/maximized Window is modal, uses Base UI focus/scroll management and ignores outside pointer dismissal. Minimized Window is a named nonmodal section with a restore control. Titles, descriptions, visible focus and named icon buttons are required in composition. Escape and all close controls request the same cancellable logical close. Toolbar requires an accessible name; consumers own button names, pressed state and actions. AlertDialog supplies a separate focus scope and allows consumers to select the least destructive initial focus.

## Migration guidance

Opt-in only. Adopt the exact `v0.4.0` Git tag after approval, merge, tag publication and matching GitHub Release. Import components/types from `@mailflow/ui/components` and icons from `@mailflow/ui/icons`; both are also exported at the package root. Compose optional sections in the consuming application. Keep WindowContent mounted to retain values during resizing and own persistence/reset across unmounts in the feature. No mailflow-web changes are included.

## Reference limits

The inspected Lovable surface is modal. Normal desktop geometry and both palettes were confirmed, as was the mobile panel hiding. No working minimized surface, maximize control or dirty-close confirmation was available as a verified reference. These behaviors are task-driven additions. The example uses a native textarea and local demonstration state, not a rich email editor, backend draft store, sending or AI implementation. Dragging is not included.

## Validation

Validation results are recorded in the prepared PR description and handoff. Required checks include `bun install --frozen-lockfile`, `bun run check`, release metadata, package dry-run and browser checks for both palettes, keyboard, responsive sizes and accessibility.
