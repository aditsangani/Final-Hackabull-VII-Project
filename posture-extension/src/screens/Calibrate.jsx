import { useState, useEffect, useCallback } from 'react'
import { useMediaPipe } from '../hooks/useMediaPipe'
import { useSettings } from '../context/SettingsContext'

const steps = ['Position', 'Hold pose', 'Confirm']

export default function Calibrate() {
  const { settings, update } = useSettings()
  const [activeStep, setActiveStep] = useState(0)
  const [countdown, setCountdown] = useState(10)
  const [done, setDone] = useState(false)
  const [capturedAngle, setCapturedAngle] = useState(null)
  const [holdingGood, setHoldingGood] = useState(false)
  const [savedThresholds] = useState({ good: settings.goodThreshold, warn: settings.warnThreshold })

  const handleResults = useCallback(({ angle }) => {
    if (activeStep === 1 && !done) {
      setHoldingGood(angle !== null && angle > 150)
    }
  }, [activeStep, done])

  const { videoRef, canvasRef, status, angle, postureLabel, start, stop } = useMediaPipe({
    enabled: true,
    onResults: handleResults,
  })

  useEffect(() => {
    start({ good: 165, warn: 150 })
    return () => stop()
  }, []) // eslint-disable-line

  useEffect(() => {
    if (status === 'active' && activeStep === 0) {
      setActiveStep(1)
    }
  }, [status, activeStep])

  useEffect(() => {
    if (activeStep !== 1 || done || !holdingGood) return
    if (countdown <= 0) {
      setDone(true)
      setCapturedAngle(angle)
      setActiveStep(2)
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, activeStep, done, holdingGood, angle])

  useEffect(() => {
    if (activeStep === 1 && !holdingGood && !done) {
      setCountdown(10)
    }
  }, [holdingGood, activeStep, done])

  const handleConfirm = () => {
    if (capturedAngle) {
      update('goodThreshold', Math.max(capturedAngle - 5, 150))
      update('warnThreshold', Math.max(capturedAngle - 20, 130))
    }
    stop()
  }

  const handleRecalibrate = () => {
    setActiveStep(0)
    setCountdown(10)
    setDone(false)
    setCapturedAngle(null)
    setHoldingGood(false)
    start({ good: 165, warn: 150 })
  }

  const circumference = 2 * Math.PI * 34
  const offset = circumference * (countdown / 10)

  const statusColor = {
    good: 'border-blue-500',
    warn: 'border-yellow-400',
    bad: 'border-red-400',
  }[postureLabel] ?? 'border-blue-200'

  const angleColor = {
    good: 'text-blue-600',
    warn: 'text-yellow-600',
    bad: 'text-red-500',
  }[postureLabel] ?? 'text-gray-400'

  const statusMessage = () => {
    if (status === 'loading') return 'Starting camera...'
    if (status === 'error') return 'Camera error — check permissions'
    if (status === 'idle') return 'Camera off'
    if (!angle) return 'No pose detected — make sure your upper body is visible'
    if (activeStep === 1 && !holdingGood) return 'Slouching detected — sit up straighter to start countdown'
    if (activeStep === 1 && holdingGood) return 'Great posture! Hold still...'
    if (done) return 'Baseline captured successfully'
    return 'Landmarks detected — looking good'
  }

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-[18px] font-medium text-gray-900">Calibrate your baseline</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">Set once — personalized to your height and chair</p>
      </div>

      <div className="flex items-center gap-0 mb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-medium z-10
                ${i < activeStep ? 'bg-blue-100 text-blue-800' : i === activeStep ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {i < activeStep
                  ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#0C447C" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  : i + 1}
              </div>
              <span className={`text-[11px] ${i === activeStep ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className="h-px w-full bg-blue-100 mb-5" />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-4">
        <div className="text-[14px] font-medium text-gray-900 mb-3">
          {done ? 'Baseline captured successfully' : 'Sit in your best posture and hold for 10 seconds'}
        </div>

        <div className={`bg-page rounded-lg overflow-hidden relative border-2 ${done ? 'border-blue-600' : statusColor} transition-colors`}
          style={{ height: 180 }}>

          {status === 'active' && (
            <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">LIVE</span>
          )}

          {status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-[12px] text-gray-400">Loading MediaPipe...</span>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-center px-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="1.5"/><path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span className="text-[12px] text-red-500">Camera permission denied.<br/>Check browser settings.</span>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover ${settings.mirrorCamera ? 'scale-x-[-1]' : ''}`}
            muted
            playsInline
            style={{ display: status === 'active' ? 'block' : 'none' }}
          />

          {settings.showSkeleton && (
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className={`absolute inset-0 w-full h-full ${settings.mirrorCamera ? 'scale-x-[-1]' : ''}`}
              style={{ display: status === 'active' ? 'block' : 'none', pointerEvents: 'none' }}
            />
          )}

          <span className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 text-[11px] font-medium z-10">
            <span className={`w-1.5 h-1.5 rounded-full inline-block shrink-0 ${
              status === 'active' && holdingGood ? 'bg-blue-600' :
              status === 'active' ? 'bg-yellow-400' : 'bg-gray-400'
            }`} />
            <span className={status === 'error' ? 'text-red-500' : 'text-blue-600'}>
              {statusMessage()}
            </span>
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="text-[13px] text-gray-400">Current angle reading</div>
            {settings.showLiveAngle ? (
              <div className={`text-[28px] font-medium font-mono ${angleColor}`}>
                {angle ? `${angle}°` : '—'}
              </div>
            ) : (
              <div className="text-[28px] font-medium font-mono text-gray-300">—</div>
            )}
          </div>

          {!done ? (
            <div className="flex flex-col items-center gap-1">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#E6F1FB" strokeWidth="6"/>
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke={holdingGood ? "#185FA5" : "#D3D1C7"}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - offset}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
                <text x="40" y="45" textAnchor="middle" fontSize="18" fontWeight="500"
                  fill={holdingGood ? "#185FA5" : "#888780"}
                >{countdown}s</text>
              </svg>
              <span className="text-[11px] text-gray-400">
                {holdingGood ? 'Remaining' : 'Sit straighter'}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-blue-50">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16l7 7 13-13" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[11px] text-blue-600 mt-1">Saved</span>
            </div>
          )}
        </div>
      </div>

      {done && capturedAngle && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-[13px] font-medium text-blue-800 mb-1">
            Baseline set at {capturedAngle}°
          </div>
          <div className="text-[12px] text-blue-600 mb-3">
            Good zone: ≥{Math.max(capturedAngle - 5, 150)}° · Warning: &lt;{Math.max(capturedAngle - 20, 130)}°
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-blue-600 text-white text-[12px] font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply baseline
            </button>
            <button
              onClick={handleRecalibrate}
              className="flex-1 border border-blue-200 text-blue-700 text-[12px] font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Recalibrate
            </button>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2a3 3 0 100 6 3 3 0 000-6zM3 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div className="text-[13px] font-medium text-blue-800">
            Current threshold: {savedThresholds.good}° good · {savedThresholds.warn}° warn
          </div>
          <div className="text-[12px] text-blue-600 mt-0.5">
            {done ? 'New calibration will replace this once applied.' : 'New calibration will replace this and apply going forward.'}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[13px] font-medium text-gray-900">Tips for best results</div>
        {[
          ['Sit in the chair you use most', 'Different chairs change your natural posture angle'],
          ['Keep your full upper body in frame', 'Ear, shoulder, and hip must all be visible'],
          ['Sit naturally — not artificially straight', 'Your baseline should be sustainable, not forced'],
        ].map(([t, s], i) => (
          <div key={t} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-medium flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
            <div>
              <div className="text-[13px] text-gray-900">{t}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
