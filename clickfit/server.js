// Install dependencies: express, multer, mysql2
const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static('public'));
app.use(express.json());
app.use('/upload_images', express.static(path.join(__dirname,  'upload_images')));

app.get('/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gallery.html'));
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'click_fit_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'upload_images');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
app.get('/images', (req, res) => {
    const uploadDir = path.join(__dirname,  'upload_images');

    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err); // Log error
            return res.status(500).json({ error: "Failed to load images", details: err.message });
        }

        if (files.length === 0) {
            return res.json([]); 
        }

        const imageUrls = files.map(file => `/upload_images/${file}`);
        res.json(imageUrls);
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const publicFolders = ['public', 'public/css', 'public/js', 'public/images'];
publicFolders.forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
});
