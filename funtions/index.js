require('dotenv').config();

const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const { dbConnection } = require('../database/config');
const corsOptions = {
    origin: 'http://localhost:4200', 
    optionsSuccessStatus: 200,
    credentials: true,
  };

const app = express();
app.use(cors(corsOptions)); 
app.use( express.json() );
dbConnection();
app.use( express.static('public') );
let port = process.env.PORT || 5000

// Rutas
app.use( '/api/usuarios', require('../routes/usuarios') );
app.use( '/api/liquidez', require('../routes/liquidez') );
app.use( '/api/solvencia', require('../routes/solvencia') );
app.use( '/api/gestion', require('../routes/gestion') );
app.use( '/api/rentabilidad', require('../routes/rentabilidad') );
app.use( '/api/result', require('../routes/result') );
// app.use( '/api/todo', require('./routes/busquedas') );
app.use( '/api/login', require('../routes/auth') );
// app.use( '/api/upload', require('./routes/uploads') );

const handler = serverless(app);
// app.listen(port)


module.exports = { handler };

