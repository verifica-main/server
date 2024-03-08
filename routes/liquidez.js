/*
    Ruta: /api/liquidez
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { calcularIndicadoresLiquidez } = require('../controllers/liquidez');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/calcular', [
    // validarJWT,
    check('activoCorriente', 'El activo corriente es obligatorio y debe ser un número').isNumeric(),
    check('pasivoCorriente', 'El pasivo corriente es obligatorio y debe ser un número').isNumeric(),
    check('disponible', 'El disponible es obligatorio y debe ser un número').isNumeric(),
    check('inversionesTemporales', 'Las inversiones temporales son obligatorias y deben ser un número').isNumeric(),
    check('deudores', 'Los deudores son obligatorios y deben ser un número').isNumeric(),
    validarCampos,
], calcularIndicadoresLiquidez);

module.exports = router;
