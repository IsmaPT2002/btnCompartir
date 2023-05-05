const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const upload = multer({ dest: 'public/images' });

// Configuración de la carpeta de archivos estáticos
app.use(express.static('public'));

// Ruta para mostrar el formulario
app.get('/', function(req, res) {
  const formHTML = `
    <form action="/share" method="post" enctype="multipart/form-data">
      <label for="text">Texto:</label>
      <input type="text" id="text" name="text"><br><br>
      <label for="image">Imagen:</label>
      <input type="file" id="image" name="image"><br><br>
      <input type="submit" value="Compartir">
    </form>
  `;

  // Envío del archivo HTML al navegador
  res.send(formHTML);
});

// Ruta para manejar el envío del formulario
app.post('/share', upload.single('image'), function(req, res) {
  // Manejo de la carga de la imagen
  const imageFile = req.file;
  if (!imageFile) {
    return res.status(400).send('No se ha enviado ningún archivo de imagen');
  }
  const imagePath = path.join(__dirname, '/public/images/', imageFile.filename);
  fs.renameSync(req.file.path, imagePath);

  // Preparación de los datos para publicar en Instagram
  const formData = new FormData();
  formData.append('image', fs.createReadStream(imagePath), { filename: imageFile.originalname });
  formData.append('caption', req.body.text);

  // Publicar en Instagram
  const accessToken = 'EAAIIZC5BbK7EBAAGp8mBAsup1UZCDasoijLDqLaCaJr3Gm8WflygX98xSQmaEXivUZBMZAoV0mho7gBkMf4ZA6upZAofKVFMk9PpNz6AvCtPMo7pJMYWiiybAMCGJG4BDFC9wOZBEZCJqYytMRctg5xDOkVzUeaAsKjeAE003cFtefrPQ5HJsX4R1WqwS5ki23n1eVTQfhpu0h73hg25aO4y9com1ZBa8EJgZD';
  const mediaUrl = 'https://graph.instagram.com/me/media?access_token=' + accessToken;

  axios.post(mediaUrl, formData, {
    headers: formData.getHeaders()
  })
  .then(function (response) {
    console.log(response.data);
    res.send('Publicado en Instagram');
  })
  .catch(function (error) {
    console.error(error);
    res.send('Error al publicar en Instagram');
  })
  .finally(function () {
    // Eliminar la imagen del servidor después de publicar
    fs.unlink(imagePath, function (err) {
      if (err) {
        console.error(err);
      }
    });
  });
});


// Inicio del servidor
app.listen(4000, function() {
  console.log('La aplicación está disponible en http://localhost:4000');
});
