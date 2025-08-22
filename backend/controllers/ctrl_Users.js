const mongoose = require('mongoose');
const secret = require('../config/configSecret.js');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const Users = mongoose.model('Users');

const signup = async (req, res) => {
  console.log("req.body:", req.body); // campos de texto
  console.log("req.file:", req.file); // archivo subido
  try {
    const photoBuffer = fs.readFileSync(req.file.path); 
    const mimeType = req.file.mimetype;

    // Eliminar archivo temporal
    fs.unlinkSync(req.file.path);

    // Crear usuario
    const user = new Users({
      fullname: req.body.fullname,
      email: req.body.email,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      schoolGrade: req.body.schoolGrade,
      description: req.body.description,
      photo: photoBuffer,
      mime: mimeType,
    });

    await user.save();

    console.log('Usuario registrado exitosamente!');
    res.status(200).json({
      status_code: 200,
      status_message: 'OK',
      body_message: 'Usuario registrado exitosamente!',
    });
  } catch (err) {
    console.error('Error al registrar al usuario:', err);
    res.status(500).json({
      status_code: 500,
      status_message: 'Server error',
      body_message: err.message || err,
    });
  }
};

const signin = async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({
        status_code: 404,
        status_message: 'Not found',
        body_message: 'El usuario no existe...!',
      });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        status_code: 401,
        status_message: 'Unauthorized',
        body_message: 'Contraseña Incorrecta...!',
      });
    }

    const token = jsonwebtoken.sign({ id: user._id }, secret, { expiresIn: 86400 });
    req.session.token = token;

    res.status(200).json({
      status_code: 200,
      status_message: 'Ok',
      body_message: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Error en iniciar sesión:', err);
    res.status(500).json({
      status_code: 500,
      status_message: 'Internal Server Error',
      body_message: err.message || err,
    });
  }
};

const signout = async (req, res) => {
  try {
    req.session = null;
    console.log('El usuario cerro sesión Satisfactoriamente...!');
    res.status(200).json({
      status_code: 200,
      status_message: 'OK',
      body_message: 'El usuario cerro sesión Satisfactoriamente...!',
    });
  } catch (err) {
    console.error('Error en cerrar sesión:', err);
    res.status(500).json({
      status_code: 500,
      status_message: 'Error en cerrar sesión',
      body_message: err.message || err,
    });
  }
};

const getUser = async (req, res) => {
  const email = req.params.email;

  try {
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        status_code: 404,
        status_message: "Not Found",
        content: { error: "Usuario no encontrado" }
      });
    }

    res.status(200).json({
      status_code: 200,
      status_message: "OK",
      content: {
        fullname: user.fullname,
        email: user.email,
        photo: user.photo.toString("base64"),
        mime: user.mime,
      }
    });

  } catch (error) {
    res.status(500).json({
      status_code: 500,
      status_message: "Internal Server Error",
      content: { error: error.toString() }
    });
  }
};


const getUserPhoto = async (req, res) => {
    const email = req.params.email;

    try {
        const user = await Users.findOne({ email: email });

        if (!user || !user.photo) {
          return res.status(404).send("Foto no encontrada");
        }

        res.writeHead(200, {
            "Content-Type": user.mime,
            "Content-Length": user.photo.length
        });
        res.end(user.photo);

    } catch (error) {
        res.status(500).json({
            status_code: 500,
            status_message: "Internal Server Error",
            content: { error: error.toString() }
        });
    }
};

module.exports = {
  signup,
  signin,
  signout,
  getUser,
  getUserPhoto
};