const mongoose = require('mongoose');

const rentabilidadSchema = new mongoose.Schema({
  utilidadBruta: { type: Number, required: true },
  ventasNetas: { type: Number, required: true },
  descuentos: { type: Number, required: true },
  utilidadOperacional: { type: Number, required: true },
  utilidadNeta: { type: Number, required: true },
  patrimonioLiquido: { type: Number, required: true },
  activoTotal: { type: Number, required: true },
});

const Rentabilidad = mongoose.model('Rentabilidad', rentabilidadSchema);

module.exports = Rentabilidad;
