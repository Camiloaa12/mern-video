const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const aws = require('aws-sdk');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configurar Mongoose
mongoose.connect('mongodb://localhost:27017/yourdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Configurar AWS S3
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Configurar Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const videoSchema = new mongoose.Schema({
  url: String
});

const Video = mongoose.model('Video', videoSchema);

// Ruta para cargar el vídeo
app.post('/upload', upload.single('video'), async (req, res) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `videos/${req.file.originalname}`,
    Body: req.file.buffer,
    ACL: 'public-read',
    ContentType: req.file.mimetype
  };

  s3.upload(params, async (err, data) => {
    if (err) return res.status(500).send(err);

    const newVideo = new Video({ url: data.Location });
    await newVideo.save();

    res.json(newVideo);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
