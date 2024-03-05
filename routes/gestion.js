const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { calcularIndicadoresGestion } = require('../controllers/gestion'); // Asegúrate de tener este controlador
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/calcular', [
    validarJWT,
    check('ventasNetas', 'Las ventas netas son obligatorias y deben ser un número').isNumeric(),
    check('patrimonioLiquido', 'El patrimonio líquido es obligatorio y debe ser un número').isNumeric(),
    check('activoTotal', 'El activo total es obligatorio y debe ser un número').isNumeric(),
    check('activoCorriente', 'El activo corriente es obligatorio y debe ser un número').isNumeric(),
    check('pasivoCorriente', 'El pasivo corriente es obligatorio y debe ser un número').isNumeric(),
    check('cuentasPorCobrarClientes', 'Las cuentas por cobrar clientes son obligatorias y deben ser un número').isNumeric(),
    validarCampos,
], calcularIndicadoresGestion);

module.exports = router;
