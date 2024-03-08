// Suponiendo que este código está en `controllers/liquidez.js`
const Liquidez = require('../models/liquidez');

exports.calcularIndicadoresLiquidez = async (req, res) => {
    try {
        const { activoCorriente, pasivoCorriente, disponible, inversionesTemporales, deudores } = req.body;

        const razonCorriente = activoCorriente / pasivoCorriente;
        const pruebaAcida = (disponible + inversionesTemporales + deudores) / pasivoCorriente;

        return res.status(200).json({
            message: 'Indicadores de liquidez calculados correctamente',
            data: {
                razonCorriente,
            }
        });
    } catch (error) {
        console.error('Error al calcular los indicadores de liquidez:', error);
        return res.status(500).json({ message: 'Error al calcular los indicadores de liquidez', error: error.message });
    }
};
// INDICADORES DE LIQUIDEZ https://valor-software.com/ng2-charts/#LineChart
// https://valor-software.com/ng2-charts/#DynamicChart indicadores solvencia  DISTRIBUCIÓN DEL ACTIVO CORRIENTE https://www.highcharts.com/demo/stock/flags-general
// informe  https://valor-software.com/ng2-charts/#PieChart    