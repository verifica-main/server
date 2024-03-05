const Rentabilidad = require('../models/rentabilidad'); // Asegúrate de que la ruta del modelo es correcta
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.calcularIndicadoresRentabilidad = async (req, res) => {
    try {
        console.log('Inicio del proceso de cálculo de indicadores de rentabilidad.');
        const { utilidadBruta, ventasNetas, descuentos, utilidadOperacional, utilidadNeta, patrimonioLiquido, activoTotal } = req.body;

        if (!utilidadBruta || !ventasNetas || descuentos === undefined || !utilidadOperacional || !utilidadNeta || !patrimonioLiquido || !activoTotal) {
            console.error('Error: Falta algún campo requerido para el cálculo.');
            return res.status(400).json({ message: 'Todos los campos son necesarios para calcular los indicadores de rentabilidad.' });
        }

        // Cálculos de rentabilidad
        const rentabilidadBruta = (utilidadBruta / ventasNetas) - descuentos;
        const rentabilidadOperacional = utilidadOperacional / ventasNetas;
        const rentabilidadNeta = utilidadNeta / ventasNetas;
        const rentabilidadPatrimonio = utilidadNeta / patrimonioLiquido;
        const rentabilidadActivoTotal = utilidadNeta / activoTotal;

        // Guardar en la base de datos
        const nuevaRentabilidad = new Rentabilidad({
            utilidadBruta,
            ventasNetas,
            descuentos,
            utilidadOperacional,
            utilidadNeta,
            patrimonioLiquido,
            activoTotal
        });

        await nuevaRentabilidad.save();
        console.log('Datos de rentabilidad guardados correctamente.');

        // Generar el documento PDF
        const filename = `Rentabilidad-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '..', 'pdfs', filename);

        console.log('Generando el documento PDF...');
        const doc = new PDFDocument();
        const output = fs.createWriteStream(filepath);
        doc.pipe(output);
        
        doc.fontSize(12).text('Informe de Rentabilidad', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`Rentabilidad Bruta: ${rentabilidadBruta.toFixed(2)}`);
        doc.text(`Rentabilidad Operacional: ${rentabilidadOperacional.toFixed(2)}`);
        doc.text(`Rentabilidad Neta: ${rentabilidadNeta.toFixed(2)}`);
        doc.text(`Rentabilidad del Patrimonio: ${rentabilidadPatrimonio.toFixed(2)}`);
        doc.text(`Rentabilidad del Activo Total: ${rentabilidadActivoTotal.toFixed(2)}`);
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
        console.error('Error en el controlador de rentabilidad:', error);
        res.status(500).json({ message: 'Error al calcular los indicadores de rentabilidad y generar el PDF', error: error.message });
    }
};
