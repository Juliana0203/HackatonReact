# R&M Explorer · Hackaton

Aplicación **Next.js (App Router) + TypeScript** que explora los personajes de [Rick and Morty](https://rickandmortyapi.com/documentation#rest) e integra los retos del hackathon.

## Contenido

- **Navbar** con búsqueda por nombre (formulario GET, funciona vía URL: `/?q=morty&page=2`).
- **Listado de personajes** renderizado en el servidor, con paginación y estados de carga, vacío y error.
- **Progress bar** cuyo color cambia de rojo a verde según el porcentaje.
- **Timer** con Start / Stop / Reset.
- **Password generator** con longitud, tipos de caracteres, fortaleza y copiado.
- **Reto 3**: formulario de registro con validación y `alert` con el JSON (demo, sin base de datos).

## Estructura

```
app/          layout, página principal y estilos globales
components/   Navbar, CharacterGallery (servidor) y componentes interactivos (cliente)
lib/          cliente tipado de la API y lógica del generador de contraseñas
```

## Requisitos

- Node.js 20.9 o superior

## Scripts

```bash
npm install
npm run dev        # desarrollo en http://localhost:3000
npm run build      # build de producción (incluye type-check)
npm start          # servir el build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```
