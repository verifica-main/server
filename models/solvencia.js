const mongoose = require('mongoose');

const solvenciaSchema = new mongoose.Schema({
  totalPasivo: { type: Number, required: true },
  totalActivo: { type: Number, required: true },
  pasivoCorriente: { type: Number, required: true },
  pasivoTotal: { type: Number, required: true },
  ventasNetas: { type: Number, required: true },
  patrimonio: { type: Number, required: true },
});

const Solvencia = mongoose.model('Solvencia', solvenciaSchema);

module.exports = Solvencia;
