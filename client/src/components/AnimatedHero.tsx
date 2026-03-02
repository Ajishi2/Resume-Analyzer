'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Animation variables
    let animationId: number
    let time = 0

    const drawMeshGradient = () => {
      time += 0.002

      // Clear canvas
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Create multiple animated conic gradients for mesh effect
      const meshPoints = [
        { x: 0.2, y: 0.3 },
        { x: 0.8, y: 0.2 },
        { x: 0.5, y: 0.7 },
        { x: 0.1, y: 0.9 },
        { x: 0.9, y: 0.8 },
      ]

      meshPoints.forEach((point, index) => {
        const offsetX = Math.sin(time + index) * 200
        const offsetY = Math.cos(time + index + 1) * 200

        const x = point.x * canvas.width + offsetX
        const y = point.y * canvas.height + offsetY

        // Create radial gradient with blur effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 400)

        // Colors from the design
        gradient.addColorStop(0, 'rgba(244, 247, 197, 0.15)')
        gradient.addColorStop(0.4, 'rgba(11, 16, 18, 0.1)')
        gradient.addColorStop(1, 'rgba(11, 16, 18, 0)')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      animationId = requestAnimationFrame(drawMeshGradient)
    }

    drawMeshGradient()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 blur-3xl" />
}
