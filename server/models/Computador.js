const mongoose = require('mongoose');

const computadorSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true, trim: true, uppercase: true },
  sala: { type: String, required: true, trim: true },
  estado: { type: String, enum: ['disponible', 'en_uso', 'falla'], default: 'disponible' },
  motivo: { type: String, default: '', trim: true }
}, { timestamps: true, collection: 'computadores' });

computadorSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret.codigo;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Computador', computadorSchema);
