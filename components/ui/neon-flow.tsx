'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const randomColors = (count: number) =>
  new Array(count)
    .fill(0)
    .map(() => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'))

interface TubesBackgroundProps {
  children?: React.ReactNode
  className?: string
  enableClickInteraction?: boolean
}

export function TubesBackground({
  children,
  className,
  enableClickInteraction = true,
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const tubesRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true

    const initTubes = async () => {
      if (!canvasRef.current) return
      try {
        // new Function bypasses webpack module resolution entirely — CDN URL loaded natively by the browser
        const dynamicImport = new Function('u', 'return import(u)')
        const module = await dynamicImport(
          'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
        )
        const TubesCursor = module.default
        if (!mounted) return

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ['#f967fb', '#53bc28', '#6958d5'],
            lights: {
              intensity: 200,
              colors: ['#83f36e', '#fe8a2e', '#ff008a', '#60aed5'],
            },
          },
        })

        tubesRef.current = app
        setIsLoaded(true)
      } catch (error) {
        console.error('Failed to load TubesCursor:', error)
      }
    }

    initTubes()
    return () => { mounted = false }
  }, [])

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return
    tubesRef.current.tubes.setColors(randomColors(3))
    tubesRef.current.tubes.setLightsColors(randomColors(4))
  }

  return (
    <div
      className={cn('relative w-full h-full overflow-hidden', className)}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: 'none' }}
      />
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  )
}

export default TubesBackground
