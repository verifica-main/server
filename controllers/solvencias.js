const Solvencia = require('../models/solvencia');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.calcularIndicadoresSolvencia = async (req, res) => {
    try {
        console.log('Inicio del proceso de cálculo de indicadores de solvencia.');
        const { totalPasivo, totalActivo, pasivoCorriente, pasivoTotal, ventasNetas, patrimonio } = req.body;

        if (!totalPasivo || !totalActivo || !pasivoCorriente || !pasivoTotal || !ventasNetas || !patrimonio) {
            console.error('Error: Falta algún campo requerido para el cálculo.');
            return res.status(400).json({ message: 'Todos los campos son necesarios para calcular los indicadores de solvencia.' });
        }

        const nivelEndeudamiento = totalPasivo / totalActivo;
        const concentracionEndeudamientoCortoPlazo = pasivoCorriente / pasivoTotal;
        const endeudamientoVentas = pasivoTotal / ventasNetas;
        const multiplicadorCapital = totalActivo / patrimonio;

        const nuevaSolvencia = new Solvencia({
            totalPasivo,
            totalActivo,
            pasivoCorriente,
            pasivoTotal,
            ventasNetas,
            patrimonio,
            nivelEndeudamiento,
            concentracionEndeudamientoCortoPlazo,
            endeudamientoVentas,
            multiplicadorCapital
        });

        await nuevaSolvencia.save();
        console.log('Los datos de solvencia han sido guardados en la base de datos.');

        const filename = `Solvencia-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '..', 'pdfs', filename);

        console.log('Comenzando la generación del documento PDF.');
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);
        
        doc.fontSize(12).text('Informe de Solvencia', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`Nivel de Endeudamiento: ${nivelEndeudamiento.toFixed(2)}`);
        doc.text(`Concentración de Endeudamiento a Corto Plazo: ${concentracionEndeudamientoCortoPlazo.toFixed(2)}`);
        doc.text(`Endeudamiento / Ventas: ${endeudamientoVentas.toFixed(2)}`);
        doc.text(`Multiplicador de Capital: ${multiplicadorCapital.toFixed(2)}`);
        doc.end();

        stream.on('finish', () => {
            console.log(`Documento PDF generado: ${filename}`);
            res.download(filepath, filename, (err) => {
                if (err) {
                    console.error('Hubo un error al enviar el archivo al cliente:', err);
                } else {
                    console.log(`Documento PDF enviado al cliente: ${filename}`);
                }
                fs.unlink(filepath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Hubo un error al eliminar el archivo PDF:', unlinkErr);
                    } else {
                        console.log(`Documento PDF eliminado: ${filename}`);
                    }
                });
            });
        });

        stream.on('error', (err) => {
            console.error('Error al escribir el PDF en el sistema de archivos:', err);
            res.status(500).json({ message: 'Error al escribir el documento PDF.' });
        });

    } catch (error) {
        console.error('Error en el controlador de solvencia:', error);
        res.status(500).json({ message: 'Error al calcular los indicadores de solvencia y generar el PDF', error: error.message });
    }
};
