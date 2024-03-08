const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { calcularYGenerarPDF } = require('../controllers/result'); 
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/generate', [
    validarJWT,
    // Validaciones para Gestión
    check('gestionData.ventasNetas', 'Las ventas netas de gestión son obligatorias y deben ser un número').isNumeric(),
    check('gestionData.patrimonioLiquido', 'El patrimonio líquido de gestión es obligatorio y debe ser un número').isNumeric(),
    check('gestionData.activoTotal', 'El activo total de gestión es obligatorio y debe ser un número').isNumeric(),
    check('gestionData.activoCorriente', 'El activo corriente de gestión es obligatorio y debe ser un número').isNumeric(),
    check('gestionData.pasivoCorriente', 'El pasivo corriente de gestión es obligatorio y debe ser un número').isNumeric(),
    check('gestionData.cuentasPorCobrarClientes', 'Las cuentas por cobrar a clientes de gestión son obligatorias y deben ser un número').isNumeric(),
    // Validaciones para Liquidez
    check('liquidezData.activoCorriente', 'El activo corriente de liquidez es obligatorio y debe ser un número').isNumeric(),
    check('liquidezData.pasivoCorriente', 'El pasivo corriente de liquidez es obligatorio y debe ser un número').isNumeric(),
    check('liquidezData.disponible', 'El disponible de liquidez es obligatorio y debe ser un número').isNumeric(),
    check('liquidezData.inversionesTemporales', 'Las inversiones temporales de liquidez son obligatorias y deben ser un número').isNumeric(),
    check('liquidezData.deudores', 'Los deudores de liquidez son obligatorios y deben ser un número').isNumeric(),
    // Validaciones para Rentabilidad
    check('rentabilidadData.utilidadBruta', 'La utilidad bruta de rentabilidad es obligatoria y debe ser un número').isNumeric(),
    check('rentabilidadData.ventasNetas', 'Las ventas netas de rentabilidad son obligatorias y deben ser un número').isNumeric(),
    check('rentabilidadData.descuentos', 'Los descuentos de rentabilidad son obligatorios y deben ser un número').isNumeric(),
    check('rentabilidadData.utilidadOperacional', 'La utilidad operacional de rentabilidad es obligatoria y debe ser un número').isNumeric(),
    check('rentabilidadData.utilidadNeta', 'La utilidad neta de rentabilidad es obligatoria y debe ser un número').isNumeric(),
    check('rentabilidadData.patrimonioLiquido', 'El patrimonio líquido de rentabilidad es obligatorio y debe ser un número').isNumeric(),
    check('rentabilidadData.activoTotal', 'El activo total de rentabilidad es obligatorio y debe ser un número').isNumeric(),
    // Validaciones para Solvencia
    check('solvenciaData.totalPasivo', 'El total pasivo de solvencia es obligatorio y debe ser un número').isNumeric(),
    check('solvenciaData.totalActivo', 'El total activo de solvencia es obligatorio y debe ser un número').isNumeric(),
    check('solvenciaData.pasivoCorriente', 'El pasivo corriente de solvencia es obligatorio y debe ser un número').isNumeric(),
    check('solvenciaData.pasivoTotal', 'El pasivo total de solvencia es obligatorio y debe ser un número').isNumeric(),
    check('solvenciaData.ventasNetas', 'Las ventas netas de solvencia son obligatorias y deben ser un número').isNumeric(),
    check('solvenciaData.patrimonio', 'El patrimonio de solvencia es obligatorio y debe ser un número').isNumeric(),
    validarCampos,
], calcularYGenerarPDF);

module.exports = router;
