const express = require('express');
const { crearArticle,  agregarComentario, listarArticulos, listarByGrado, listarByArea } = require('../controllers/ctrl_Article.js');
const { verifyToken } = require('../middleware/func_Users.js');
const multer = require('multer');
const subir = multer({ dest: 'subirfoto/' });
const articles = express.Router();

articles.post('/articulos', [verifyToken, subir.none()], crearArticle);
articles.post('/articulos/:id/comentario', agregarComentario);
articles.get('/articulos', listarArticulos);
articles.get('/articulos/grado/:grado', listarByGrado);
articles.get('/articulos/area/:area', listarByArea);

module.exports = articles;
