const conexion = require("../database/db");

exports.save = (req, res)=>{
    const id = req.body.id;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const sexo = req.body.sexo;
    const edad = req.body.edad;
    const lesion = req.body.lesion;
    const estado_mental = req.body.estado_mental;
    const dolor = req.body.dolor;
    const nrs_pain = req.body.nrs_pain;
    const sbp = req.body.sbp;
    const dbp = req.body.dbp;
    const hr = req.body.hr;
    const rr = req.body.rr;
    const bt = req.body.bt;
    const nombre_medico = req.body.nombre_medico;
    conexion.query("INSERT INTO patient_data SET ?",{id:id ,nombre:nombre, apellido:apellido, sexo:sexo, edad:edad, lesion:lesion, estado_mental:estado_mental, dolor:dolor, nrs_pain:nrs_pain, sbp:sbp, dbp:dbp, hr:hr, rr:rr, bt:bt, nombre_medico:nombre_medico}, (error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect("/");
        }
    })
    
};

exports.update = (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const sexo = req.body.sexo;
    const edad = req.body.edad;
    const lesion = req.body.lesion;
    const estado_mental = req.body.estado_mental;
    const dolor = req.body.dolor;
    const nrs_pain = req.body.nrs_pain;
    const sbp = req.body.sbp;
    const dbp = req.body.dbp;
    const hr = req.body.hr;
    const rr = req.body.rr;
    const bt = req.body.bt;
    const nombre_medico = req.body.nombre_medico;

    conexion.query(
        "UPDATE patient_data SET ? WHERE id = ?", 
        [{nombre, apellido, sexo, edad, lesion, estado_mental, dolor, nrs_pain, sbp, dbp, hr, rr, bt, nombre_medico}, id], 
        (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.redirect("/");
            }
        }
    );
};

