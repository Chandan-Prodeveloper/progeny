'use client'

import React, { useState, useRef } from 'react'
import { X, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'

export default function VideoModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    if (videoRef.current) {
      videoRef.current.currentTime = pos * duration
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-transparent px-8 text-lg font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Watch Demo
      </button>

      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4">
          <div className="relative w-full max-w-5xl">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>

            {/* Video Container */}
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
              <div className="relative bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-auto"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={togglePlay}
                  src="https://res.cloudinary.com/di1vsejom/video/upload/v1765287907/demo_vedio_2_xvgtjf.mp4"
                >
                  Your browser does not support the video tag.
                </video>

                {/* Custom Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  {/* Progress Bar */}
                  <div
                    className="w-full h-1 bg-gray-600 rounded-full mb-3 cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className="hover:text-purple-400 transition-colors"
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <span className="text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleMute}
                        className="hover:text-purple-400 transition-colors"
                      >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <button
                        onClick={toggleFullscreen}
                        className="hover:text-purple-400 transition-colors"
                      >
                        <Maximize size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )

}
