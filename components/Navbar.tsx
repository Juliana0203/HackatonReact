import Link from 'next/link'

interface NavbarProps {
  query: string
}

export function Navbar({ query }: NavbarProps) {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link className="navbar__brand" href="/#characters">
        R&amp;M Explorer
      </Link>

      <div className="navbar__links">
        <a
          className="navbar__link navbar__link--active"
          href="#characters"
          aria-current="page"
        >
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

      {/* A plain GET form: the search works without client-side JavaScript. */}
      <form className="navbar__search" action="/" method="get" role="search">
        <label className="visually-hidden" htmlFor="site-search">
          Buscar personajes por nombre
        </label>
        <input
          key={query}
          id="site-search"
          className="navbar__input"
          type="search"
          name="q"
          placeholder="Buscar personaje..."
          defaultValue={query}
        />
        <button className="navbar__button" type="submit">
          Buscar
        </button>
      </form>
    </nav>
  )
}
