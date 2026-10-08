'use client'

import { useEffect, useState, type ChangeEvent } from 'react'
import {
  DEFAULT_PASSWORD_LENGTH,
  defaultPasswordOptions,
  generatePassword,
  getPasswordStrength,
  passwordOptionList,
  type PasswordOptionKey,
  type PasswordOptions,
} from '@/lib/password'

export function PasswordGenerator() {
  const [length, setLength] = useState(DEFAULT_PASSWORD_LENGTH)
  const [options, setOptions] = useState<PasswordOptions>(defaultPasswordOptions)
  // Random values must not be created during render: they would differ
  // between the server HTML and the first client render.
  const [password, setPassword] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const [error, setError] = useState('')

  function updatePassword(nextLength: number, nextOptions: PasswordOptions) {
    try {
      setPassword(generatePassword(nextLength, nextOptions))
      setError('')
      setCopyStatus('')
    } catch {
      setError('No se pudo generar la contraseña. Inténtalo de nuevo.')
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPassword(generatePassword(DEFAULT_PASSWORD_LENGTH, defaultPasswordOptions))
  }, [])

  function handleLengthChange(event: ChangeEvent<HTMLInputElement>) {
    const nextLength = Number(event.target.value)
    setLength(nextLength)
    updatePassword(nextLength, options)
  }

  function handleOptionChange(key: PasswordOptionKey) {
    const enabledCount = Object.values(options).filter(Boolean).length
    if (options[key] && enabledCount === 1) return

    const nextOptions = { ...options, [key]: !options[key] }
    setOptions(nextOptions)
    updatePassword(length, nextOptions)
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(password)
      setCopyStatus('Contraseña copiada')
      setError('')
    } catch {
      setCopyStatus('')
      setError('No se pudo copiar. Revisa los permisos del navegador.')
    }
  }

  const selectedOptionCount = Object.values(options).filter(Boolean).length
  const strength = getPasswordStrength(length, options)
  const strengthClass = strength.toLowerCase().replace(' ', '-')

  return (
    <section
      className="password-card"
      id="password-generator"
      aria-labelledby="password-heading"
    >
      <div className="password-card__header">
        <span className="password-card__icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none">
            <rect x="5" y="13" width="22" height="15" rx="3" />
            <path d="M10 13V9a6 6 0 0 1 12 0v4M12 20l3 3 6-6" />
          </svg>
        </span>
        <span className="password-card__eyebrow">Seguridad digital</span>
      </div>

      <h2 className="password-card__title" id="password-heading">
        Password generator
      </h2>
      <p className="password-card__description">
        Crea contraseñas seguras y personalizadas para proteger tus cuentas.
      </p>

      <div className="password-card__result">
        <output className="password-card__value" aria-label="Generated password">
          {password}
        </output>
        <button
          className="password-card__icon-button"
          type="button"
          aria-label="Generar otra contraseña"
          onClick={() => updatePassword(length, options)}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 7v5h-5M4.8 9a7.5 7.5 0 0 1 12.5-2L20 12M4 17v-5h5m10.2 3a7.5 7.5 0 0 1-12.5 2L4 12" />
          </svg>
        </button>
      </div>

      <div
        className={`password-card__strength password-card__strength--${strengthClass}`}
      >
        <span className="password-card__strength-track">
          <span />
          <span />
          <span />
          <span />
        </span>
        Fortaleza: <strong>{strength}</strong>
      </div>

      <button className="password-card__copy" type="button" onClick={handleCopy}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
        </svg>
        Copiar contraseña
      </button>

      <div className="password-card__settings">
        <div className="password-card__length">
          <label htmlFor="password-length">
            Longitud <strong>{length}</strong>
          </label>
          <input
            id="password-length"
            type="range"
            min={6}
            max={32}
            value={length}
            onChange={handleLengthChange}
          />
          <div className="password-card__range-labels" aria-hidden="true">
            <span>6</span>
            <span>32</span>
          </div>
        </div>

        <fieldset className="password-card__options">
          <legend>Tipos de caracteres</legend>
          {passwordOptionList.map(({ key, label }) => (
            <label className="password-card__option" key={key}>
              <span>{label}</span>
              <input
                type="checkbox"
                checked={options[key]}
                disabled={options[key] && selectedOptionCount === 1}
                onChange={() => handleOptionChange(key)}
              />
            </label>
          ))}
        </fieldset>
      </div>

      {(copyStatus || error) && (
        <p
          className={
            error
              ? 'password-card__message password-card__message--error'
              : 'password-card__message'
          }
          role="status"
        >
          {error || copyStatus}
        </p>
      )}
    </section>
  )
}
