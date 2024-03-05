const mongoose = require('mongoose');

const liquidezSchema = new mongoose.Schema({
  activoCorriente: { type: Number, required: true },
  pasivoCorriente: { type: Number, required: true },
  disponible: { type: Number, required: true },
  inversionesTemporales: { type: Number, required: true },
  deudores: { type: Number, required: true },
});

const Liquidez = mongoose.model('Liquidez', liquidezSchema);

module.exports = Liquidez;
