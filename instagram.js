const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Autenticación con la API de Instagram Graph
const accessToken = 'EAAIIZC5BbK7EBAKped7HmEWrW9KZAQiVRZBZBXg59MkgZAZAZA6Dl5ZATi3IHmlcjEWiVxL8IluylNFKrhbBccX6IO6n5xvVmgt6aVvyWgzSQGoYYWFTaIXGgjHQs184dCZAvNWAM1DxiLNeO9YXoG9D2yTE4ckBwHEQP9ZBUsicxKB3LZAhsPhxsSp9OrVHCkxvsrffBFQWfbVzneprqTcYo4rQH5eMYnKwgkZD';
const mediaUrl = 'https://graph.instagram.com/me/media?access_token=' + accessToken;

// Publicación del contenido en Instagram
app.post('/publicar', upload.single('image'), function(req, res) {
  const formData = new FormData();
  formData.append('image', req.file.buffer, { filename: req.file.originalname });
  
  // Publicar en Instagram
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
  });
});
