import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './screens/Dashboard'
import Analytics from './screens/Analytics'
import Calibrate from './screens/Calibrate'
import Streaks from './screens/Streaks'
import Settings from './screens/Settings'
import { SettingsProvider } from './context/SettingsContext'
import './index.css'

const screens = {
  dashboard: Dashboard,
  analytics: Analytics,
  calibrate: Calibrate,
  streaks:   Streaks,
  settings:  Settings,
}

export default function Popup() {
  const [active, setActive] = useState('dashboard')
  const Screen = screens[active]

  return (
    <SettingsProvider>
      <div className="w-[420px] h-[580px] bg-page flex overflow-hidden rounded-lg">
        <Sidebar active={active} onNav={setActive} />
        <main className="flex-1 overflow-hidden bg-page">
          <Screen />
        </main>
      </div>
    </SettingsProvider>
  )
}
