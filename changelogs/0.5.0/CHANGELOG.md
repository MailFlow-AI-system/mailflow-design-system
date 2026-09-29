# 0.5.0

Add a shared Sonner toaster with Mailflow defaults and full per-application customization.

## Added

- `Toaster` and the Sonner `toast` API from `@mailflow/ui/components` and the package root. Call `toast`, `toast.success`, `toast.info`, `toast.warning`, `toast.error`, `toast.loading`, `toast.promise`, or `toast.custom` after mounting one `Toaster` in the application shell.
- Mailflow surface, typography, radius, shadow, status icons and semantic status accents for light and dark palettes. Normal, success, info, warning and error status styles are covered.
- Public `ToasterProps`, `ExternalToast` and `ToastClassnames` types, with Sonner props, per-toast options, icons, actions and custom rendering available to consumers.

## SemVer impact

Minor feature under the repository's pre-1.0 policy. Existing components and defaults remain unchanged. `sonner` 2.0.7 is a new package dependency.

## Migration guidance

After the `v0.5.0` tag and GitHub Release exist, update the consumer's exact Git tag pin. Import `Toaster` and `toast` from `@mailflow/ui/components`, mount one `Toaster` in the root shell and call the needed status method from event or async error handling. The shared stylesheet supplies the default look; applications can override the Sonner props, CSS variables, `toastOptions`, per-toast options or use `toast.custom`.
