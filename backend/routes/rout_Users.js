const express = require('express');
const { signup, signin, signout,getUser,getUserPhoto } = require('../controllers/ctrl_Users.js');
const { verifyToken ,verifyRol, verifyDuplicates, isRoot,isAdmin,isUser, } = require('../middleware/func_Users.js');
const multer = require('multer');
const subir = multer({ dest: 'subirfoto/' });

const users = express.Router();

users.post('/signup', [subir.single('photo'), verifyDuplicates], signup);
users.post('/signin',signin);
users.post('/signout', signout);
users.get('/getuser/:email', getUser);
users.get('/useruserphoto/:email', getUserPhoto);

module.exports = users;