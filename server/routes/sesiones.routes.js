const router = require('express').Router();
const Sesion = require('../models/Sesion');
const Computador = require('../models/Computador');
const { autenticar, autorizar } = require('../middleware/auth');

router.use(autenticar);

router.get('/', async (req, res) => {
  try {
    const lista = await Sesion.find().sort({ createdAt: 1 });
    return res.json(lista);
  } catch (error) {
    console.error('Error al listar sesiones:', error);
    return res.status(500).json({ error: 'Error al listar sesiones' });
  }
});

router.post('/', autorizar('operador', 'administrador'), async (req, res) => {
  try {
    const { puesto, cliente, inicio } = req.body || {};
    if (!puesto || !cliente) {
      return res.status(400).json({ error: 'Faltan puesto o cliente' });
    }

    const equipo = await Computador.findOne({ codigo: String(puesto).toUpperCase() });
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });
    if (equipo.estado !== 'disponible') {
      return res.status(409).json({ error: 'El equipo no está disponible' });
    }

    const ahora = new Date();
    const hora = inicio
      || `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;

    const sesion = await Sesion.create({ puesto: equipo.codigo, cliente, inicio: hora });

    await Computador.updateOne(
      { codigo: equipo.codigo },
      { $set: { estado: 'en_uso', motivo: 'Inicio de sesión' } }
    );

    return res.status(201).json(sesion);
  } catch (error) {
    console.error('Error al crear sesión:', error);
    return res.status(500).json({ error: 'Error al crear sesión' });
  }
});

router.delete('/:id', autorizar('operador', 'administrador'), async (req, res) => {
  try {
    const sesion = await Sesion.findByIdAndDelete(req.params.id);
    if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });

    await Computador.updateOne(
      { codigo: sesion.puesto },
      { $set: { estado: 'disponible', motivo: '' } }
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error('Error al finalizar sesión:', error);
    return res.status(500).json({ error: 'Error al finalizar sesión' });
  }
});

module.exports = router;
