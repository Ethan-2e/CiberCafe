const mongoose = require('mongoose');

const incidenciaSchema = new mongoose.Schema({
  puesto: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true, trim: true },
  fecha: { type: String, required: true }
}, { timestamps: true, collection: 'incidencias' });

incidenciaSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Incidencia', incidenciaSchema);
