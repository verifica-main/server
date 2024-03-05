const Liquidez = require('../models/liquidez');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.calcularIndicadoresLiquidez = async (req, res) => {
    try {
        console.log('Inicio del proceso de cálculo de indicadores de liquidez.');
        const { activoCorriente, pasivoCorriente, disponible, inversionesTemporales, deudores } = req.body;

        if (!activoCorriente || !pasivoCorriente || !disponible || !inversionesTemporales || !deudores) {
            console.error('Error: Falta algún campo requerido para el cálculo.');
            return res.status(400).json({ message: 'Todos los campos son necesarios para calcular los indicadores de liquidez.' });
        }

        const razonCorriente = activoCorriente / pasivoCorriente;
        const pruebaAcida = (disponible + inversionesTemporales + deudores) / pasivoCorriente;

        console.log('Realizando cálculos y guardando en la base de datos...');
        const nuevaLiquidez = new Liquidez({
            activoCorriente,
            pasivoCorriente,
            disponible,
            inversionesTemporales,
            deudores,
            razonCorriente,
            pruebaAcida
        });

        await nuevaLiquidez.save();
        console.log('Datos de liquidez guardados correctamente.');

        const filename = `Liquidez-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '..', 'pdfs', filename);

        console.log('Generando el documento PDF...');
        const doc = new PDFDocument();
        const output = fs.createWriteStream(filepath);
        doc.pipe(output);
        
        doc.fontSize(12).text('Informe de Liquidez', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`Razón Corriente: ${razonCorriente.toFixed(2)}`);
        doc.text(`Prueba Ácida: ${pruebaAcida.toFixed(2)}`);
        doc.end();

        output.on('finish', () => {
            console.log(`Documento PDF generado: ${filename}`);
            res.download(filepath, filename, (err) => {
                if (err) {
                    console.error('Error al enviar el archivo al cliente:', err);
                } else {
                    console.log(`Documento PDF enviado al cliente: ${filename}`);
                }
                console.log('Eliminando el documento PDF...');
                fs.unlink(filepath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error al eliminar el archivo PDF:', unlinkErr);
                    } else {
                        console.log(`Documento PDF eliminado con éxito: ${filename}`);
                    }
                });
            });
        });

        output.on('error', (err) => {
            console.error('Error al escribir el PDF en el sistema de archivos:', err);
            res.status(500).json({ message: 'Error al escribir el documento PDF.' });
        });

    } catch (error) {
        console.error('Error en el controlador de liquidez:', error);
        res.status(500).json({ message: 'Error al calcular los indicadores de liquidez y generar el PDF', error: error.message });
    }
};
