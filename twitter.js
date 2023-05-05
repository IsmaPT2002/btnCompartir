const Twitter = require('twitter-lite');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Autenticación con la API de Twitter
const client = new Twitter({
  consumer_key: 'lOiuJn3dA64TjQpc57fqtJ7wr',
  consumer_secret: 'cT42SN7adnVJuK5czeDByiPKIC23uddvbKNX0vPVnoaG98UHIF',
  access_token_key: '1654015617240891394-CAbY5pmATbr79w2NAO2HuJpAyDpvui',
  access_token_secret: '3om3q78t9FDcdhpDNURj6GNH0OOPZdKKVjmpuDRAkWwHK'
});

// Configuración de Multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '/public/images/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Ruta para procesar el formulario
app.post('/formulario', upload.single('imagen'), function (req, res) {
  // Carga de la imagen
  const imageFile = fs.readFileSync(req.file.path);

  // Publicación del contenido en Twitter
  client.post('media/upload', { media: imageFile })
    .then(function (media) {
      const status = {
        status: req.body.texto + ' #hashtag',
        media_ids: media.media_id_string
      };

      return client.post('statuses/update', status);
    })
    .then(function (tweet) {
      console.log(tweet);
      res.redirect('/formulario');
    })
    .catch(function (error) {
      console.error(error);
      res.redirect('/formulario');
    });
});
