export const themeScript = `(() => {
  const key = 'mailflow-theme'
  const valid = (value) => value === 'light' || value === 'dark' || value === 'system'
  let theme = 'dark'

  try {
    const stored = window.localStorage.getItem(key)
    if (valid(stored)) theme = stored
  } catch {}

  let resolved = theme === 'system' ? 'dark' : theme
  if (theme === 'system') {
    try {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } catch {}
  }

  const root = document.documentElement
  root.dataset.theme = resolved
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
})()`

export default themeScript
