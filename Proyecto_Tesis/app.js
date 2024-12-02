const express = require("express");
const app = express();
const path = require('path');

// Configuración del motor de vistas
app.set("view engine", "ejs");

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: false }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); // Esto sirve todos los archivos en 'public'

// Importar rutas
app.use("/", require("./router"));

// Iniciar el servidor
app.listen(5002, () => {
    console.log("Server Running Successfully: http://localhost:5002");
});
