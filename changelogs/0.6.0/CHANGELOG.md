# 0.6.0

Add composable Breadcrumb primitives for accessible hierarchical navigation.

## Added

- `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage` and `BreadcrumbSeparator` from `@mailflow/ui/components` and the package root.
- Semantic navigation markup with a `Breadcrumb` landmark, current-page state and presentation-only separators.
- `BreadcrumbLink` support for Base UI's `render` prop so consumers can keep framework-router link semantics while reusing the Design System styling.

## SemVer impact

Minor feature under the repository's pre-1.0 policy. Existing components and defaults remain unchanged.

## Public contract

The new Breadcrumb primitives and their public prop types are exported without changing existing component APIs, tokens or CSS contracts.

## Migration guidance

After the `v0.6.0` tag and GitHub Release exist, update consumer applications to the exact `v0.6.0` tag. Compose the primitives inside `Breadcrumb` and `BreadcrumbList`; use `BreadcrumbLink` with `render={<RouterLink />}` when the application uses client-side routing, and use `BreadcrumbPage` for the current location.
