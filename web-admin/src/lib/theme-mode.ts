/** The header theme control: follow the system, or force light / dark.
 * Mirrors the public theme's copy of this file (clawcloud-theme
 * src/lib/theme-mode.ts); the two apps are separate bundles on the same
 * origin, so the logic is duplicated, not shared. */

export type ThemeMode = "auto" | "light" | "dark"

// The admin's own key. The public theme used to read this key too, but since
// clawcloud-theme 2.1.15 it keeps its mode under its own key
// ("clawcloud-theme"), so an admin visit no longer overwrites the status
// page's "auto". Old values ("light" / "dark") stay valid under this key,
// so a choice made before "auto" existed survives.
const KEY = "theme"

export const THEME_MODE_LABEL: Record<ThemeMode, string> = {
  auto: "跟随系统",
  light: "浅色",
  dark: "深色",
}

/**
 * The saved mode. Anything else — including a fresh install, an unknown
 * value, or storage switched off — follows the system.
 */
export function readThemeMode(storage: Storage = globalThis.localStorage): ThemeMode {
  try {
    const saved = storage.getItem(KEY)
    if (saved === "light" || saved === "dark" || saved === "auto") return saved
  } catch {
    // Storage switched off for the site: follow the system until the page
    // is closed.
  }
  return "auto"
}

export function saveThemeMode(mode: ThemeMode, storage: Storage = globalThis.localStorage): void {
  try {
    storage.setItem(KEY, mode)
  } catch {
    // The choice then lasts until the page is closed.
  }
}

/** Whether the page is dark for a mode, given the system's current preference. */
export function isDarkMode(mode: ThemeMode, systemDark: boolean): boolean {
  return mode === "dark" || (mode === "auto" && systemDark)
}

/** The button cycles auto -> light -> dark -> auto. */
export function nextThemeMode(mode: ThemeMode): ThemeMode {
  return mode === "auto" ? "light" : mode === "light" ? "dark" : "auto"
}
