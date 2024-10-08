# Documentación Técnica de Conjunto de Datos

## Contexto

Este estudio retrospectivo de corte transversal se basó en 1267 registros seleccionados sistemáticamente de pacientes adultos admitidos en dos departamentos de emergencia entre octubre de 2016 y septiembre de 2017. Se evaluaron 24 variables, incluidas las quejas principales, los signos vitales según los registros iniciales de enfermería y los resultados clínicos. Tres expertos en triaje (un enfermero certificado en emergencias, un proveedor e instructor de KTAS y una enfermera recomendada por su experiencia y competencia en departamentos de emergencia) determinaron el verdadero KTAS de los pacientes.

## Variables Evaluadas

A continuación se describen las variables contenidas en el conjunto de datos:

- **Sexo**: Sexo del paciente.
- **Edad**: Edad del paciente.
- **Modo de llegada**: Tipo de transporte utilizado para llegar al hospital.
- **Lesión**: Indica si el paciente está lesionado o no.
- **Queja principal**: Queja principal del paciente.
- **Estado mental**: Estado mental del paciente.
- **Dolor**: Indica si el paciente tiene dolor.
- **NRS_pain**: Evaluación del dolor realizada por el personal de enfermería.
- **Presión sistólica (SBP)**: Presión arterial sistólica.
- **Presión diastólica (DBP)**: Presión arterial diastólica.
- **Frecuencia cardíaca (HR)**: Frecuencia cardíaca.
- **Frecuencia respiratoria (RR)**: Frecuencia respiratoria.
- **Temperatura corporal (BT)**: Temperatura corporal.

### Notas sobre la Codificación de Variables

En el documento técnico del proyecto, se observó que algunos datos numéricos son en realidad categóricos. A continuación, se describen estos valores:

- **Existencia de lesión (Injury)**:

  - `1`: No.
  - `2`: Sí.

- **Género (Sex)**:

  - `1`: Femenino.
  - `2`: Masculino.

- **Dolor (Pain)**:

  - `1`: Sí.
  - `0`: No.

- **Estado Mental (Mental)**:

  - `1`: Alerta.
  - `2`: Respuesta verbal.
  - `3`: Respuesta al dolor.
  - `4`: Sin respuesta.

- **Tipo de Departamento de Emergencias (Group)**:

  - `1`: ED Local de 3er grado.
  - `2`: ED Regional de 4to grado.

- **Modo de Llegada (Arrival Mode)**:

  - `1`: Caminando.
  - `2`: Ambulancia pública.
  - `3`: Vehículo privado.
  - `4`: Ambulancia privada.
  - `5,6,7`: Otro.

- **Disposición (Disposition)**:

  - `1`: Alta.
  - `2`: Admisión en sala.
  - `3`: Admisión en UCI.
  - `4`: Alta.
  - `5`: Transferencia.
  - `6`: Fallecimiento.
  - `7`: Cirugía.

- **KTAS**:
  - `1, 2, 3`: Emergencia.
  - `4, 5`: No emergencia.
