const { Gestion, Liquidez, Rentabilidad, Solvencia } = require('../models');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.calcularYGenerarPDF = async (req, res) => {
    try {
        const { gestionData, liquidezData, rentabilidadData, solvenciaData } = req.body;

        const resultadoGestion = new Gestion({
            ventasNetas: gestionData.ventasNetas,
            patrimonioLiquido: gestionData.patrimonioLiquido,
            activoTotal: gestionData.activoTotal,
            activoCorriente: gestionData.activoCorriente,
            pasivoCorriente: gestionData.pasivoCorriente,
            cuentasPorCobrarClientes: gestionData.cuentasPorCobrarClientes,
        });
        await resultadoGestion.save();

        const resultadoLiquidez = new Liquidez({
            activoCorriente: liquidezData.activoCorriente,
            pasivoCorriente: liquidezData.pasivoCorriente,
            disponible: liquidezData.disponible,
            inversionesTemporales: liquidezData.inversionesTemporales,
            deudores: liquidezData.deudores,
        });
        await resultadoLiquidez.save();

        const resultadoRentabilidad = new Rentabilidad({
            utilidadBruta: rentabilidadData.utilidadBruta,
            ventasNetas: rentabilidadData.ventasNetas,
            descuentos: rentabilidadData.descuentos,
            utilidadOperacional: rentabilidadData.utilidadOperacional,
            utilidadNeta: rentabilidadData.utilidadNeta,
            patrimonioLiquido: rentabilidadData.patrimonioLiquido,
            activoTotal: rentabilidadData.activoTotal,
        });
        await resultadoRentabilidad.save();

        const resultadoSolvencia = new Solvencia({
            totalPasivo: solvenciaData.totalPasivo,
            totalActivo: solvenciaData.totalActivo,
            pasivoCorriente: solvenciaData.pasivoCorriente,
            pasivoTotal: solvenciaData.pasivoTotal, // Asegurarse de que este campo esté definido
            ventasNetas: solvenciaData.ventasNetas,
            patrimonio: solvenciaData.patrimonio,
        });
        // console.log('=====>',resultadoSolvencia)
        await resultadoSolvencia.save();

        const filename = `Informe-Completo-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '..', 'pdfs', filename);

        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(filepath));

        doc.fontSize(16).text('Informe Completo', { align: 'center' });

        doc.moveDown().fontSize(14).text('Resultados de Gestión', { underline: true });
        doc.fontSize(10).list(Object.entries(resultadoGestion.toJSON()).map(([key, value]) => `${key}: ${value}`));

        doc.moveDown().fontSize(14).text('Resultados de Liquidez', { underline: true });
        doc.fontSize(10).list(Object.entries(resultadoLiquidez.toJSON()).map(([key, value]) => `${key}: ${value}`));

        doc.moveDown().fontSize(14).text('Resultados de Rentabilidad', { underline: true });
        doc.fontSize(10).list(Object.entries(resultadoRentabilidad.toJSON()).map(([key, value]) => `${key}: ${value}`));

        doc.moveDown().fontSize(14).text('Resultados de Solvencia', { underline: true });
        doc.fontSize(10).list(Object.entries(resultadoSolvencia.toJSON()).map(([key, value]) => `${key}: ${value}`));

        doc.end();

        doc.on('finish', () => {
            res.download(filepath, filename, (err) => {
                if (err) {
                    console.error('Error al enviar el archivo al cliente:', err);
                    return res.status(500).json({ message: 'Error al enviar el archivo al cliente', error: err.message });
                }
                fs.unlink(filepath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error al eliminar el archivo PDF:', unlinkErr);
                    }
                });
            });
        });
        
        res.send({ message: 'Operación terminada, el informe ha sido generado y enviado.' });


    } catch (error) {
        console.error('Error al calcular indicadores y generar el PDF:', error);
        res.status(500).json({ message: 'Error en la operación del servidor', error: error.message });
    }
};
