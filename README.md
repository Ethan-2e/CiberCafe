# CiberCafé Nova - Panel de administración

Panel web para administrar los equipos de un cibercafé con 30 computadores
repartidos en tres salas. Proyecto del curso Desarrollo web y movil, Universidad Diego Portales.

## Funcionalidades

- Inicio y cierre de sesión (simulado).
- Resumen de equipos por estado: disponible, en uso, reservado y fuera de servicio.
- Filtros por estado, por sala y búsqueda por código.
- Detalle de cada computador y cambio de su estado.
- Agregar y eliminar computadores en cada sala.
- Al actualizar la página, los datos vuelven al estado inicial.

## Tecnologías

React, Vite, Node.js, JSON, HTML y CSS.

## Cómo ejecutarlo

Requiere Node.js instalado.

```bash
cd frontend
npm install
npm run dev
```

Luego abre http://localhost:5173 en el navegador.

Para generar la versión final: `npm run build` (queda en `frontend/dist`).

## Estructura

- `frontend/src/App.jsx`: componente principal, guarda el estado.
- `frontend/src/components/`: las piezas de la interfaz (Login, Resumen, Filtros, Sala, Puesto, Detalle).
- `frontend/src/data/pcs.json`: las salas y los 30 computadores.
- `frontend/src/styles.css`: estilos de toda la página.

## Limitaciones

- No hay servidor ni base de datos: los cambios no se guardan.
- El inicio de sesión es una simulación, sin validación real.

## Equipo

Ethan Pérez.
