const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: "localhost",
    port: 3308,
    database: "patientadmission",
    user: "root",
    password: ""
});

conexion.connect((error)=>{
    if(error){
        console.error("Connection error: " +error);
        return
    }
    console.log("Connection to DB Successfully");
})

module.exports = conexion;