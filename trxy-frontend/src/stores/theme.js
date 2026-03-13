import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref('light')

  function init() {
    const saved = localStorage.getItem('trxy-theme')
    if (saved === 'dark' || saved === 'light') {
      theme.value = saved
    }
    apply()
  }

  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('trxy-theme', theme.value)
    apply()
  }

  function setTheme(value) {
    theme.value = value
    localStorage.setItem('trxy-theme', value)
    apply()
  }

  function apply() {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  return { theme, init, toggle, setTheme }
})
