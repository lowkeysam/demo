'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Component() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          x: mousePosition.x * 0.02,
          y: mousePosition.y * 0.02,
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white rounded-full opacity-10"
        animate={{
          scale: [1.2, 1, 1.2],
          x: mousePosition.x * -0.02,
          y: mousePosition.y * -0.02,
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Main content area */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-8 shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Welcome</h1>
        <p className="text-white text-center mb-6">
          This is a cool and simple page where you can add your components.
        </p>
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-white text-center">
          Add your components here!
        </div>
      </div>
    </div>
  )
}