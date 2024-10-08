//importar librería
const express = require("express");

const mysql = require("mysql2");
//objetos para llamar los métodos de express
const app = express();

let conexion = mysql.createConnection({
    host: "localhost",
    port: 3308,
    database: "patientadmission",
    user: "root",
    password: ""
})
//middleware:
app.use(express.static("public"));
app.set("view engine","ejs");


app.use(express.json());
app.use(express.urlencoded({extend:false}));


app.get("/", function(req,res){
    res.render("form_patient");
});

app.post("/validar", function(req,res){
    const data = req.body;

    let nombre = data.nombre;
    let apellido = data.apellido;
    let edad = data.edad;
    let sexo = data.sexo;
    let llegada_paciente = data.llegada_paciente;
    let paciente_herido= data.paciente_herido;
    let estado_mental_paciente = data.estado_mental_paciente;
    let dolor_paciente= data.dolor_paciente;
    let escala_dolor= data.escala_dolor;
    let temperatura_corporal= data.temperatura_corporal;
    let presion_arterial_sistolica = data.presion_arterial_sistolica;
    let presion_arterial_diastolica = data.presion_arterial_diastolica;
    let frecuencia_cardiaca= data.frecuencia_cardiaca;
    let tasa_respiracion = data.tasa_respiracion;

    let addpacient = "INSERT INTO patient_data (nombre, apellido, edad, sexo, llegada_paciente, paciente_herido, estado_mental_paciente, dolor_paciente, escala_dolor, temperatura_corporal, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, tasa_respiracion) VALUES ('"+nombre +"', '"+apellido +"', '"+edad +"', '"+sexo +"', '"+llegada_paciente +"', '"+paciente_herido +"', '"+estado_mental_paciente +"', '"+dolor_paciente +"', '"+escala_dolor +"', '"+temperatura_corporal +"', '"+presion_arterial_sistolica +"', '"+presion_arterial_diastolica +"', '"+frecuencia_cardiaca +"', '"+tasa_respiracion +"')";
    
    conexion.query(addpacient, function(error){
        if(error){
            throw error;
        }else{
            console.log("Data stored correctly")
        }
    });
});

//configurar el puerto usado para el servidor local 
app.listen(3000,function(){
    console.log("The server is http://localhost:3000");
});
