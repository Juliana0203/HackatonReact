'use client'

import { useState, type FormEvent } from 'react'

interface RegistrationRequest {
  UserName: string
  FullName: string
  Age: number
}

export function RegistrationForm() {
  const [submittedData, setSubmittedData] = useState<RegistrationRequest | null>(
    null,
  )
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') ?? '').trim()
    const fullName = String(formData.get('fullName') ?? '').trim()
    const age = Number(formData.get('age'))

    if (!username || !fullName || !Number.isInteger(age) || age < 1 || age > 120) {
      setError('Completa todos los campos. La edad debe ser un número entre 1 y 120.')
      setSubmittedData(null)
      return
    }

    const requestData: RegistrationRequest = {
      UserName: username.toUpperCase(),
      FullName: fullName.toUpperCase(),
      Age: age,
    }

    setError('')
    setSubmittedData(requestData)
    window.alert(JSON.stringify(requestData, null, 2))
  }

  return (
    <section
      className="registration-card"
      id="reto-3"
      aria-labelledby="registration-heading"
    >
      <div className="registration-card__intro">
        <span className="registration-card__eyebrow">Formulario de usuario</span>
        <h2 className="registration-card__title" id="registration-heading">
          Reto 3
        </h2>
        <p className="registration-card__description">
          Completa tus datos para generar una solicitud en formato JSON.
        </p>
        <ul className="registration-card__criteria">
          <li>
            <span className="registration-card__check" aria-hidden="true">✓</span>
            Verificación de campos obligatorios
          </li>
          <li>
            <span className="registration-card__check" aria-hidden="true">✓</span>
            Edad válida entre 1 y 120 años
          </li>
          <li>
            <span className="registration-card__check" aria-hidden="true">✓</span>
            Envío de los datos como JSON
          </li>
        </ul>
      </div>

      <div className="registration-card__content">
        <form className="registration-form" onSubmit={handleSubmit} noValidate>
          <div className="registration-form__field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="p. ej. usuario123"
              required
              maxLength={40}
            />
          </div>

          <div className="registration-form__field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="p. ej. Alex Rivera"
              required
              maxLength={100}
            />
          </div>

          <div className="registration-form__field">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              inputMode="numeric"
              placeholder="Tu edad"
              min={1}
              max={120}
              step={1}
              required
            />
          </div>

          {error && (
            <p className="registration-form__error" role="alert">
              {error}
            </p>
          )}

          <button className="registration-form__submit" type="submit">
            Enviar datos
            <span aria-hidden="true">→</span>
          </button>
          <p className="registration-form__note">
            Demostración local: los datos no se guardan en una base de datos.
          </p>
        </form>

        {submittedData && (
          <div className="request-preview" aria-live="polite">
            <div className="request-preview__heading">
              <span className="request-preview__status" aria-hidden="true" />
              <h3>Vista previa de la solicitud</h3>
            </div>
            <ul className="request-preview__data">
              <li>
                <span>UserName</span>
                <strong>{submittedData.UserName}</strong>
              </li>
              <li>
                <span>FullName</span>
                <strong>{submittedData.FullName}</strong>
              </li>
              <li>
                <span>Age</span>
                <strong>{submittedData.Age}</strong>
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
