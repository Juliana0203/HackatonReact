'use client'

import { useEffect, useState } from 'react'

export function Timer() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return undefined

    const intervalId = window.setInterval(() => {
      setSeconds((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isRunning])

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  function reset() {
    setIsRunning(false)
    setSeconds(0)
  }

  return (
    <section className="timer-card" id="timer" aria-labelledby="timer-heading">
      <div className="timer-card__header">
        <span className="timer-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.5 1.5M9 2h6M12 2v3" />
          </svg>
        </span>
        <div>
          <span className="timer-card__eyebrow">Cronómetro</span>
          <h2 className="timer-card__title" id="timer-heading">
            Timer
          </h2>
        </div>
      </div>

      <output
        className="timer-card__display"
        aria-label={`${minutes} mins ${remainingSeconds} secs`}
      >
        <span>{minutes}</span>
        <span className="timer-card__unit">mins</span>
        <span>{String(remainingSeconds).padStart(2, '0')}</span>
        <span className="timer-card__unit">secs</span>
      </output>

      <div className="timer-card__controls" aria-label="Timer controls">
        <button
          className="timer-card__button timer-card__button--start"
          type="button"
          onClick={() => setIsRunning(true)}
          disabled={isRunning}
        >
          Start
        </button>
        <button
          className="timer-card__button timer-card__button--stop"
          type="button"
          onClick={() => setIsRunning(false)}
          disabled={!isRunning}
        >
          Stop
        </button>
        <button
          className="timer-card__button timer-card__button--reset"
          type="button"
          onClick={reset}
        >
          Reset
        </button>
      </div>
      <p className="timer-card__status" role="status">
        {isRunning
          ? 'El cronómetro está en marcha'
          : 'El cronómetro está detenido'}
      </p>
    </section>
  )
}
