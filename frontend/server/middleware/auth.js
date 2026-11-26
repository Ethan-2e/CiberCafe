const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

async function autenticar(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'No autenticado' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(payload.sub);
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: 'Sesión inválida' });
    }

    req.usuario = usuario;
    return next();
  } catch {
    return res.status(401).json({ error: 'Sesión inválida' });
  }
}

function autorizar(...roles) {
  return (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ error: 'No autenticado' });
    return roles.includes(req.usuario.rol)
      ? next()
      : res.status(403).json({ error: 'Sin permisos' });
  };
}

module.exports = { autenticar, autorizar };
