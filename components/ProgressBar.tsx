'use client'

import { useState, type ChangeEvent, type CSSProperties } from 'react'

export function ProgressBar() {
  const [percentage, setPercentage] = useState(10)

  function handlePercentageChange(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value)
    setPercentage(Math.min(100, Math.max(0, value || 0)))
  }

  const style = { '--progress-hue': percentage * 1.2 } as CSSProperties

  return (
    <section
      className="progress-card"
      id="progress"
      aria-labelledby="progress-heading"
      style={style}
    >
      <span className="progress-card__eyebrow">Estado actual</span>
      <h1 className="progress-card__title" id="progress-heading">
        Progress bar
      </h1>
      <div
        className="progress"
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div className="progress__track">
          <div className="progress__fill" style={{ width: `${percentage}%` }} />
          <span className="progress__marker" style={{ left: `${percentage}%` }}>
            {percentage}%
          </span>
        </div>
      </div>

      <div className="progress-card__control">
        <label className="progress-card__label" htmlFor="percentage-input">
          Input Percentage
        </label>
        <div className="progress-card__input-wrap">
          <input
            id="percentage-input"
            className="progress-card__input"
            type="number"
            min={0}
            max={100}
            step={1}
            value={percentage}
            onChange={handlePercentageChange}
          />
          <span className="progress-card__unit">%</span>
        </div>
      </div>
    </section>
  )
}

