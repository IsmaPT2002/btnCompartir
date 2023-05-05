const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Indicamos la carpeta donde se guardarán las imágenes subidas

const LinkedIn = require('node-linkedin')('77xk7rh5iw68p0', 'afYa3NyhMOmwbilF', 'AQXl5-DAoS89wdQsqhGmeD6fHIkHGW9sWYMf0iRiymAEUgAZKat1r_CA3K7QoN_RKJb9g_ZcQguta2s7RWkgc4oIF-RYdpn7nQJQk4Hzc1VqjI_Rr5ATlbpWB1MQUFEh_B8HNuQcAf_CkqmgHiPFozlXVYppVJdlqxioQgxPm_Wyt2-PJhKRAgGk9RsloDIctb0bKYQrp13H3eYUtoD_ML11pe9jfm-hfpaqBadQkzdVIKXv2K8jL7zCzpuPFrqtHCr8MTIgPvU0WU4BqLcW5H3ctoog6Xy9Az0X16ki5aesjh_NlSLvBf-0_Z4BXD2psKy98HY-3-8eedULxL6hbtWXIrPGhA');

app.post('/share-linkedin', upload.single('image'), (req, res) => { // Utilizamos el middleware "single" para recibir una única imagen
  const imageFile = fs.readFileSync(req.file.path); // Leemos la imagen subida con fs
  fs.unlinkSync(req.file.path); // Eliminamos la imagen subida después de haberla leído

  LinkedIn.people.share({
    comment: req.body.comment, // Utilizamos los datos enviados en el formulario
    content: {
      title: req.body.title,
      description: req.body.description,
      submitted_url: req.body.url,
      submitted_image_url: req.file.path // Agregamos la ruta temporal de la imagen subida al campo "submitted_image_url"
    },
    visibility: {
      code: 'anyone'
    }
  }, function(err, data) {
    if (err) {
      console.error(err);
      res.status(500).send('Error al compartir en LinkedIn');
    } else {
      console.log(data);
      res.send('Compartido en LinkedIn');
    }
  });
});
