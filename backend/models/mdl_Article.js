var mongoose = require("mongoose");

var schArticle = new mongoose.Schema({
  title: { type: String, required: [true, "This field is required"] },
  area: { type: String, required: [true, "This field is required"] },
  gradoAcademico: { type: String, required: [true, "This field is required"] },
  description: {
    type: String,
    required: [true, "This field is required"],
    maxlength: 500,
  },
  pdfUrl: { type: String, required: [true, "This field is required"] },
  images: {
    type: [{ url: String }],
    validate: {
      validator: function (v) {
        return v.length >= 4 && v.length <= 6;
      },
      message: "You must provide between 4 and 6 images.",
    },
  },
  conclusion: {
    type: String,
    required: [true, "This field is required"],
    maxlength: 500,
  },
  recommendations: {
    type: String,
    required: [true, "This field is required"],
    maxlength: 500,
  },
  author: {
    type: String,
    required: [true, "This field is required"],
  },
  comments: [
    {
      comment: {
        type: String,
        maxlength: [100, "El comentario no puede tener más de 100 caracteres"],
      },
      score: {
        type: Number,
        min: [1, "La puntuación mínima es 1"],
        max: [5, "La puntuación máxima es 5"],
      },
      author: { type: String, required: [true, "Debes escribir tu nombre"] },
    },
  ],
});

mongoose.model("Articles", schArticle);
