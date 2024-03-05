const mongoose = require('mongoose');

/**
 * Establece una conexión con la base de datos MongoDB.
 * Asegúrate de que tu cadena de conexión sigue el formato recomendado.
 */
const dbConnection = async () => {
    try {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        // Asegúrate de que la cadena de conexión es la correcta según las últimas prácticas recomendadas.
        await mongoose.connect(process.env.DB_CNN, dbOptions);
        console.log('DB Online');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw new Error('Error a la hora de iniciar la BD. Ver logs.');
    }
};

module.exports = {
    dbConnection
};
