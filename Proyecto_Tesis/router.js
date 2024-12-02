const express = require("express");
const router = express.Router();
const conexion = require("./database/db");

// Ruta principal para obtener datos de la tabla patient_data
router.get("/", (req, res) => {
    const searchQuery = req.query.search_query || ''; // Obtener la consulta de búsqueda

    // Consulta SQL básica
    let sqlQuery = "SELECT * FROM patient_data";
    let params = [];

    // Si hay un término de búsqueda, modifica la consulta
    if (searchQuery) {
        sqlQuery = `SELECT * FROM patient_data WHERE nombre LIKE ? OR apellido LIKE ? OR id LIKE ?`;
        params = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];
    }

    conexion.query(sqlQuery, params, (error, results) => {
        if (error) {
            throw error;
        } else {
            console.log(results); // Verificar los datos obtenidos
            res.render("index", { results: results, searchQuery: searchQuery }); // Pasar searchQuery a la vista
        }
    });
});

// Otras rutas (create, edit, delete) sin cambios
router.get("/create", (req, res) => {
    res.render("create");
});

router.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    conexion.query("SELECT * FROM patient_data WHERE id=?", [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.render("edit", { user: results[0] });
        }
    });
});

router.get("/delete/:id", (req, res) => {
    const id = req.params.id;
    conexion.query("DELETE FROM patient_data WHERE id=?", [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.redirect("/");
        }
    });
});

// Controladores para guardar y actualizar
const crud = require("./controllers/crud");
router.post("/save", crud.save);
router.post("/update", crud.update);

module.exports = router;
