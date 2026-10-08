# R&M Explorer

Aplicación React para explorar y buscar personajes de Rick and Morty. Los datos
se consultan desde la [Rick and Morty API](https://rickandmortyapi.com/documentation).

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Desarrollo

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev`: inicia el servidor local de desarrollo.
- `npm run build`: crea la versión de producción en `dist`.
- `npm run preview`: sirve localmente la versión compilada.
- `npm run lint`: ejecuta Oxlint.

## Funcionalidades

- Catálogo de personajes con búsqueda por nombre y paginación.
- Barra de progreso con valor y color ajustables.
- Cronómetro con controles de inicio, pausa y reinicio.
- Generador criptográfico de contraseñas con opciones configurables.
- Formulario de demostración con validación y vista previa JSON.

La aplicación consume la API pública directamente desde el navegador. El
formulario es una demostración local y no guarda datos en una base de datos.
