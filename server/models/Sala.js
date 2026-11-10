const mongoose = require('mongoose');

const salaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true, collection: 'salas' });

salaSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Sala', salaSchema);
