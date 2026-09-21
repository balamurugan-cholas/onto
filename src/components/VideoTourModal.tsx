import React, { useRef } from 'react'
import { Product } from '../data/products'

interface VideoTourModalProps {
  product: Product | null
  onClose: () => void
}

export default function VideoTourModal({ product, onClose }: VideoTourModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  if (!product || !product.tour) return null

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }

  return (
    <div
      className="video-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="video-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="video-modal-header">
          <div>
            <span className="video-modal-kicker">PLUGIN WALKTHROUGH</span>
            <h2 className="video-modal-title">{product.tour.title}</h2>
          </div>
          <button
            type="button"
            className="video-modal-close-btn"
            onClick={onClose}
            aria-label="Close video tour"
          >
            ✕
          </button>
        </div>

        <div
          className="video-modal-player-wrapper"
          onClick={togglePlay}
          style={{ cursor: 'pointer' }}
          title="Click to play / pause"
        >
          <video
            ref={videoRef}
            src={product.tour.video}
            autoPlay
            loop
            muted
            playsInline
            className="video-modal-player"
          />
        </div>

        <p className="video-modal-description">{product.tour.description}</p>
      </div>
    </div>
  )
}
