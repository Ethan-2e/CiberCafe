# Continuar migración — desde el Paso 3

Estado actual del proyecto:

- Node.js instalado (`node -v` → v26.13.0).
- Dependencias instaladas (`npm install` ejecutado).
- Backend Express/Mongoose creado en `server/`.
- Frontend migrado a `http://localhost:3000/api` con cookies JWT.
- `node_modules/` destrackeado de git.
- `.env` creado con `MONGODB_URI` ya configurada (sin mostrar credenciales).
- Código verificado con MongoDB temporal: seed, login, `/me`, CRUD, sesiones, incidencias y 403 por rol funcionaron.

---

## Paso 3 — Verificar el `.env`

Archivo: `/Users/valeee/Documents/CiberCafe/.env`

Debe contener algo así (con tus datos reales, sin los signos `< >`):

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/cibercafe?retryWrites=true&w=majority
JWT_SECRET=una_cadena_larga
CLIENT_ORIGIN=http://localhost:5500,http://localhost:3000,http://100.51.163.177
```

Comprobaciones:

- La URI termina en `/cibercafe?...`.
- La contraseña está reemplazada (si tiene `@ : / ? # %`, debe estar codificada: `@` → `%40`).
- El usuario de Atlas tiene permisos sobre la BD `cibercafe`.
- En Atlas, **Network Access** permite tu IP o `0.0.0.0/0` (desarrollo).

---

## Paso 4 — Cargar los datos

```bash
cd /Users/valeee/Documents/CiberCafe
npm run seed
```

Salida esperada:

```
MongoDB conectado: cibercafe
Salas listas: General, Gamer, Grupal
Computadores migrados: 30
Usuarios demo listos: admin@cibercafe.cl, operador@cibercafe.cl, cliente@cibercafe.cl
Sesiones migradas: 2
Incidencias migradas: 2
Seed completado.
```

---

## Paso 5 — Levantar la API (terminal 1)

```bash
cd /Users/valeee/Documents/CiberCafe
npm run dev
```

Salida esperada:

```
MongoDB conectado: cibercafe
API en http://localhost:3000/api
```

Verificación rápida en otra terminal:

```bash
curl http://localhost:3000/api/health
```

Respuesta esperada:

```json
{"ok":true,"db":true}
```

---

## Paso 6 — Servir el frontend (terminal 2)

```bash
cd /Users/valeee/Documents/CiberCafe
python3 -m http.server 5500
```

Alternativa en VS Code: usar **Live Server** en el puerto 5500.

Abrir siempre:

```
http://localhost:5500/login.html
```

No usar `file://` ni `127.0.0.1`, porque la cookie de sesión no funcionará igual.

---

## Paso 7 — Probar en el navegador

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@cibercafe.cl` | `Admin1234` |
| Operador | `operador@cibercafe.cl` | `Operador1234` |
| Cliente | `cliente@cibercafe.cl` | `Cliente1234` |

Pruebas mínimas:

1. Login admin → redirige a `index.html`.
2. El panel muestra los 30 equipos desde MongoDB.
3. Crear un equipo, eliminarlo, cambiar estado en detalle.
4. Iniciar una sesión y finalizarla.
5. Registrar y eliminar una incidencia.
6. Cerrar sesión.
7. Login con `cliente@cibercafe.cl`: solo ve el panel, sin menú de gestión.

---

## Paso 8 — Commit cuando todo funcione

```bash
cd /Users/valeee/Documents/CiberCafe
git add .
git commit -m "Migracion a MongoDB con autenticacion JWT"
```

`node_modules/` queda eliminado del repo y `.env` no se sube por estar en `.gitignore`.

---

## Problemas comunes

| Síntoma | Solución |
|---|---|
| `Falta MONGODB_URI` | El `.env` no está en la raíz o tiene otro nombre. |
| `MongooseServerSelectionError` | IP no autorizada en Atlas o URI mal escrita. |
| `Authentication failed` | Usuario/contraseña incorrectos o contraseña sin codificar. |
| No se puede iniciar sesión | No se ejecutó `npm run seed`. |
| La cookie no persiste | Abrir el frontend en `http://localhost:5500`, no en `file://` ni `127.0.0.1`. |

---

## Pendiente fuera de esta fase

- `reservas.html` / `reservas.js` siguen vacíos y no se enlazan desde el menú.
- Despliegue en AWS: proxy `/api` → `http://127.0.0.1:3000/api`, `NODE_ENV=production` y HTTPS.
