# 0.9.0

Add a shared label picker for email interfaces.

## Added

- `LabelPicker` combines label search, selection, and creation in one combobox. It requests additional results through scrolling or keyboard navigation.
- The picker offers creation after the consumer confirms that the current name has no exact match in the catalog. A failed create request keeps the search available for retry.
- Storybook demonstrates pagination across multiple pages and creation recovery.

## SemVer impact

Minor feature under the repository's pre-1.0 policy.

## Public contract

`LabelPicker`, `LabelPickerItem`, `LabelPickerProps`, and `LabelPickerResults` are available from the package root and `@mailflow/ui/components`. Consumers supply search results, pagination state, exact-match confirmation, and the asynchronous creation callback.

## Listening

The reference inbox displays applied labels as badges and includes a tag action. The picker adopts its compact scale and semantic colors. The Base UI combobox handles focus and keyboard interaction. The consumer keeps the catalog and its cursor because those depend on the data source.
