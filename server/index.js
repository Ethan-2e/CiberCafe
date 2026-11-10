require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const computadoresRoutes = require('./routes/computadores.routes');
const sesionesRoutes = require('./routes/sesiones.routes');
const incidenciasRoutes = require('./routes/incidencias.routes');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const origenes = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: origenes.length > 0 ? origenes : true,
  credentials: true
}));

const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intenta de nuevo más tarde.' }
});

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, db: mongoose.connection.readyState === 1 })
);

app.use('/api/auth/login', limiteLogin);
app.use('/api/auth', authRoutes);
app.use('/api/computadores', computadoresRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/incidencias', incidenciasRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API en http://localhost:${PORT}/api`));
  })
  .catch((error) => {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  });
