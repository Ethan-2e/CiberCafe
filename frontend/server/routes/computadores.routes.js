const router = require('express').Router();
const Computador = require('../models/Computador');
const { autenticar, autorizar } = require('../middleware/auth');

router.use(autenticar);

const CODIGO_RE = /^[GPE]\d{2,}$/;

router.get('/', async (req, res) => {
  try {
    const filtro = {};
    if (req.query.estado) filtro.estado = req.query.estado;
    const lista = await Computador.find(filtro).sort({ codigo: 1 });
    return res.json(lista);
  } catch (error) {
    console.error('Error al listar computadores:', error);
    return res.status(500).json({ error: 'Error al listar computadores' });
  }
});

router.get('/:codigo', async (req, res) => {
  try {
    const equipo = await Computador.findOne({ codigo: req.params.codigo.toUpperCase() });
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });
    return res.json(equipo);
  } catch (error) {
    console.error('Error al obtener computador:', error);
    return res.status(500).json({ error: 'Error al obtener computador' });
  }
});

router.post('/', autorizar('operador', 'administrador'), async (req, res) => {
  try {
    const body = req.body || {};
    const codigo = String(body.codigo || body.id || '').trim().toUpperCase();
    const { sala, estado = 'disponible', motivo = '' } = body;

    if (!CODIGO_RE.test(codigo)) {
      return res.status(400).json({ error: 'Código inválido. Usa G01, P01 o E01.' });
    }
    if (!sala) return res.status(400).json({ error: 'Falta la sala' });

    const existe = await Computador.findOne({ codigo });
    if (existe) return res.status(409).json({ error: 'El código ya existe' });

    const creado = await Computador.create({ codigo, sala, estado, motivo });
    return res.status(201).json(creado);
  } catch (error) {
    console.error('Error al crear computador:', error);
    return res.status(500).json({ error: 'Error al crear computador' });
  }
});

router.patch('/:codigo', autorizar('operador', 'administrador'), async (req, res) => {
  try {
    const body = req.body || {};
    const campos = {};
    if (body.estado !== undefined) campos.estado = body.estado;
    if (body.motivo !== undefined) campos.motivo = body.motivo;
    if (body.sala !== undefined) campos.sala = body.sala;

    if (Object.keys(campos).length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    const actualizado = await Computador.findOneAndUpdate(
      { codigo: req.params.codigo.toUpperCase() },
      { $set: campos },
      { new: true, runValidators: true }
    );

    if (!actualizado) return res.status(404).json({ error: 'Equipo no encontrado' });
    return res.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar computador:', error);
    return res.status(400).json({ error: 'Error al actualizar computador' });
  }
});

router.delete('/:codigo', autorizar('operador', 'administrador'), async (req, res) => {
  try {
    const eliminado = await Computador.findOneAndDelete({
      codigo: req.params.codigo.toUpperCase()
    });
    if (!eliminado) return res.status(404).json({ error: 'Equipo no encontrado' });
    return res.json({ ok: true });
  } catch (error) {
    console.error('Error al eliminar computador:', error);
    return res.status(500).json({ error: 'Error al eliminar computador' });
  }
});

module.exports = router;
