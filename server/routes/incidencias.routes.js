const router = require('express').Router();
const Incidencia = require('../models/Incidencia');
const Computador = require('../models/Computador');
const { autenticar, autorizar } = require('../middleware/auth');

router.use(autenticar);

router.get('/', async (req, res) => {
  try {
    const lista = await Incidencia.find().sort({ createdAt: 1 });
    return res.json(lista);
  } catch (error) {
    console.error('Error al listar incidencias:', error);
    return res.status(500).json({ error: 'Error al listar incidencias' });
  }
});

router.post('/', autorizar('operador', 'administrador'), async (req, res) => {
  try {
    const body = req.body || {};
    const { puesto, descripcion } = body;
    if (!puesto || !descripcion) {
      return res.status(400).json({ error: 'Faltan puesto o descripción' });
    }

    const equipo = await Computador.findOne({ codigo: String(puesto).toUpperCase() });
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });

    const fecha = body.fecha || new Date().toLocaleString();
    const incidencia = await Incidencia.create({
      puesto: equipo.codigo,
      descripcion,
      fecha
    });

    await Computador.updateOne(
      { codigo: equipo.codigo },
      { $set: { estado: 'falla', motivo: descripcion } }
    );

    return res.status(201).json(incidencia);
  } catch (error) {
    console.error('Error al crear incidencia:', error);
    return res.status(500).json({ error: 'Error al crear incidencia' });
  }
});

router.delete('/:id', autorizar('operador', 'administrador'), async (req, res) => {
  try {
    const incidencia = await Incidencia.findByIdAndDelete(req.params.id);
    if (!incidencia) return res.status(404).json({ error: 'Incidencia no encontrada' });

    await Computador.updateOne(
      { codigo: incidencia.puesto },
      { $set: { estado: 'disponible', motivo: '' } }
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error('Error al eliminar incidencia:', error);
    return res.status(500).json({ error: 'Error al eliminar incidencia' });
  }
});

module.exports = router;
