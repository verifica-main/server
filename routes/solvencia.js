/*
    Ruta: /api/solvencia
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { calcularIndicadoresSolvencia } = require('../controllers/solvencias'); 
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/calcular-solvencia', [
    // validarJWT,
    check('totalPasivo', 'El total del pasivo es obligatorio y debe ser un número').isNumeric(),
    check('totalActivo', 'El total del activo es obligatorio y debe ser un número').isNumeric(),
    check('pasivoCorriente', 'El pasivo corriente es obligatorio y debe ser un número').isNumeric(),
    check('pasivoTotal', 'El pasivo total es obligatorio y debe ser un número').isNumeric(),
    check('ventasNetas', 'Las ventas netas son obligatorias y deben ser un número').isNumeric(),
    check('patrimonio', 'El patrimonio es obligatorio y debe ser un número').isNumeric(),
    validarCampos,
], calcularIndicadoresSolvencia);

module.exports = router;
