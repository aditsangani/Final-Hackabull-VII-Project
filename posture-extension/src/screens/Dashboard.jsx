import { useEffect, useRef, useState } from 'react'
import { useMediaPipe } from '../hooks/useMediaPipe'
import { useSettings } from '../context/SettingsContext'

const hourlyData = [
  { h: '10a', pct: 88, level: 'good' }, { h: '11a', pct: 92, level: 'good' },
  { h: '12p', pct: 75, level: 'warn' }, { h: '1p',  pct: 40, level: 'bad'  },
  { h: '2p',  pct: 78, level: 'good' }, { h: '3p',  pct: 88, level: 'good' },
  { h: '4p',  pct: 62, level: 'warn' }, { h: '5p',  pct: 85, level: 'good' },
]
const barColor = { good: 'bg-blue-600', warn: 'bg-blue-200', bad: 'bg-gray-200' }

export default function Dashboard() {
  const { settings } = useSettings()
  const badSinceRef = useRef(null)
  const [cameraStarted, setCameraStarted] = useState(false)

  const { videoRef, canvasRef, status, angle, postureLabel, start, stop } = useMediaPipe({
    enabled: true,
    onResults: ({ angle, label }) => {
      if (label === 'bad') {
        if (!badSinceRef.current) badSinceRef.current = Date.now()
        const elapsed = (Date.now() - badSinceRef.current) / 1000 / 60
        if (elapsed >= (settings.alertDelayMinutes || 3) && settings.alertEnabled) {
          badSinceRef.current = Date.now()
          try {
            chrome.runtime.sendMessage({ type: 'BAD_POSTURE_ALERT', angle })
          } catch {}
        }
      } else {
        badSinceRef.current = null
      }
    },
  })

  const handleStartCamera = () => {
    setCameraStarted(true)
    start({ good: settings.goodThreshold, warn: settings.warnThreshold })
  }

  useEffect(() => {
    return () => stop()
  }, []) // eslint-disable-line

  const angleColor = {
    good: 'text-blue-600',
    warn: 'text-yellow-600',
    bad: 'text-red-500',
  }[postureLabel] ?? 'text-gray-400'

  const borderColor = {
    good: 'border-blue-500',
    warn: 'border-yellow-400',
    bad: 'border-red-400',
  }[postureLabel] ?? 'border-blue-200'

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full">
      <div>
        <h1 className="text-[15px] font-medium text-gray-900">Dashboard</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">Today — Posture monitoring</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Score', value: '84', badge: 'Good' },
          { label: 'Blue zone', value: '1h 42m', badge: '78%' },
          { label: 'Alerts', value: '3', badge: '2 resolved' },
        ].map(m => (
          <div key={m.label} className="bg-blue-50 rounded-xl p-3">
            <div className="text-[10px] text-blue-600 mb-0.5">{m.label}</div>
            <div className="text-[18px] font-medium text-blue-800 leading-tight">{m.value}</div>
            <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">{m.badge}</span>
          </div>
        ))}
      </div>

      {postureLabel === 'bad' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0" />
          <div>
            <div className="text-[12px] font-medium text-red-800">Tech neck detected</div>
            <div className="text-[11px] text-red-600 mt-0.5">Head angle at {angle}°. Time for a reset.</div>
          </div>
        </div>
      )}

      {/* Live feed */}
      <div className="bg-white border border-blue-100 rounded-xl p-3">
        <div className="text-[12px] font-medium text-gray-900 mb-2">Live detection</div>

        {!cameraStarted ? (
          <button
            onClick={handleStartCamera}
            className="w-full h-24 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[12px] font-medium text-blue-600">Click to start camera</span>
          </button>
        ) : (
          <div className={`bg-page rounded-lg overflow-hidden relative border-2 ${borderColor} transition-colors`} style={{ height: 130 }}>
            {status === 'active' && (
              <span className="absolute top-1.5 left-1.5 z-10 bg-red-500 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full">LIVE</span>
            )}
            {status === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[11px] text-gray-400">Loading MediaPipe...</span>
                </div>
              </div>
            )}
            {status === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center px-3">
                <div className="text-center">
                  <div className="text-[11px] text-red-500">Camera permission denied.<br/>Click the camera icon in the address bar.</div>
                </div>
              </div>
            )}
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover ${settings.mirrorCamera ? 'scale-x-[-1]' : ''}`}
              muted playsInline
              style={{ display: status === 'active' ? 'block' : 'none' }}
            />
            {settings.showSkeleton && (
              <canvas
                ref={canvasRef}
                width={640} height={480}
                className={`absolute inset-0 w-full h-full ${settings.mirrorCamera ? 'scale-x-[-1]' : ''}`}
                style={{ display: status === 'active' ? 'block' : 'none', pointerEvents: 'none' }}
              />
            )}
            {status === 'active' && (
              <span className="absolute bottom-1.5 left-2 right-2 flex items-center gap-1 text-[10px] font-medium z-10">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${postureLabel === 'good' ? 'bg-blue-600' : 'bg-yellow-400'}`} />
                <span className="text-blue-600">
                  {!angle ? 'No pose — show your upper body' :
                   postureLabel === 'good' ? `Good posture · ${angle}°` :
                   postureLabel === 'warn' ? `Warning · ${angle}°` : `Tech neck · ${angle}°`}
                </span>
              </span>
            )}
          </div>
        )}

        {settings.showLiveAngle && cameraStarted && angle && (
          <div className="text-center mt-2">
            <div className={`text-[24px] font-medium font-mono ${angleColor}`}>{angle}°</div>
            <div className="text-[10px] text-gray-400">Ear → shoulder → neck</div>
          </div>
        )}
      </div>

      {/* Hourly bars */}
      <div className="bg-white border border-blue-100 rounded-xl p-3">
        <div className="text-[12px] font-medium text-gray-900 mb-2">Hourly breakdown</div>
        <div className="flex items-end gap-1 h-14">
          {hourlyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end h-full">
              <div className={`w-full rounded-sm ${barColor[d.level]}`} style={{ height: `${d.pct}%` }} />
            </div>
          ))}
        </div>
        <div className="flex gap-1 mt-1">
          {hourlyData.map((d, i) => (
            <div key={i} className="flex-1 text-[9px] text-gray-400 text-center">{d.h}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
