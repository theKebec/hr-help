import { defineStore } from 'pinia'

const STORAGE_KEY = 'hr-helper-settings'

const defaults = {
  apiKey: '',
  baseUrl: 'https://api.deepseek.com',
  model: 'deepseek-chat'
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaults }
    return { ...defaults, ...JSON.parse(raw) }
  } catch {
    return { ...defaults }
  }
}

export const useSettingsStore = defineStore('settings', {
  state: () => load(),
  actions: {
    update(patch) {
      Object.assign(this, patch)
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ apiKey: this.apiKey, baseUrl: this.baseUrl, model: this.model })
      )
    }
  },
  getters: {
    configured: (state) => Boolean(state.apiKey && state.apiKey.trim())
  }
})
