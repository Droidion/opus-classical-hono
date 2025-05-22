const THEME_ATTRIBUTE = 'data-theme'
const STORAGE_KEY = 'theme'
const DARK = 'dark'
const LIGHT = 'light'
const MEDIA_PREFER_DARK = `(prefers-color-scheme: ${DARK})`

class ThemeSwitcher {
  #themeToggle
  #prefersDarkScheme
  #currentTheme

  constructor() {
    this.#themeToggle = document.getElementById('theme-toggle')
    this.#prefersDarkScheme = window.matchMedia(MEDIA_PREFER_DARK)
    this.#currentTheme = localStorage.getItem(STORAGE_KEY)
    this.init()
  }

  init() {
    this.#themeToggle?.addEventListener('change', () => this.switchTheme())
    this.#prefersDarkScheme?.addEventListener('change', e =>
      this.handleOSThemeChange(e))
    const currentTheme = document.documentElement.getAttribute(THEME_ATTRIBUTE)
    if (this.#themeToggle) {
      this.#themeToggle.checked = currentTheme === DARK
    }
  }

  switchTheme() {
    const newTheme = this.#themeToggle.checked ? DARK : LIGHT
    this.applyTheme(newTheme)
  }

  handleOSThemeChange({ matches }) {
    if (!this.#currentTheme) {
      this.applyTheme(matches ? DARK : LIGHT)
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme)
    localStorage.setItem(STORAGE_KEY, theme)
    this.#themeToggle.checked = theme === DARK
  }
}

document.addEventListener('DOMContentLoaded', () => new ThemeSwitcher())
