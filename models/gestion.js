const mongoose = require('mongoose');

const gestionSchema = new mongoose.Schema({
  ventasNetas: { type: Number, required: true },
  patrimonioLiquido: { type: Number, required: true },
  activoTotal: { type: Number, required: true },
  activoCorriente: { type: Number, required: true },
  pasivoCorriente: { type: Number, required: true },
  cuentasPorCobrarClientes: { type: Number, required: true },
});

const Gestion = mongoose.model('Gestion', gestionSchema);

module.exports = Gestion;
