import { createContext, useContext, useState, useEffect } from 'react'

const defaultSettings = {
  goodThreshold: 165,
  warnThreshold: 150,
  alertEnabled: true,
  alertDelayMinutes: 3,
  soundEnabled: true,
  soundVolume: 70,
  autoStartOnLaunch: false,
  pauseOnIdle: true,
  idleTimeoutMinutes: 10,
  showLiveAngle: true,
  showSkeleton: true,
  showConfidenceScore: false,
  notifyBadPosture: true,
  notifyStreakMilestone: true,
  notifySessionSummary: true,
  mirrorCamera: true,
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Load from chrome.storage if available, else localStorage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get('settings', (data) => {
        if (data.settings) {
          setSettings({ ...defaultSettings, ...data.settings })
        }
        setLoaded(true)
      })
    } else {
      try {
        const saved = localStorage.getItem('posture-ai-settings')
        if (saved) setSettings({ ...defaultSettings, ...JSON.parse(saved) })
      } catch {}
      setLoaded(true)
    }
  }, [])

  const update = (key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value }
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ settings: next })
      } else {
        localStorage.setItem('posture-ai-settings', JSON.stringify(next))
      }
      return next
    })
  }

  const reset = () => {
    setSettings(defaultSettings)
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ settings: defaultSettings })
    } else {
      localStorage.setItem('posture-ai-settings', JSON.stringify(defaultSettings))
    }
  }

  if (!loaded) return null

  return (
    <SettingsContext.Provider value={{ settings, update, reset }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
