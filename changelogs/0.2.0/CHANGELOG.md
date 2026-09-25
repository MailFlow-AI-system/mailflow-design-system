# 0.2.0

Add the shared application-shell primitives required by MailFlow consumers.

## Added

- Added `Select` and its grouped, item, trigger, value, and scroll controls.
- Added reusable `Sidebar` primitives for desktop, mobile, off-canvas, icon-collapse, groups, menus, actions, and footer content.
- Added `SheetContent variant="sidebar"` for the mobile application shell while preserving the default `Sheet` variant.
- Added public component types and exports through `@mailflow/ui/components`.
- Added Storybook examples and behavior tests for the new controls and sidebar states.

## SemVer impact

Minor feature under the repository's pre-`1.0.0` policy. The release adds public exports and props without changing the default `Sheet` behavior.

## Accessibility and compatibility

The primitives preserve semantic buttons, links, dialog labeling, keyboard navigation, focus handling, and responsive behavior from the source implementations in `mailflow-web`. Existing consumers of the `0.1.0` exports remain compatible.

## Migration guidance

Consumers can adopt the released tag and import the new primitives from `@mailflow/ui/components`. The application remains responsible for composing product-specific navigation and layout. Consumers using the mobile sidebar should opt into `SheetContent variant="sidebar"`; the default `SheetContent` remains unchanged.

## Validation

- `bun run check`
- Storybook stories for `Select`, `Sidebar`, and default/sidebar `Sheet` variants
- Behavior tests for selection, keyboard closing, sidebar collapse, and public exports
