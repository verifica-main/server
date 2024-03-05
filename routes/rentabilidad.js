const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { calcularIndicadoresRentabilidad } = require('../controllers/rentabilidad'); // Asegúrate de que el controlador esté correctamente importado
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/calcular', [
    validarJWT,
    check('utilidadBruta', 'La utilidad bruta es obligatoria y debe ser un número').isNumeric(),
    check('ventasNetas', 'Las ventas netas son obligatorias y deben ser un número').isNumeric(),
    check('descuentos', 'Los descuentos son obligatorios y deben ser un número').isNumeric(),
    check('utilidadOperacional', 'La utilidad operacional es obligatoria y debe ser un número').isNumeric(),
    check('utilidadNeta', 'La utilidad neta es obligatoria y debe ser un número').isNumeric(),
    check('patrimonioLiquido', 'El patrimonio líquido es obligatorio y debe ser un número').isNumeric(),
    check('activoTotal', 'El activo total es obligatorio y debe ser un número').isNumeric(),
    validarCampos,
], calcularIndicadoresRentabilidad);

module.exports = router;
