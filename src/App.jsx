import { useEffect, useState } from 'react'
import './App.css'

const passwordCharacterSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?',
}

const passwordOptions = [
  { key: 'uppercase', label: 'Uppercase' },
  { key: 'lowercase', label: 'Lowercase' },
  { key: 'numbers', label: 'Numbers' },
  { key: 'symbols', label: 'Special characters' },
]

function secureRandomInt(max) {
  const range = Math.floor(256 / max) * max
  const values = new Uint8Array(1)

  do {
    window.crypto.getRandomValues(values)
  } while (values[0] >= range)

  return values[0] % max
}

function generatePassword(length, options) {
  const selectedSets = passwordOptions
    .filter(({ key }) => options[key])
    .map(({ key }) => passwordCharacterSets[key])

  if (selectedSets.length === 0) {
    throw new Error('Select at least one character type.')
  }

  const characters = selectedSets.join('')
  const password = selectedSets.map((set) => set[secureRandomInt(set.length)])

  while (password.length < length) {
    password.push(characters[secureRandomInt(characters.length)])
  }

  for (let index = password.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomInt(index + 1)
    ;[password[index], password[swapIndex]] = [password[swapIndex], password[index]]
  }

  return password.join('')
}

function Navbar({ searchValue, onSearchValueChange, onSearch }) {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <a className="navbar__brand" href="#characters">
        R&M Explorer
      </a>

      <div className="navbar__links">
        <a className="navbar__link navbar__link--active" href="#characters" aria-current="page">
          Personajes
        </a>
        <a className="navbar__link" href="#progress">
          Progreso
        </a>
        <a className="navbar__link" href="#tools">
          Herramientas
        </a>
        <a className="navbar__link" href="#reto-3">
          Reto 3
        </a>
      </div>

      <form
        className="navbar__search"
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
          onSearch(searchValue.trim())
        }}
      >
        <label className="visually-hidden" htmlFor="site-search">
          Buscar personajes por nombre
        </label>
        <input
          id="site-search"
          className="navbar__input"
          type="search"
          placeholder="Buscar personaje..."
          value={searchValue}
          onChange={(event) => onSearchValueChange(event.target.value)}
        />
        <button className="navbar__button" type="submit">
          Buscar
        </button>
      </form>
    </nav>
  )
}

function CharacterGallery({ query, onClear }) {
  const [characters, setCharacters] = useState([])
  const [pageInfo, setPageInfo] = useState(null)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({ page: String(page) })
    if (query) params.set('name', query)

    const fetchCharacters = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(
          `https://rickandmortyapi.com/api/character/?${params}`,
          { signal: controller.signal },
        )

        if (response.status === 404) {
          setCharacters([])
          setPageInfo(null)
          return
        }
        if (!response.ok) {
          throw new Error(`La API respondió con el estado ${response.status}.`)
        }

        const data = await response.json()
        setCharacters(data.results)
        setPageInfo(data.info)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError('No se pudieron cargar los personajes. Revisa tu conexión e inténtalo de nuevo.')
          setCharacters([])
          setPageInfo(null)
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    const debounceId = window.setTimeout(fetchCharacters, query ? 250 : 0)

    return () => {
      window.clearTimeout(debounceId)
      controller.abort()
    }
  }, [page, query, retryCount])

  function changePage(nextPage) {
    setPage(nextPage)
    document.getElementById('characters')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="characters-section" id="characters" aria-labelledby="characters-heading">
      <div className="characters-section__header">
        <div>
          <span className="characters-section__eyebrow">Explora el multiverso</span>
          <h1 className="characters-section__title" id="characters-heading">
            Personajes
          </h1>
          <p className="characters-section__description">
            Busca entre los habitantes de Rick y Morty y descubre sus historias.
          </p>
        </div>
        {pageInfo && (
          <span className="characters-section__count">
            {pageInfo.count} personajes
          </span>
        )}
      </div>

      {query && (
        <div className="characters-section__filter">
          <span>
            Resultados para <strong>“{query}”</strong>
          </span>
        </div>
      )}

      {isLoading && (
        <div className="characters-message" role="status">
          <span className="characters-message__spinner" aria-hidden="true" />
          Cargando personajes...
        </div>
      )}

      {!isLoading && error && (
        <div className="characters-message characters-message--error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setRetryCount((count) => count + 1)}>
            Intentar de nuevo
          </button>
        </div>
      )}

      {!isLoading && !error && characters.length === 0 && (
        <div className="characters-message">
          No se encontraron personajes{query ? ` con el nombre “${query}”` : ''}.
          {query && (
            <button type="button" onClick={() => {
              setPage(1)
                onClear()
            }}>
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}

      {!isLoading && !error && characters.length > 0 && (
        <>
          <div className="character-grid">
            {characters.map((character) => (
              <article className="character-card" key={character.id}>
                <div className="character-card__image-wrap">
                  <img
                    className="character-card__image"
                    src={character.image}
                    alt={character.name}
                    loading="lazy"
                  />
                  <span className={`character-card__status character-card__status--${character.status.toLowerCase()}`}>
                    <span />
                    {character.status === 'unknown' ? 'Desconocido' : character.status === 'Alive' ? 'Vivo' : 'Muerto'}
                  </span>
                </div>
                <div className="character-card__content">
                  <h2 className="character-card__name">{character.name}</h2>
                  <p className="character-card__species">
                    {character.species}{character.type ? ` · ${character.type}` : ''}
                  </p>
                  <dl className="character-card__details">
                    <div>
                      <dt>Género</dt>
                      <dd>{character.gender}</dd>
                    </div>
                    <div>
                      <dt>Última ubicación</dt>
                      <dd>{character.location.name}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>

          {pageInfo && pageInfo.pages > 1 && (
            <nav className="characters-pagination" aria-label="Paginación de personajes">
              <button
                type="button"
                onClick={() => changePage(page - 1)}
                disabled={!pageInfo.prev}
              >
                ← Anterior
              </button>
              <span>Página {page} de {pageInfo.pages}</span>
              <button
                type="button"
                onClick={() => changePage(page + 1)}
                disabled={!pageInfo.next}
              >
                Siguiente →
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  )
}

function ProgressBar() {
  const [percentage, setPercentage] = useState(10)

  function handlePercentageChange(event) {
    const value = Number(event.target.value)
    setPercentage(Math.min(100, Math.max(0, value || 0)))
  }

  return (
    <section
      className="progress-card"
      id="progress"
      aria-labelledby="progress-heading"
      style={{ '--progress-hue': `${percentage * 1.2}` }}
    >
      <span className="progress-card__eyebrow">Estado actual</span>
      <h2 className="progress-card__title" id="progress-heading">
        Progress bar
      </h2>
      <div
        className="progress"
        role="progressbar"
        aria-label="Progress"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={percentage}
      >
        <div className="progress__track">
          <div
            className="progress__fill"
            style={{ width: `${percentage}%` }}
          />
          <span
            className="progress__marker"
            style={{ left: `${percentage}%` }}
          >
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
            min="0"
            max="100"
            step="1"
            value={percentage}
            onChange={handlePercentageChange}
          />
          <span className="progress-card__unit">%</span>
        </div>
      </div>
    </section>
  )
}

function Timer() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return undefined

    const intervalId = window.setInterval(() => {
      setSeconds((currentSeconds) => currentSeconds + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isRunning])

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

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

      <output className="timer-card__display" aria-label={`${minutes} mins ${remainingSeconds} secs`}>
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
          onClick={() => {
            setIsRunning(false)
            setSeconds(0)
          }}
        >
          Reset
        </button>
      </div>
      <p className="timer-card__status" role="status">
        {isRunning ? 'El cronómetro está en marcha' : 'El cronómetro está detenido'}
      </p>
    </section>
  )
}

function PasswordGenerator() {
  const [length, setLength] = useState(10)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  })
  const [password, setPassword] = useState(() =>
    generatePassword(10, {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
    }),
  )
  const [copyStatus, setCopyStatus] = useState('')
  const [error, setError] = useState('')

  function updatePassword(nextLength, nextOptions) {
    try {
      setPassword(generatePassword(nextLength, nextOptions))
      setError('')
      setCopyStatus('')
    } catch {
      setError('No se pudo generar la contraseña. Inténtalo de nuevo.')
    }
  }

  function handleLengthChange(event) {
    const nextLength = Number(event.target.value)
    setLength(nextLength)
    updatePassword(nextLength, options)
  }

  function handleOptionChange(key) {
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
  const strengthScore =
    selectedOptionCount + Number(length >= 12) + Number(length >= 16)
  const strength = strengthScore <= 2
    ? 'Débil'
    : strengthScore <= 3
      ? 'Media'
      : strengthScore <= 4
        ? 'Fuerte'
        : 'Muy fuerte'
  const strengthClass = strength.toLowerCase().replace(' ', '-')

  return (
    <section className="password-card" id="password-generator" aria-labelledby="password-heading">
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

      <div className={`password-card__strength password-card__strength--${strengthClass}`}>
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
            min="6"
            max="32"
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
          {passwordOptions.map(({ key, label }) => (
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
        <p className={error ? 'password-card__message password-card__message--error' : 'password-card__message'} role="status">
          {error || copyStatus}
        </p>
      )}
    </section>
  )
}

function RegistrationForm() {
  const [submittedData, setSubmittedData] = useState(null)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username').trim()
    const fullName = formData.get('fullName').trim()
    const age = Number(formData.get('age'))

    if (!username || !fullName || !Number.isInteger(age) || age < 1 || age > 120) {
      setError('Completa todos los campos. La edad debe ser un número entre 1 y 120.')
      setSubmittedData(null)
      return
    }

    const requestData = {
      UserName: username.toUpperCase(),
      FullName: fullName.toUpperCase(),
      Age: age,
    }

    setError('')
    setSubmittedData(requestData)
    window.alert(JSON.stringify(requestData, null, 2))
  }

  return (
    <section className="registration-card" id="reto-3" aria-labelledby="registration-heading">
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
              min="1"
              max="120"
              step="1"
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

function App() {
  const [searchValue, setSearchValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <main className="navbar-page">
      <Navbar
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onSearch={setSearchQuery}
      />
      <CharacterGallery
        key={searchQuery}
        query={searchQuery}
        onClear={() => {
          setSearchValue('')
          setSearchQuery('')
        }}
      />
      <ProgressBar />
      <div className="tools-grid" id="tools">
        <Timer />
        <PasswordGenerator />
      </div>
      <RegistrationForm />
    </main>
  )
}

export default App
