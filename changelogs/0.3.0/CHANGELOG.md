# 0.3.0

Add a shared, accessible email and text input primitive for MailFlow consumers.

## Added

- Added `Input` and `InputProps` exports through `@mailflow/ui/components`, preserving native HTML input behavior and using shared semantic tokens.
- Added Storybook examples for standard, disabled, and invalid field states.
- Added behavior tests for native label association, typing, invalid state, and disabled input behavior.

## SemVer impact

Minor feature under the repository's pre-`1.0.0` policy. The release adds a public component and type without changing existing exports.

## Accessibility and compatibility

`Input` renders a native `<input>` and accepts standard input props, including `aria-*` attributes. Consumers associate a visible native `<label>` with `htmlFor` and the input's `id`.

## Migration guidance

Consumers can adopt the released tag and import `Input` from `@mailflow/ui/components`. Existing native inputs may remain unchanged; the component is opt-in.

## Validation

- `bun run check`
- Package dry-run verifies the component source and public entrypoint are included.
