// En tu controlador de gestión, digamos gestion.controller.js

const Gestion = require('../models/gestion');

exports.calcularIndicadoresGestion = async (req, res) => {
    try {
        const { ventasNetas, patrimonioLiquido, activoTotal, activoCorriente, pasivoCorriente, cuentasPorCobrarClientes } = req.body;

        // Suponiendo validaciones de existencia de los campos...

        // Cálculos
        const indicadores = {
            rotacionPatrimonioLiquido: ventasNetas / patrimonioLiquido,
            rotacionActivoTotal: ventasNetas / activoTotal,
            rotacionCapitalTrabajo: ventasNetas / (activoCorriente - pasivoCorriente),
            rotacionCartera: ventasNetas / cuentasPorCobrarClientes,
            periodoCobro: 365 / (ventasNetas / cuentasPorCobrarClientes)
        };

        // Guardar en la base de datos, si es necesario...

        // Devolver los indicadores calculados
        res.json({ message: "Indicadores calculados exitosamente", indicadores });
    } catch (error) {
        console.error('Error en el controlador de gestión:', error);
        res.status(500).json({ message: 'Error al calcular los indicadores de gestión', error: error.message });
    }
};
