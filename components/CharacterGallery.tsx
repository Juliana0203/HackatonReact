import Image from 'next/image'
import Link from 'next/link'
import {
  getCharacters,
  type CharactersResponse,
  type CharacterStatus,
} from '@/lib/rickandmorty'

interface CharacterGalleryProps {
  query: string
  page: number
}

const statusLabels: Record<CharacterStatus, string> = {
  Alive: 'Vivo',
  Dead: 'Muerto',
  unknown: 'Desconocido',
}

function buildHref(query: string, page: number): string {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (page > 1) params.set('page', String(page))
  const search = params.toString()
  return `/${search ? `?${search}` : ''}#characters`
}

export function CharacterGalleryFallback() {
  return (
    <section className="characters-section" id="characters">
      <div className="characters-message" role="status">
        <span className="characters-message__spinner" aria-hidden="true" />
        Cargando personajes...
      </div>
    </section>
  )
}

export async function CharacterGallery({ query, page }: CharacterGalleryProps) {
  let data: CharactersResponse | null = null
  let hasError = false

  try {
    data = await getCharacters({ name: query, page })
  } catch {
    hasError = true
  }

  const characters = data?.results ?? []
  const info = data?.info

  return (
    <section
      className="characters-section"
      id="characters"
      aria-labelledby="characters-heading"
    >
      <div className="characters-section__header">
        <div>
          <span className="characters-section__eyebrow">
            Explora el multiverso
          </span>
          <h1 className="characters-section__title" id="characters-heading">
            Personajes
          </h1>
          <p className="characters-section__description">
            Busca entre los habitantes de Rick y Morty y descubre sus
            historias.
          </p>
        </div>
        {info && (
          <span className="characters-section__count">
            {info.count} personajes
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

      {hasError && (
        <div className="characters-message characters-message--error" role="alert">
          <p>
            No se pudieron cargar los personajes. Revisa tu conexión e
            inténtalo de nuevo.
          </p>
          <Link href={buildHref(query, page)}>
            Intentar de nuevo
          </Link>
        </div>
      )}

      {!hasError && characters.length === 0 && (
        <div className="characters-message">
          No se encontraron personajes
          {query ? ` con el nombre “${query}”` : ''}.
          {(query || page > 1) && (
            <Link href="/#characters">
              Limpiar búsqueda
            </Link>
          )}
        </div>
      )}

      {characters.length > 0 && (
        <>
          <div className="character-grid">
            {characters.map((character) => (
              <article className="character-card" key={character.id}>
                <div className="character-card__image-wrap">
                  <Image
                    className="character-card__image"
                    src={character.image}
                    alt={character.name}
                    fill
                    sizes="(max-width: 440px) 40vw, (max-width: 760px) 50vw, (max-width: 1080px) 33vw, 280px"
                  />
                  <span
                    className={`character-card__status character-card__status--${character.status.toLowerCase()}`}
                  >
                    <span />
                    {statusLabels[character.status]}
                  </span>
                </div>
                <div className="character-card__content">
                  <h2 className="character-card__name">{character.name}</h2>
                  <p className="character-card__species">
                    {character.species}
                    {character.type ? ` · ${character.type}` : ''}
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

          {info && info.pages > 1 && (
            <nav
              className="characters-pagination"
              aria-label="Paginación de personajes"
            >
              {info.prev ? (
                <Link href={buildHref(query, page - 1)}>← Anterior</Link>
              ) : (
                <span aria-disabled="true">← Anterior</span>
              )}
              <span>
                Página {page} de {info.pages}
              </span>
              {info.next ? (
                <Link href={buildHref(query, page + 1)}>Siguiente →</Link>
              ) : (
                <span aria-disabled="true">Siguiente →</span>
              )}
            </nav>
          )}
        </>
      )}
    </section>
  )
}

