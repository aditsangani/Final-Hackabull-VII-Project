import { useState } from 'react'
import { useSettings } from '../context/SettingsContext'

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none
        ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200
          ${checked ? 'translate-x-4' : 'translate-x-0'}`}
      />
    </button>
  )
}

function Slider({ value, min, max, step = 1, onChange, unit = '' }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 appearance-none rounded-full bg-blue-100 accent-blue-600 cursor-pointer"
      />
      <span className="text-[12px] font-medium text-blue-800 w-12 text-right">
        {value}{unit}
      </span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-blue-100 rounded-xl p-4">
      <div className="text-[13px] font-semibold text-gray-900 mb-3">{title}</div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}

function Row({ label, sublabel, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-gray-800">{label}</div>
        {sublabel && <div className="text-[11px] text-gray-400 mt-0.5">{sublabel}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function SliderRow({ label, sublabel, settingKey, min, max, step, unit }) {
  const { settings, update } = useSettings()
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <div className="text-[13px] text-gray-800">{label}</div>
          {sublabel && <div className="text-[11px] text-gray-400">{sublabel}</div>}
        </div>
      </div>
      <Slider
        value={settings[settingKey]}
        min={min}
        max={max}
        step={step}
        unit={unit}
        onChange={v => update(settingKey, v)}
      />
    </div>
  )
}

function ToggleRow({ label, sublabel, settingKey }) {
  const { settings, update } = useSettings()
  return (
    <Row label={label} sublabel={sublabel}>
      <Toggle checked={settings[settingKey]} onChange={v => update(settingKey, v)} />
    </Row>
  )
}

export default function Settings() {
  const { settings, update, reset } = useSettings()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    reset()
    setShowResetConfirm(false)
  }

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-medium text-gray-900">Settings</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">Customize detection, alerts, and display</p>
        </div>
        <button
          onClick={handleSave}
          className={`text-[12px] font-medium px-4 py-1.5 rounded-lg transition-all
            ${saved
              ? 'bg-blue-100 text-blue-800'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          {saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>

      {/* Posture Thresholds */}
      <Section title="Posture thresholds">
        <div className="bg-blue-50 rounded-lg px-3 py-2.5 text-[12px] text-blue-700 mb-1">
          Ear → shoulder → neck angle. Higher = more upright. Your calibrated baseline determines what's "good" for your body.
        </div>
        <SliderRow
          label="Good posture threshold"
          sublabel="Above this angle = blue zone"
          settingKey="goodThreshold"
          min={140}
          max={180}
          unit="°"
        />
        <div className="h-px bg-blue-50" />
        <SliderRow
          label="Warning threshold"
          sublabel="Below this = tech neck alert"
          settingKey="warnThreshold"
          min={120}
          max={165}
          unit="°"
        />
        {settings.warnThreshold >= settings.goodThreshold && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-[12px] text-red-700">
            ⚠️ Warning threshold must be below good threshold. Adjust to continue.
          </div>
        )}
      </Section>

      {/* Detection model */}
      <Section title="MediaPipe detection">
        <ToggleRow
          label="Show skeleton overlay"
          sublabel="Draw pose landmarks on the camera feed"
          settingKey="showSkeleton"
        />
        <div className="h-px bg-blue-50" />
        <ToggleRow
          label="Show live angle"
          sublabel="Display degree reading below the camera"
          settingKey="showLiveAngle"
        />
        <div className="h-px bg-blue-50" />
        <ToggleRow
          label="Mirror camera"
          sublabel="Flip the video horizontally (like a selfie)"
          settingKey="mirrorCamera"
        />
        <div className="h-px bg-blue-50" />
        <ToggleRow
          label="Show confidence score"
          sublabel="Display MediaPipe landmark confidence"
          settingKey="showConfidenceScore"
        />
      </Section>

      {/* Alerts */}
      <Section title="Alerts">
        <ToggleRow
          label="Enable posture alerts"
          sublabel="Get notified when bad posture is detected"
          settingKey="alertEnabled"
        />
        {settings.alertEnabled && (
          <>
            <div className="h-px bg-blue-50" />
            <SliderRow
              label="Alert delay"
              sublabel="How long bad posture persists before alerting"
              settingKey="alertDelayMinutes"
              min={1}
              max={15}
              unit=" min"
            />
            <div className="h-px bg-blue-50" />
            <ToggleRow
              label="Sound alerts"
              sublabel="Play a chime when posture drops"
              settingKey="soundEnabled"
            />
            {settings.soundEnabled && (
              <SliderRow
                label="Alert volume"
                settingKey="soundVolume"
                min={0}
                max={100}
                unit="%"
              />
            )}
          </>
        )}
      </Section>

      {/* Session */}
      <Section title="Session behavior">
        <ToggleRow
          label="Auto-start on launch"
          sublabel="Begin detection when the app opens"
          settingKey="autoStartOnLaunch"
        />
        <div className="h-px bg-blue-50" />
        <ToggleRow
          label="Pause when idle"
          sublabel="Stop tracking if no motion is detected"
          settingKey="pauseOnIdle"
        />
        {settings.pauseOnIdle && (
          <SliderRow
            label="Idle timeout"
            sublabel="Minutes of no motion before pausing"
            settingKey="idleTimeoutMinutes"
            min={2}
            max={30}
            unit=" min"
          />
        )}
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <ToggleRow
          label="Bad posture alerts"
          sublabel="Desktop notification when tech neck detected"
          settingKey="notifyBadPosture"
        />
        <div className="h-px bg-blue-50" />
        <ToggleRow
          label="Streak milestones"
          sublabel="Celebrate when you hit posture streaks"
          settingKey="notifyStreakMilestone"
        />
        <div className="h-px bg-blue-50" />
        <ToggleRow
          label="Session summary"
          sublabel="Daily digest of your posture stats"
          settingKey="notifySessionSummary"
        />
      </Section>

      {/* Danger zone */}
      <Section title="Reset">
        <Row
          label="Reset all settings"
          sublabel="Restore defaults — your posture history is not affected"
        >
          {showResetConfirm ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="text-[12px] px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="text-[12px] px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Confirm reset
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-[12px] px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
            >
              Reset defaults
            </button>
          )}
        </Row>
      </Section>
    </div>
  )
}
