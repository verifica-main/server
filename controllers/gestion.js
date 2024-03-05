const Gestion = require('../models/gestion');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.calcularIndicadoresGestion = async (req, res) => {
    try {
        console.log('Inicio del proceso de cálculo de indicadores de gestión.');
        const { ventasNetas, patrimonioLiquido, activoTotal, activoCorriente, pasivoCorriente, cuentasPorCobrarClientes } = req.body;

        if (!ventasNetas || !patrimonioLiquido || !activoTotal || !activoCorriente || !pasivoCorriente || !cuentasPorCobrarClientes) {
            console.error('Error: Falta algún campo requerido para el cálculo.');
            return res.status(400).json({ message: 'Todos los campos son necesarios para calcular los indicadores de gestión.' });
        }

        // Realizar cálculos...
        const rotacionPatrimonioLiquido = ventasNetas / patrimonioLiquido;
        const rotacionActivoTotal = ventasNetas / activoTotal;
        const rotacionCapitalTrabajo = ventasNetas / (activoCorriente - pasivoCorriente);
        const rotacionCartera = ventasNetas / cuentasPorCobrarClientes;
        const periodoCobro = 365 / rotacionCartera;

        // Guardar en la base de datos...
        const nuevaGestion = new Gestion({
            ventasNetas,
            patrimonioLiquido,
            activoTotal,
            activoCorriente,
            pasivoCorriente,
            cuentasPorCobrarClientes
        });

        await nuevaGestion.save();
        console.log('Datos de gestión guardados correctamente.');

        // Generar el documento PDF...
        const filename = `Gestion-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '..', 'pdfs', filename);

        console.log('Generando el documento PDF...');
        const doc = new PDFDocument();
        const output = fs.createWriteStream(filepath);
        doc.pipe(output);
        
        doc.fontSize(12).text('Informe de Gestión', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`Rotación del Patrimonio Líquido: ${rotacionPatrimonioLiquido.toFixed(2)}`);
        doc.text(`Rotación del Activo Total: ${rotacionActivoTotal.toFixed(2)}`);
        doc.text(`Rotación del Capital de Trabajo: ${rotacionCapitalTrabajo.toFixed(2)}`);
        doc.text(`Rotación de Cartera: ${rotacionCartera.toFixed(2)}`);
        doc.text(`Período de Cobro: ${periodoCobro.toFixed(2)} días`);
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
        console.error('Error en el controlador de gestión:', error);
        res.status(500).json({ message: 'Error al calcular los indicadores de gestión y generar el PDF', error: error.message });
    }
};
