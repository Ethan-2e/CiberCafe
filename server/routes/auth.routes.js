const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { verifyPassword } = require('../utils/password');
const { autenticar } = require('../middleware/auth');

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

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000
    });

    return res.json({ usuario });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

router.get('/me', autenticar, (req, res) => res.json({ usuario: req.usuario }));

module.exports = router;
