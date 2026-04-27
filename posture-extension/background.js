// PostureAI Background Service Worker
// Handles notifications and storing posture session data

chrome.runtime.onInstalled.addListener(() => {
  console.log('PostureAI installed')
  // Set default settings
  chrome.storage.local.get('settings', (data) => {
    if (!data.settings) {
      chrome.storage.local.set({
        settings: {
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
      })
    }
  })
})

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.action.openPopup()
})

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BAD_POSTURE_ALERT') {
    chrome.storage.local.get('settings', (data) => {
      const settings = data.settings || {}
      if (settings.notifyBadPosture) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'PostureAI — Tech Neck Alert',
          message: `Your posture angle dropped to ${message.angle}°. Time for a 30-second reset.`,
          priority: 1,
        })
      }
    })
  }

  if (message.type === 'STREAK_MILESTONE') {
    chrome.storage.local.get('settings', (data) => {
      const settings = data.settings || {}
      if (settings.notifyStreakMilestone) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'PostureAI — Streak Milestone! 🔥',
          message: message.text,
          priority: 1,
        })
      }
    })
  }

  sendResponse({ ok: true })
  return true
})
