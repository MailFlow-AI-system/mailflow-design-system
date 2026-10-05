# 0.7.0

Add Badge, Avatar, and Tabs for shared email interfaces.

## Added

- `Badge`, `badgeVariants`, and `BadgeProps`, with `default`, `secondary`, `destructive`, and `outline` variants and Base UI `render` composition.
- `Avatar`, `AvatarImage`, and `AvatarFallback`, with public prop types, image loading and error fallbacks, and consumer-defined dimensions and colors.
- `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent`, with public prop types, controlled or uncontrolled selection, disabled tabs, and keyboard navigation.
- Storybook examples matching compact email labels, sender and sidebar avatars, and email tabs in both palettes.

## SemVer impact

Minor feature under the repository's pre-1.0 policy. Existing public APIs and foundation tokens remain unchanged.

## Public contract

The new components and their prop types are available from `@mailflow/ui/components` and the package root. Interactive behavior uses the existing Base UI dependency. Components accept `className` for the reference's compact email compositions; they contain no authentication, search, initials generation, or name-to-color rules.

## Migration guidance

After the `v0.7.0` tag and GitHub Release exist, update consumer applications to that exact tag and refresh their lockfile. Replace local avatar markup with `Avatar` and `AvatarFallback`, retaining application-owned initials and color selection. Badge data and Tabs filtering remain consumer responsibilities.

## Listening

Badge unblocks email labels and tags, while Avatar and Tabs have concrete references in the email mockup. Table was excluded because this MVP focuses on email pages. Avatar dimensions remain class-based composition instead of introducing a size API, and identity rules remain in the consuming application.
