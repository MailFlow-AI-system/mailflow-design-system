# 0.8.0

Add Checkbox for selecting items in shared email interfaces.

## Added

- `Checkbox` and `CheckboxProps`, a styled Base UI checkbox with controlled or uncontrolled state, `indeterminate` (mixed) state, disabled state, native label association through `id` and `htmlFor`, ref forwarding, `className`, and keyboard activation with Space.
- Storybook examples for the unchecked, checked, indeterminate, and disabled states, a native label, and a message list with per-row selection and a "select all" control in both palettes.

## SemVer impact

Minor feature under the repository's pre-1.0 policy. Existing public APIs and foundation tokens remain unchanged.

## Public contract

`Checkbox` and `CheckboxProps` are available from `@mailflow/ui/components` and the package root. The component renders a Base UI checkbox (`role="checkbox"` with a hidden form input) and accepts the Base UI root props. It owns no selection, bulk-action, email, routing, or authentication rules; consumers hold the selected state and supply an accessible name through `aria-label` or a `<label>`.

## Migration guidance

After the `v0.8.0` tag and GitHub Release exist, update consumer applications to that exact tag and refresh their lockfile. Applications that need item selection use `Checkbox` instead of styling a native input or `DropdownMenuCheckboxItem`. Selected-row styling, counts, and select-all semantics remain consumer responsibilities.

## Reference limits

The Lovable prototype (`mailflow-ai-suite`) renders a checkbox only in the contacts table, without state. Its styling is reproduced exactly: 16px box, `rounded-sm`, 1px `primary` border with `shadow`, a `primary` fill and `primary-foreground` check when checked, a 1px `ring` focus indicator, and 50% opacity when disabled. The prototype's email list has no multi-selection; the highlighted row there marks the open message.

Not verified against the reference and added by this release: the `indeterminate` state (`primary` fill with a minus icon), required by a partially selected "select all". Row selection styling, checkbox placement within a message row, and any selection toolbar are consumer compositions with no reference.

## Listening

Only the Checkbox is added because the reference defines no selection bar or selected-row treatment; the bar is composed in the application from existing `Toolbar` and `Button` parts. The selected-row tint deliberately stays separate from the prototype's active-row treatment (a tinted row with a `primary` left border), which is reserved for the message open in a reader. The control keeps Base UI's hidden input so forms and label clicks work natively.
