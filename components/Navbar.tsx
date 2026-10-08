export function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <a className="navbar__brand" href="#progress">
        Hackaton
      </a>

      <div className="navbar__links">
        <a className="navbar__link navbar__link--active" href="#progress" aria-current="page">
          Progreso
        </a>
        <a className="navbar__link" href="#tools">
          Herramientas
        </a>
        <a className="navbar__link" href="#reto-3">
          Reto 3
        </a>
      </div>
    </nav>
  )
}