const mongoose = require("mongoose");
const Article = mongoose.model("Articles");

const crearArticle = async (req, res) => {
  try {
    // Desestructurar los campos del body
    const {
      title,
      area,
      gradoAcademico,
      description,
      pdfUrl,
      images,          // Recibido como string: url1,caption1;url2,caption2;...
      conclusion,
      recommendations,
      authorName
    } = req.body;

    // Parsear las imágenes a array de objetos
    let imagesArray = [];
    if (images) {
      imagesArray = images.split(";").map(item => {
        const [url] = item.split(",");
        return { url: url.trim(),};
      });
    }

    // Validación: entre 4 y 6 imágenes
    if (imagesArray.length < 4 || imagesArray.length > 6) {
      return res.status(400).json({
        status_code: 400,
        status_message: "Error de validación",
        body_message: "Debes enviar entre 4 y 6 imágenes"
      });
    }

    // Crear la nueva instancia del artículo
    const nuevoArticulo = new Article({
      title,
      area,
      gradoAcademico,
      description,
      pdfUrl,
      images: imagesArray,
      conclusion,
      recommendations,
      author: authorName
    });

    // Guardar en la base de datos
    const articuloGuardado = await nuevoArticulo.save();

    res.status(201).json({
      status_code: 201,
      status_message: "Artículo creado con éxito",
      data: articuloGuardado
    });

  } catch (err) {
    console.error("Error al crear artículo:", err);

    // Manejo de errores de validación de Mongoose
    if (err.name === "ValidationError") {
      const errores = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        status_code: 400,
        status_message: "Error de validación",
        errors: errores
      });
    }

    res.status(500).json({
      status_code: 500,
      status_message: "Error del servidor",
      body_message: err.message || err
    });
  }
};

module.exports = { crearArticle };

const agregarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, score, author } = req.body;

    // Validaciones
    if (!author || author.trim().length === 0) {
      return res.status(400).json({
        status_code: 400,
        status_message: "Debes escribir tu nombre como autor del comentario.",
      });
    }

    if (!comment || comment.length > 100) {
      return res.status(400).json({
        status_code: 400,
        status_message: "El comentario no puede tener más de 100 caracteres",
      });
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({
        status_code: 400,
        status_message: "La puntuación debe estar entre 1 y 5",
      });
    }

    const articulo = await Article.findById(id);
    if (!articulo) {
      return res.status(404).json({
        status_code: 404,
        status_message: "Artículo no encontrado",
      });
    }

    // Agregar comentario
    articulo.comments.push({ comment, score, author });
    await articulo.save();

    res.status(200).json({
      status_code: 200,
      status_message: "Comentario agregado correctamente",
      data: articulo,
    });
  } catch (err) {
    console.error("Error al agregar comentario:", err);
    res.status(500).json({
      status_code: 500,
      status_message: "Error del servidor",
      body_message: err.message || err,
    });
  }
};

const listarArticulos = async (req, res) => {
  try {
    const articulos = await Article.find({}).sort({ title: 1 });
    res.status(200).json({
      status_code: 200,
      status_message: "Ok",
      data: articulos,
    });
  } catch (err) {
    console.error("Error al listar artículos:", err);
    res.status(500).json({
      status_code: 500,
      status_message: "Server error",
      body_message: err.message || err,
    });
  }
};

const listarByGrado = async (req, res) => {
  try {
    const gradoAcademico = req.params.grado;

    if (!gradoAcademico) {
      return res.status(400).json({
        status_code: 400,
        status_message: "Falta el parámetro gradoAcademico",
      });
    }

    const articulos = await Article.find({ gradoAcademico });

    res.status(200).json({
      status_code: 200,
      status_message: "Ok",
      data: articulos,
    });
  } catch (err) {
    console.error("Error al listar por grado:", err);
    res.status(500).json({
      status_code: 500,
      status_message: "Server error",
      body_message: err.message || err,
    });
  }
};

const listarByArea = async (req, res) => {
  try {
    const area = req.params.area;

    if (!area) {
      return res.status(400).json({
        status_code: 400,
        status_message: "Falta el parámetro area",
      });
    }

    const articulos = await Article.find({ area });

    res.status(200).json({
      status_code: 200,
      status_message: "Ok",
      data: articulos,
    });
  } catch (err) {
    console.error("Error al listar por área:", err);
    res.status(500).json({
      status_code: 500,
      status_message: "Server error",
      body_message: err.message || err,
    });
  }
};

module.exports = {
  crearArticle,
  agregarComentario,
  listarArticulos,
  listarByGrado,
  listarByArea,
};
