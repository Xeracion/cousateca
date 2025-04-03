
"use client"

import React, { useRef, useEffect, useState } from "react"
import { motion, useMotionTemplate, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface FloatingProps {
  children: React.ReactNode
  className?: string
  sensitivity?: number
  baseRadius?: number
  durationFactor?: number
  rotateFactor?: number
}

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  depth?: number
}

export function FloatingElement({
  children,
  className,
  depth = 1,
}: FloatingElementProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [dataDepth, setDataDepth] = useState<string>(`${depth}`)

  useEffect(() => {
    if (ref.current) {
      setDataDepth(`${depth}`)
    }
  }, [depth])

  return (
    <div
      ref={ref}
      data-depth={dataDepth}
      className={cn("absolute", className)}
    >
      {children}
    </div>
  )
}

export default function Floating({
  children,
  className,
  sensitivity = 1,
  baseRadius = 1,
  durationFactor = 1,
  rotateFactor = 1,
}: FloatingProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!containerRef.current) return
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    
    // Calculate mouse position relative to center of container
    const newMouseX = (event.clientX - centerX) / width
    const newMouseY = (event.clientY - centerY) / height
    
    setMouseX(newMouseX * sensitivity)
    setMouseY(newMouseY * sensitivity)
  }

  const handleMouseLeave = () => {
    setMouseX(0)
    setMouseY(0)
  }

  useEffect(() => {
    // Apply position based on mouse coordinates
    const elements = containerRef.current?.querySelectorAll("[data-depth]") || []
    
    elements.forEach((el) => {
      const depth = parseFloat(el.getAttribute("data-depth") || "1")
      const targetX = mouseX * depth * 40
      const targetY = mouseY * depth * 40
      
      // Apply transform to element
      el.animate(
        [
          {
            transform: `translate(${targetX}px, ${targetY}px)`,
          },
        ],
        {
          duration: 1000 * durationFactor,
          fill: "forwards",
          easing: "ease-out",
        }
      )
    })
  }, [mouseX, mouseY, durationFactor])

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x,
        y,
      }}
    >
      {children}
    </motion.div>
  )
}
