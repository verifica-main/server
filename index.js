require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');
const corsOptions = {
    origin: 'http://localhost:4200', 
    optionsSuccessStatus: 200,
    credentials: true,
  };

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors(corsOptions)); 

// Lectura y parseo del body
app.use( express.json() );

// Base de datos
dbConnection();

// Directorio público
app.use( express.static('public') );


// Rutas
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/liquidez', require('./routes/liquidez') );
app.use( '/api/solvencia', require('./routes/solvencia') );
app.use( '/api/gestion', require('./routes/gestion') );
app.use( '/api/rentabilidad', require('./routes/rentabilidad') );
app.use( '/api/result', require('./routes/result') );
// app.use( '/api/todo', require('./routes/busquedas') );
app.use( '/api/login', require('./routes/auth') );
// app.use( '/api/upload', require('./routes/uploads') );

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
});

