require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

// Ruta para registrar un nuevo usuario
app.post('/api/registrar', (req, res) => {
  const { nombre, apellidos, direccion, celular, cedula, password } = req.body;
  const sql = `INSERT INTO usuarios (nombre, apellidos, direccion, celular, cedula, password)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [nombre, apellidos, direccion, celular, cedula, password], (err) => {
    if (err) return res.status(500).send("Error al registrar");
    res.send("Usuario registrado correctamente");
  });
});

// Ruta para iniciar sesión
app.post('/api/login', (req, res) => {
  const { nombre, cedula, password } = req.body;
  const sql = `SELECT * FROM usuarios WHERE nombre = ? AND cedula = ? AND password = ?`;
  db.query(sql, [nombre, cedula, password], (err, results) => {
    if (err) {
  console.error(err); // muestra el error exacto
  return res.status(500).send("Error al registrar");
}
    if (results.length > 0) {
      res.send("Acceso concedido");
    } else {
      res.status(401).send("Datos incorrectos");
    }
  });
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

app.get('/api/usuario/:cedula', (req, res) => {
  const { cedula } = req.params;
  const sql = 'SELECT * FROM usuarios WHERE cedula = ?';
  db.query(sql, [cedula], (err, results) => {
    if (err) return res.status(500).send("Error");
    if (results.length === 0) return res.status(404).send("No encontrado");
    res.json(results[0]);
  });
});

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/perfiles/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, req.params.cedula + ext);
  }
});
const upload = multer({ storage });

app.post('/api/usuario/:cedula/foto', upload.single('foto'), (req, res) => {
  const cedula = req.params.cedula;
  const filename = req.file.filename;
  const ruta = `/perfiles/${filename}`;

  const sql = 'UPDATE usuarios SET foto = ? WHERE cedula = ?';
  db.query(sql, [ruta, cedula], err => {
    if (err) return res.status(500).send("Error al guardar foto");
    res.send("Foto actualizada correctamente");
  });
});

app.use(express.static('public'));



