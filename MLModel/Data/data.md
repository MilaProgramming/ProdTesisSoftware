# Documentación Técnica de Conjunto de Datos

## Contexto

Este estudio retrospectivo de corte transversal se basó en 1267 registros seleccionados sistemáticamente de pacientes adultos admitidos en dos departamentos de emergencia entre octubre de 2016 y septiembre de 2017. Se evaluaron 24 variables, incluidas las quejas principales, los signos vitales según los registros iniciales de enfermería y los resultados clínicos. Tres expertos en triaje (un enfermero certificado en emergencias, un proveedor e instructor de KTAS y una enfermera recomendada por su experiencia y competencia en departamentos de emergencia) determinaron el verdadero KTAS de los pacientes.

## Variables Evaluadas

A continuación se describen las variables contenidas en el conjunto de datos:

- **Sexo**: Sexo del paciente.
- **Edad**: Edad del paciente.
- **Lesión**: Indica si el paciente está lesionado o no.
- **Estado mental**: Estado mental del paciente.
- **NRS_pain**: Evaluación del dolor realizada por el personal de enfermería, va del 0 al 10
- **Presión sistólica (SBP)**: Presión arterial sistólica.
- **Presión diastólica (DBP)**: Presión arterial diastólica.
- **Frecuencia cardíaca (HR)**: Frecuencia cardíaca.
- **Frecuencia respiratoria (RR)**: Frecuencia respiratoria.
- **Temperatura corporal (BT)**: Temperatura corporal.

### Notas sobre la Codificación de Variables

En el documento técnico del proyecto, se observó que algunos datos numéricos son en realidad categóricos. A continuación, se describen estos valores:

- **Parametros de lesión (Injury)**:

  - `0`: No existencia
  - `1`: Existencia no grave
  - `2`: Existencia grave

- **Género (Sex)**:

  - `1`: Femenino.
  - `2`: Masculino.

- **Estado Mental (Mental)**:

  - `1`: Alerta.
  - `2`: Respuesta verbal.
  - `3`: Respuesta al dolor.
  - `4`: Sin respuesta.

- **KTAS**:
  - `1, 2, 3`: Emergencia.
  - `4, 5`: No emergencia.
