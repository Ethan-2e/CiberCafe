const mongoose = require('mongoose');

const sesionSchema = new mongoose.Schema({
  puesto: { type: String, required: true, trim: true },
  cliente: { type: String, required: true, trim: true },
  inicio: { type: String, required: true }
}, { timestamps: true, collection: 'sesiones' });

sesionSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Sesion', sesionSchema);
