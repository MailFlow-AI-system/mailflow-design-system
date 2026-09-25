# 0.1.0

Initial baseline of the private `@mailflow/ui` source package.

## Added

- Exported a shared TypeScript and CSS package with root, components, icons, theme, theme-script, tokens, and styles entry points.
- Added `Button`, `Accordion`, `DropdownMenu`, and `Sheet` components, with Base UI primitives and component-specific types.
- Added an explicit set of Lucide icon exports.
- Added semantic light and dark design tokens, Tailwind CSS 4 mappings, self-hosted Inter fonts, and reduced-motion styles.
- Added a synchronous theme bootstrap and a React provider/hook for light, dark, and system themes, including same-origin storage synchronization.
- Added Storybook stories for foundations, themes, and the shared components.

## Compatibility

This is a `0.x` API baseline and follows the repository's pre-`1.0.0` versioning policy. The package remains private. Consumers may adopt the matching version tag through separate migration work.
