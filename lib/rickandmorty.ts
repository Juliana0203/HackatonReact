const API_URL = 'https://rickandmortyapi.com/api/character'

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown'

export interface NamedResource {
  name: string
  url: string
}

export interface Character {
  id: number
  name: string
  status: CharacterStatus
  species: string
  type: string
  gender: string
  origin: NamedResource
  location: NamedResource
  image: string
  episode: string[]
  url: string
  created: string
}

export interface PageInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface CharactersResponse {
  info: PageInfo
  results: Character[]
}

interface CharacterQuery {
  name?: string
  page?: number
}

/** Returns `null` when the API reports no characters for the filter (404). */
export async function getCharacters({
  name,
  page = 1,
}: CharacterQuery): Promise<CharactersResponse | null> {
  const params = new URLSearchParams({ page: String(page) })
  if (name) params.set('name', name)

  const response = await fetch(`${API_URL}?${params}`, {
    next: { revalidate: 3600 },
  })

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(`Rick and Morty API responded with ${response.status}`)
  }

  return (await response.json()) as CharactersResponse
}
