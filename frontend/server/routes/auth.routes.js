const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { hashPassword, verifyPassword } = require('../utils/password');
const { autenticar } = require('../middleware/auth');
const opcionesCookie = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.COOKIE_SECURE === 'true'
};

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan email o contraseña' });
    }

    const usuario = await Usuario.findOne({ email: String(email).toLowerCase().trim() });
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const ok = await verifyPassword(password, usuario.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { sub: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('token', token, { ...opcionesCookie, maxAge: 8 * 60 * 60 * 1000 });

    return res.json({ usuario });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body || {};

    const nombreLimpio = String(nombre || '').trim();
    const emailLimpio = String(email || '').toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nombreLimpio.length < 2 || nombreLimpio.length > 60) {
      return res.status(400).json({ error: 'El nombre debe tener entre 2 y 60 caracteres' });
    }
    if (!emailRegex.test(emailLimpio)) {
      return res.status(400).json({ error: 'Correo electrónico inválido' });
    }
    if (typeof password !== 'string' || password.length < 8 || password.length > 72) {
      return res.status(400).json({ error: 'La contraseña debe tener entre 8 y 72 caracteres' });
    }

    const existe = await Usuario.findOne({ email: emailLimpio });
    if (existe) {
      return res.status(409).json({ error: 'Ese correo ya está registrado' });
    }

    const passwordHash = await hashPassword(password);
    const usuario = await Usuario.create({
      nombre: nombreLimpio,
      email: emailLimpio,
      passwordHash,
      rol: 'cliente'
    });

    return res.status(201).json({ usuario });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Ese correo ya está registrado' });
    }
    console.error('Error en registro:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', opcionesCookie);
  res.json({ ok: true });
});

router.get('/me', autenticar, (req, res) => res.json({ usuario: req.usuario }));

module.exports = router;
