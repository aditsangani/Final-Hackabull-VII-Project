import { useEffect, useRef, useState, useCallback } from 'react'

export function useMediaPipe({ enabled = true, onResults } = {}) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const poseRef = useRef(null)
  const streamRef = useRef(null)
  const animFrameRef = useRef(null)

  const [status, setStatus] = useState('idle')
  const [angle, setAngle] = useState(null)
  const [landmarks, setLandmarks] = useState(null)
  const [postureLabel, setPostureLabel] = useState(null)

  const calcAngle = (ear, shoulder, neck) => {
    if (!ear || !shoulder || !neck) return null
    const v1 = { x: ear.x - shoulder.x, y: ear.y - shoulder.y }
    const v2 = { x: neck.x - shoulder.x, y: neck.y - shoulder.y }
    const dot = v1.x * v2.x + v1.y * v2.y
    const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2)
    const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2)
    if (mag1 === 0 || mag2 === 0) return null
    const cos = Math.max(-1, Math.min(1, dot / (mag1 * mag2)))
    return Math.round((Math.acos(cos) * 180) / Math.PI)
  }

  const calcNeckAngle = (lm) => {
    if (!lm) return null
    const neck = {
      x: (lm[11].x + lm[12].x) / 2,
      y: (lm[11].y + lm[12].y) / 2,
    }

    const right = calcAngle(lm[8], lm[12], neck)
    const left = calcAngle(lm[7], lm[11], neck)
    const values = [right, left].filter((v) => v !== null)
    if (!values.length) return null
    return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
  }

  const getLabel = (a, thresholds) => {
    if (a === null) return null
    if (a >= thresholds.good) return 'good'
    if (a >= thresholds.warn) return 'warn'
    return 'bad'
  }

  const drawSkeleton = useCallback((results, canvas, thresholds) => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (!results.poseLandmarks) return

    const lm = results.poseLandmarks
    const toC = (p) => ({ x: p.x * canvas.width, y: p.y * canvas.height })

    const pts = {
      nose: toC(lm[0]),
      leftEar: lm[7] ? toC(lm[7]) : null,
      rightEar: lm[8] ? toC(lm[8]) : null,
      leftShoulder: toC(lm[11]),
      rightShoulder: toC(lm[12]),
      leftHip: toC(lm[23]),
      rightHip: toC(lm[24]),
    }

    const label = getLabel(calcNeckAngle(lm), thresholds)
    const color = label === 'good' ? '#185FA5' : label === 'warn' ? '#F59E0B' : '#EF4444'

    const connections = [
      [pts.leftEar, pts.leftShoulder],
      [pts.rightEar, pts.rightShoulder],
      [pts.leftShoulder, pts.rightShoulder],
      [pts.leftShoulder, pts.leftHip],
      [pts.rightShoulder, pts.rightHip],
      [pts.leftHip, pts.rightHip],
    ]

    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    connections.forEach(([a, b]) => {
      if (!a || !b) return
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    })

    const joints = [pts.leftEar, pts.rightEar, pts.leftShoulder, pts.rightShoulder, pts.leftHip, pts.rightHip, pts.nose].filter(Boolean)
    joints.forEach(pt => {
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1.5
      ctx.stroke()
    })
  }, [])

  const start = useCallback(async (thresholds = { good: 165, warn: 150 }) => {
    if (!enabled) return
    setStatus('loading')

    try {
      // Load MediaPipe from local extension files (no CDN needed)
      if (!window.Pose) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          // Use the locally bundled pose.js from public/mediapipe
          script.src = chrome.runtime.getURL('mediapipe/pose.js')
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }

      const pose = new window.Pose({
        locateFile: (file) => chrome.runtime.getURL(`mediapipe/${file}`),
      })

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      })

      pose.onResults((results) => {
        const lm = results.poseLandmarks
        if (lm) {
          const a = calcNeckAngle(lm)
          const label = getLabel(a, thresholds)
          setAngle(a)
          setLandmarks(lm)
          setPostureLabel(label)
          if (onResults) onResults({ angle: a, landmarks: lm, label })
          if (canvasRef.current) drawSkeleton(results, canvasRef.current, thresholds)
        } else {
          setAngle(null)
          setLandmarks(null)
          setPostureLabel(null)
        }
      })

      await pose.initialize()
      poseRef.current = pose

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      const processFrame = async () => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          await pose.send({ image: videoRef.current })
        }
        animFrameRef.current = requestAnimationFrame(processFrame)
      }

      setStatus('active')
      processFrame()
    } catch (err) {
      console.error('MediaPipe error:', err)
      setStatus('error')
    }
  }, [enabled, onResults, drawSkeleton])

  const stop = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    if (poseRef.current) {
      try { poseRef.current.close() } catch {}
      poseRef.current = null
    }
    setStatus('idle')
    setAngle(null)
    setLandmarks(null)
    setPostureLabel(null)
  }, [])

  useEffect(() => () => stop(), [stop])

  return { videoRef, canvasRef, status, angle, landmarks, postureLabel, start, stop }
}
