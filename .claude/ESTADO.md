# Estado del proyecto - amerisa-spacex-dashboard
_Ultima actualizacion: 2026-09-14 00:30_

## Hecho
- Landing page agregada en `/` y dashboard movido a `/app`, aprobado y verificado en navegador (desktop y mobile 375px) y con `npm run build` limpio.
  - `src/App.jsx`: shell de router (`BrowserRouter` + `Routes`), incluye ruta catch-all `path="*"` -> `Navigate to="/"` (ver Decisiones).
  - `src/pages/Dashboard.jsx`: contenido integro que antes vivia en `App.jsx` (tabla, filtros, mapa, PDF), sin cambios de logica, solo imports relativos ajustados (`../components`, `../data`, `../services`).
  - `src/pages/Landing.jsx`: portada tipo case-study (referencia: https://kyb-customs-platform.vercel.app/) con badge "Prueba tecnica", CTA "Abrir demo" -> `/app`, boton "Ver codigo" -> https://github.com/legongoraek/amerisa-spacex-dashboard, tarjeta de funcionalidades.
  - `vercel.json` nuevo con rewrite SPA (`/(.*) -> /index.html`) para que `/app` no de 404 en Vercel al recargar o entrar por link directo.
  - `package.json`: se agrego `react-router-dom` (^7.18.3).
  - `.claude/launch.json` nuevo (config para `preview_start` del Browser tool: `npm run dev` en puerto 5173).
- Code review (skill `code-review`, nivel high) sobre el diff: 1 hallazgo CONFIRMED y corregido -> faltaba ruta catch-all en el router, por lo que cualquier URL invalida (typo, bookmark viejo) quedaba en pantalla blanca en vez de redirigir. Ya arreglado con `<Route path="*" element={<Navigate to="/" replace />} />` en `src/App.jsx`.
- Verificado manualmente en navegador: `/` (landing), click "Abrir demo" -> `/app` (dashboard funcional), recarga directa en `/app`, `/app/` con slash final, y `/random-page` (redirige a `/` tras el fix). Sin errores de consola en los archivos nuevos.
- `npm run lint`: los archivos nuevos/tocados (`App.jsx`, `Landing.jsx`, `Dashboard.jsx`) estan limpios. Quedan 8 errores preexistentes en `src/components/LaunchDetail.jsx` (no tocado en esta tarea) - ver Pendiente.

## En curso
- Nada a medias. La tarea de la landing page quedo completa y verificada.

## Pendiente
1. Revisar y hacer commit de los cambios (todavia no se hizo `git add`/`git commit`; se uso `git add -N` solo para generar el diff de revision, sin stage real de contenido).
2. Tarea aparte, ya delegada como sugerencia (task_id `task_249ac8bd`, no bloqueante para esto): arreglar `src/components/LaunchDetail.jsx` (preexistente, sin relacion con la landing):
   - `InfoRow` esta declarado dentro del render de `LaunchDetail` (~linea 24), causando 8 errores de lint `react-hooks/static-components`. Hay que moverlo fuera del componente.
   - El `Stack` en linea ~46-47 usa `justifyContent`/`alignItems` como props directas (patron que en este proyecto rompe y tira warnings de consola); moverlas a `sx={{...}}` como ya se hace en `Dashboard.jsx`.
3. Opcional/no pedido aun: `src/App.css` quedo huerfano desde antes de esta tarea (no se importa en ningun lado, ver `src/main.jsx`); no se toco por estar fuera de alcance.

## Decisiones y contexto
- El proyecto es real: prueba tecnica para vacante de Desarrollador en Amerisa Logistics (ver README.md). Repo: https://github.com/legongoraek/amerisa-spacex-dashboard.
- El pedido original del usuario ("no veo su landing page") NO era un bug: el deploy de Vercel funcionaba bien, solo no existia una portada previa al dashboard. Se confirmo con el usuario via preguntas antes de tocar codigo (flujo `superpowers:brainstorming`, clasificado como tarea "bounded" por ser un cambio acotado sobre un flujo ya existente en el repo).
- Se descarto usar `src/assets/hero.png` como imagen de la landing: es un placeholder generico (icono 3D morado) sin relacion con SpaceX/Amerisa.
- Se eligio `react-router-dom` (en vez de un `if` manual sobre `window.location.pathname`) porque el usuario pidio explicitamente un patron de rutas `/` y `/app` como en su referencia (kyb-customs-platform.vercel.app), y es el estandar para este caso en React + Vite.
- El `vercel.json` con rewrite catch-all es necesario en Vercel para SPAs con client-side routing; sin el, `/app` cargado directo (o recargado) hubiera dado 404 nativo de Vercel. Justo por agregar ese rewrite, sin una ruta `*` en el router cualquier URL invalida hubiera quedado en blanco en vez de 404 -> de ahi el fix del catch-all en `App.jsx`.

## Siguiente paso concreto
Revisar el diff (`git status` / `git diff`) y decidir si se hace commit de estos cambios; si el usuario aprueba, hacer `git add` de los archivos relevantes (`package.json`, `package-lock.json`, `src/App.jsx`, `src/pages/`, `vercel.json`; opcionalmente `.claude/launch.json` y `.claude/ESTADO.md`) y commitear.
