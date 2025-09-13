const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const imageSchema = require('./models/imageModel.js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const Image = mongoose.model('Image', imageSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

app.post("/upload", async (req, res) => {
  try {
    const { image } = req.body;
    console.log('Received image data length:', image ? image.length : 'No image');
    if (!image) return res.status(400).json({ message: "No Image Provided" });

    const newImage = new Image({ image });
    await newImage.save();
    console.log('Image saved to database');

    res.json({ message: "Image uploaded successfully!!" });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/images", async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });  
    res.json(images);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: "Server error" });
  } 
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
