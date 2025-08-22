/*
========================================================================================
Centro....: Universidad Técnica Nacional
Sede......: Pacífico
Carrera...: Tecnologías de Información
Curso.....: ITI-523 - Tecnologías y Sistemas Web II
Periodo...: 2-2025
Documento.: Semana 11 - Práctica 03
Tema......: API REST con NodeJS, Express y MongoDB
Objetivos.: Crear una API REST que permita gestionar imágenes almacenadas en MongoDB.          
Profesor..: Jorge Ruiz (york)
Estudiante: Esteban Amores and Laura Montero
========================================================================================
*/
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');

// crear la aplicacion 
const app = express();

// Configuración CORS para tu frontend (ajusta el origen si es necesario)
const corsOptions = {
  origin: 'http://localhost:5000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Middleware para parsear JSON y urlencoded, Parsear JSON y urlencoded
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


// Habilitar Helmet para seguridad HTTP
app.use(helmet());

// Configurar cookie-session correctamente para CommonJS
const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
const cookieKey = require('./config/cookieSecret.js');
app.use(
  cookieSession({
    name: 'L&E-session',
    keys: [cookieKey], // OJO: Debes usar una clave secreta real y ponerla en variable de entorno
    httpOnly: true,
    expires: expiryDate,
  })
);

// Importar variables de conexión
const dbConfig = require('./config/configDB.js');
mongoose.connect(`mongodb://${dbConfig.USER}:${dbConfig.PASS}@${dbConfig.HOST}/`, { dbName: dbConfig.DB });

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', err => {
    console.error('MongoDB error de coneccion:', err);
});

mongoose.connection.on('Desconectado', () => {
    console.warn('MongoDB Desconectado');
});

// Cargar modelos 
require('./models/mdl_Article.js');
require('./models/mdl_Users.js');

// Rutas
const indexRouter = require('./routes/rout_Index.js');
const categoriesRouter = require('./routes/rout_Article.js');
const usersRouter = require('./routes/rout_Users.js');

app.use('/', indexRouter);
app.use('/articulos', categoriesRouter);
app.use('/users', usersRouter);


// Ejecutar servidor
const server = app.listen(5000, () => {
    console.log(`Server escuchando en el puerto ${server.address().port}`);
});