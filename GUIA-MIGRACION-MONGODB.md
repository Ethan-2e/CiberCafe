# Guía de migración a MongoDB — CiberCafé Nova

Documento de continuidad para retomar el trabajo en otra sesión.
Objetivo: conectar el proyecto a MongoDB y dejar funcionando la autenticación (login, roles y sesión), rumbo al Hito 3.

---

## 0. Respuestas clave antes de empezar

### ¿El proyecto consume una API?
Sí. Hoy el frontend ya consume una API con `fetch` contra `json-server`:

- `api.js:1` define `API_URL = 'http://100.51.163.177:3000'`.
- Consumo real: `index.js:7`, `index.js:73/84/95/206`, `nueva-sesion.js:5/40/46`, `sesiones.js:4/54/58`, `incidencias.js:4/11/54/57/78/83`, `detalle.js:13/48`.
- Inconsistencia: `reservas.js:2` apunta a otro host/puerto (`https://...:8080`) y está vacío.

Con la nueva arquitectura **se sigue consumiendo una API**: el navegador habla con Express (`/api/...`) y Express habla con MongoDB.
**El navegador nunca se conecta directo a MongoDB.**

### Alcance del trabajo
- Compañero: encriptación de contraseñas.
- Tú: conexión a MongoDB, modelos, endpoints de auth, cookie/JWT, middleware de roles, seed de usuarios y conectar el login del frontend.

Contrato para desacoplar la encriptación:

```js
// server/utils/password.js
const bcrypt = require('bcryptjs');
async function hashPassword(plano) { return bcrypt.hash(plano, 12); }
async function verifyPassword(plano, hash) { return bcrypt.compare(plano, hash); }
module.exports = { hashPassword, verifyPassword };
```

Tu login solo llama `verifyPassword(...)`; el seed/creación de usuarios solo llama `hashPassword(...)`.
Si el compañero entrega su propia implementación, solo reemplaza el interior de estas dos funciones.

### Decisiones tomadas
- Base de datos: **MongoDB Atlas** (cluster gratuito M0).
- Sesión/auth: **JWT en cookie `httpOnly`**.
- Cliente: **Usuario con rol `cliente`** (no colección separada).
- Frontend: se mantiene **HTML/CSS/JS vanilla** actual.
- Backend: **Node/Express + Mongoose**.

---

## Estado de avance

- [ ] Paso 1 — Crear cluster en MongoDB Atlas (EN CURSO)
- [ ] Paso 2 — Instalar dependencias del backend
- [ ] Paso 3 — Crear `.env` y `.gitignore`
- [ ] Paso 4 — Conexión a Mongo (`server/config/db.js`)
- [ ] Paso 5 — Modelo de usuario y modelos mínimos
- [ ] Paso 6 — Auth (middleware + rutas)
- [ ] Paso 7 — Arranque del servidor y scripts
- [ ] Paso 8 — Seed / migración de `db.json`
- [ ] Paso 9 — Conectar el frontend
- [ ] Paso 10 — Verificación
- [ ] Paso 11 — Despliegue en AWS

---

## Paso 1 — MongoDB Atlas

1. Crear cuenta en <https://cloud.mongodb.com>.
2. Crear un proyecto si no existe.
3. **Build a Database** → **M0 Free** → proveedor AWS.
4. En el asistente de creación aparece el paso **Create Database User**: crea usuario y contraseña de BD.
   (Es equivalente a `Database Access`.)
5. **Network Access** → `Add IP Address` → `0.0.0.0/0` (solo desarrollo) o la IP de la instancia AWS en producción.
6. **Connect → Drivers** → copiar la URI. Agregar el nombre de BD `cibercafe`:

```
mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/cibercafe?retryWrites=true&w=majority
```

### Dónde está `Database Access`
Está a nivel de **proyecto**, no dentro del clúster:

1. Barra lateral izquierda → sección **Security** → **Database Access**.
   - Si el menú está colapsado, pulsa el ícono de hamburguesa (☰) arriba a la izquierda.
2. Alternativa: desde el **cluster** → botón **Connect** → pestaña **Database Access** / "Create a database user".
3. Si estás en el asistente de creación del cluster M0, el paso **"Create Database User"** cumple la misma función.

Vecino a `Database Access` está `Network Access` (para autorizar IPs). Ambos aparecen juntos bajo **Security**.

---

## Paso 2 — Dependencias del backend

Desde `C:\Users\Vicente\Documents\CiberCafe`:

```powershell
npm install express mongoose dotenv cors cookie-parser jsonwebtoken bcryptjs helmet express-rate-limit
npm install -D nodemon
```

---

## Paso 3 — `.env` y `.gitignore`

`.gitignore`:

```
node_modules/
.env
```

`.env` (NO commitear):

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/cibercafe?retryWrites=true&w=majority
JWT_SECRET=una_clave_larga_y_aleatoria
CLIENT_ORIGIN=http://localhost:5500,http://100.51.163.177
```

Nota: hoy `node_modules/` está versionado en git. Conviene destrackearlo en un paso aparte.

---

## Paso 4 — Conexión a Mongo

`server/config/db.js`:

```js
const mongoose = require('mongoose');

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB conectado:', mongoose.connection.name);
}

module.exports = connectDB;
```

---

## Paso 5 — Modelo de usuario y modelos mínimos

`server/models/Usuario.js`:

```js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  rol: { type: String, enum: ['cliente', 'operador', 'administrador'], default: 'cliente' },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

usuarioSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
```

Modelos mínimos para migrar los datos actuales (`Computador`, `Sesion`, `Incidencia`) con el mismo patrón de `toJSON` para exponer `id`.
Usar `codigo` como identificador del computador (`G01`...). Después se agregan `Sala`, `Tarifa` y `Reserva`.

---

## Paso 6 — Auth (middleware + rutas)

`server/middleware/auth.js`:

```js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

async function autenticar(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'No autenticado' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(payload.sub);
    if (!usuario || !usuario.activo) return res.status(401).json({ error: 'Sesión inválida' });
    req.usuario = usuario;
    next();
  } catch {
    return res.status(401).json({ error: 'Sesión inválida' });
  }
}

function autorizar(...roles) {
  return (req, res, next) =>
    roles.includes(req.usuario.rol)
      ? next()
      : res.status(403).json({ error: 'Sin permisos' });
}

module.exports = { autenticar, autorizar };
```

`server/routes/auth.routes.js`:

```js
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { verifyPassword } = require('../utils/password');
const { autenticar } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email: String(email).toLowerCase().trim() });
  if (!usuario || !usuario.activo) return res.status(401).json({ error: 'Credenciales inválidas' });
  const ok = await verifyPassword(password, usuario.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
  const token = jwt.sign(
    { sub: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 8 * 60 * 60 * 1000
  });
  res.json({ usuario });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

router.get('/me', autenticar, (req, res) => res.json({ usuario: req.usuario }));

module.exports = router;
```

---

## Paso 7 — Arranque del servidor y scripts

`server/index.js`:

```js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_ORIGIN.split(','), credentials: true }));

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, db: mongoose.connection.readyState === 1 }));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
connectDB().then(() => app.listen(PORT, () => console.log(`API en puerto ${PORT}`)));
```

`package.json` — scripts:

```json
"scripts": {
  "api": "json-server --watch db.json --port 3001",
  "server": "node server/index.js",
  "dev": "nodemon server/index.js",
  "seed": "node server/seed/seed.js"
}
```

---

## Paso 8 — Seed / migración de `db.json`

`server/seed/seed.js` debe:

1. Leer `db.json`.
2. Crear salas `General`, `Gamer`, `Grupal`.
3. Insertar los 30 computadores con `codigo: c.id`, `sala`, `estado`, `motivo`.
4. Crear 3 usuarios demo con `hashPassword(...)`:
   - `admin@cibercafe.cl` / `Admin1234` (`administrador`)
   - `operador@cibercafe.cl` / `Operador1234` (`operador`)
   - `cliente@cibercafe.cl` / `Cliente1234` (`cliente`)
5. Opcional: migrar `sesiones` e `incidencias` respetando el nuevo esquema.
6. Cerrar conexión.

Ejecutar:

```powershell
npm run seed
npm run dev
```

---

## Paso 9 — Conectar el frontend

- `api.js`: cambiar a `export const API_URL = 'http://localhost:3000/api';` (en producción, `/api`).
- Crear `api-client.js`:

```js
import { API_URL } from './api.js';

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (res.status === 401) {
    window.location.href = 'login.html';
    return;
  }
  if (!res.ok) throw new Error((await res.json()).error || 'Error de API');
  return res.json();
}
```

- `login.js`: reemplazar el login falso por `POST /auth/login`.
- `layout.js`: llamar `GET /auth/me` al cargar; si falla, redirigir a `login.html`; ocultar opciones del menú según `rol`.
- Quitar la lógica de `usuarioLogueado` como “seguridad”.

---

## Paso 10 — Verificación

1. `GET http://localhost:3000/api/health` → `{ ok: true, db: true }`.
2. `POST /api/auth/login` con `admin@cibercafe.cl` → responde usuario y `Set-Cookie: token=...`.
3. `GET /api/auth/me` con esa cookie → devuelve el usuario.
4. Login desde la web → redirige y `/me` funciona.
5. Usuario con rol cliente intentando endpoint de admin → `403`.

---

## Paso 11 — Despliegue en AWS

- MongoDB Atlas: permitir la IP de la instancia.
- Servicio systemd para `node server/index.js` con `EnvironmentFile=/var/www/html/project/.env`.
- Apache/Nginx: proxy `/api` → `http://127.0.0.1:3000/api` (evita CORS y problemas de cookies).
- En producción: `NODE_ENV=production` y HTTPS para que la cookie `secure` funcione.

---

## Notas y pendientes

- No commitear `.env` ni credenciales de Atlas.
- `node_modules/` está versionado hoy; destrackearlo aparte con `.gitignore`.
- `json-server` puede quedar temporalmente en otro puerto mientras migras y eliminarse al terminar.
- Definir con el compañero si él entrega `server/utils/password.js` o solo el algoritmo.
- Después de esta fase: reservas con anti-superposición, sesiones con monto/tarifa, administración CRUD completa, historial/resumen y “Mi actividad”.
