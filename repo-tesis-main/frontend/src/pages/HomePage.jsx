import React, { useContext, useEffect, useReducer, useState } from "react";
import { Box, Button, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import SessionContext from "../context/SessionContext";
import { useNavigate } from "react-router-dom";
import { PatientView } from "../views/PatientView";
import { StaffView } from "../views/StaffView";
import { CustomDrawer } from "../components/Drawer/CustomDrawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Affections } from "../components/Affections/Affections";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { environment } from "../utils/evironment";
import dayjs from "dayjs";
import { AdminView } from "../views/AdminView";

const initialStateAffections = {
  headache: { checked: false, value: 0 },
  temperature: { checked: false },
  stomachache: { checked: false },
  disconfort: { checked: false },
  burningThroat: { checked: false },
  theresWound: { checked: false, value: false },
};

const setTheresWound = (value) => {
  if (value) {
    return 2;
  } else {
    return 1;
  }
}

const reducerAffections = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_CHECKBOX':
      return { ...state, [action.payload]: { ...state[action.payload], checked: !state[action.payload].checked } };
    case 'UPDATE_SLIDER':
      return { ...state, [action.payload.option]: { ...state[action.payload.option], value: action.payload.value } };
    case 'RESET_STATE':
      return initialStateAffections;
    default:
      return state;
  }
};

const initialStatePatientData = {
  firstName: '',
  lastName: '',
  identificationType: '',
  identificationNumber: '',
  appointmentType: ''
};

const reducerPatientData = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIRST_NAME':
      return { ...state, firstName: action.payload };
    case 'UPDATE_LAST_NAME':
      return { ...state, lastName: action.payload };
    case 'UPDATE_IDENTIFICATION_TYPE':
      return { ...state, identificationType: action.payload };
    case 'UPDATE_IDENTIFICATION_NUMBER':
      return { ...state, identificationNumber: action.payload };
    case 'UPDATE_APPOINTMENT_TYPE':
      return { ...state, appointmentType: action.payload }
    case 'RESET_STATE':
      return initialStatePatientData;
    default:
      return state;
  }
};

const documentType = {
  ci: 'Cedula',
  passport: 'Pasaporte'
}

export const HomePage = () => {
  const { user } = useContext(SessionContext);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [statePatientData, dispatchPatientData] = useReducer(reducerPatientData, initialStatePatientData);
  const [stateAffections, dispatchAffections] = useReducer(reducerAffections, initialStateAffections);
  const navigate = useNavigate();

  const handleCheckboxChange = (option) => {
    dispatchAffections({ type: 'TOGGLE_CHECKBOX', payload: option });
    if (stateAffections[option].checked && option === 'headache') {
      dispatchAffections({ type: 'UPDATE_SLIDER', payload: { option: option, value: 1 } })
    } else if (!stateAffections[option].checked && option === 'headache') {
      dispatchAffections({ type: 'UPDATE_SLIDER', payload: { option: option, value: 0 } })
    }
  };

  const handleSliderChange = (option, value) => {
    dispatchAffections({ type: 'UPDATE_SLIDER', payload: { option, value } });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'firstName':
        dispatchPatientData({ type: 'UPDATE_FIRST_NAME', payload: value });
        break;
      case 'lastName':
        dispatchPatientData({ type: 'UPDATE_LAST_NAME', payload: value });
        break;
      case 'identificationType':
        dispatchPatientData({ type: 'UPDATE_IDENTIFICATION_TYPE', payload: value });
        break;
      case 'identificationNumber':
        dispatchPatientData({ type: 'UPDATE_IDENTIFICATION_NUMBER', payload: value });
        break;
      case 'appointmentType':
        dispatchPatientData({ type: 'UPDATE_APPOINTMENT_TYPE', payload: value });
        dispatchAffections({ type: 'RESET_STATE' })
        break;
      default:
        break;
    }
  };

  const onReturn = () => {
    dispatchAffections({ type: 'RESET_STATE' })
    dispatchPatientData({ type: 'RESET_STATE' })
    setIsCreatingAppointment(false)
  }

  const onSend = () => {
    const registerAndSetAppointment = async () => {
      try {
        const registerResponse = await axios.post(`${environment.apiUrl}/register`, {
          username: "",
          password: "",
          name: statePatientData.firstName,
          lastname: statePatientData.lastName,
          email: "",
          role: "paciente",
          DNI: statePatientData.identificationNumber,
          DNIType: statePatientData.identificationType
        });

        const defaultDate = dayjs(Date.now())
        const formattedDate = defaultDate.format("YYYY-MM-DD");

        const setAppointmentResponse = await axios.post(
          `${environment.apiUrl}/appointments/${statePatientData.identificationNumber}?newUserFromAppointment=true`,
          {
            headache: stateAffections.headache.checked ? stateAffections.headache.value : 0,
            temperature: stateAffections.temperature.checked ? 1 : 0,
            stomachache: stateAffections.stomachache.checked ? 1 : 0,
            generalMalaise: stateAffections.disconfort.checked ? 1 : 0,
            burningThroat: stateAffections.burningThroat.checked ? 1 : 0,
            theresWound: stateAffections.theresWound.checked ? setTheresWound(stateAffections.theresWound.value) : 0,
            appointmentType: statePatientData.appointmentType,
            appointmentStatus: "pending",
            appointmentDate: `${formattedDate} 18:01`,
            observations: "",
          }
        );
        if (setAppointmentResponse.data !== null && registerResponse.data.status === 200) {
          toast.success(`Paciente registrado y Cita agendada exitosamente a las ${setAppointmentResponse.data.split("T")[1]}`);
          dispatchAffections({ type: "RESET_STATE" })
          dispatchPatientData({ type: "RESET_STATE" })
        } else {
          toast.error("Ocurrio un error en el servidor")
        }
      } catch (error) {
        console.error("Error al obtener las fechas de las citas:", error);
        if (error.response.data.detail.includes("Duplicate entry")) {
          toast.error("El paciente ya esta registrado con este numero de identificación")
        } else {
          toast.error("Ocurrio un error en el servidor")
        }
        return
      }
    }
    registerAndSetAppointment()
  }

  useEffect(() => {
    if (localStorage.getItem("session") === null || localStorage.getItem("session") === "null") {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#E5E4E4",
      }}
    >
      <CustomDrawer
        role={user.role}
        fullname={`${user.name} ${user.lastname}`}
        email={user.email}
      />
      {user && !isCreatingAppointment && (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {user.role === "paciente" && <PatientView />}
          {user.role === "admin" && <AdminView />}
          {(user.role === "medical_staff" || user.role === "doctor") && <StaffView onClick={setIsCreatingAppointment} />}
        </Box>
      )}
      {user && isCreatingAppointment &&
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{
            backgroundColor: "white",
            fontFamily: "Roboto",
            paddingY: "50px",
            paddingX: "100px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflowY: "auto",
          }}>
            <Typography
              sx={{ fontSize: "60px", lineHeight: "1", letterSpacing: "0" }}
            >
              {"Reservar Turno"}
            </Typography>
            <Divider sx={{ borderColor: "black", paddingTop: "13px" }} />
            <Box
              sx={{ paddingTop: "35px", display: "flex", flexDirection: "row" }}
            >
              <IconButton
                onClick={onReturn}
              ><ChevronLeftIcon /></IconButton>
            </Box>
            <Box
              sx={{
                width: "100%",
                overflowY: "auto",
                mt: 2,
              }}
            >
              <Box sx={{ width: "85%", height: "64px", borderRadius: "16px", backgroundColor: "#EBEBEB", display: "flex", flexDirection: "row", justifySelf: "center", alignItems: "center", gap: "1em", paddingY: '12px', paddingX: "24px" }}>
                <VisibilityOutlinedIcon sx={{ fontSize: "24px" }} />
                <Typography sx={{ fontSize: "20px" }}>{"Datos Generales"}</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "2em", paddingY: "2em" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "20px" }}>Nombre</Typography>
                  <TextField
                    size="small"
                    label="Nombre"
                    name="firstName"
                    value={statePatientData.firstName}
                    onChange={handleChange}
                    sx={{ width: "300px" }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "20px" }}>Apellidos</Typography>
                  <TextField
                    size="small"
                    label="Apellidos"
                    name="lastName"
                    value={statePatientData.lastName}
                    onChange={handleChange}
                    sx={{ width: "300px" }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "20px" }}>Tipo de documento de identificación</Typography>
                  <FormControl >
                    <Select
                      size="small"
                      id="identificationType"
                      name="identificationType"
                      value={statePatientData.identificationType}
                      onChange={handleChange}
                      displayEmpty
                      renderValue={(value) => (value !== '' ? documentType[value] : 'Selecciona el tipo de Documento')}
                      sx={{ width: "300px" }}
                    >
                      <MenuItem value="ci">Cedula</MenuItem>
                      <MenuItem value="passport">Pasaporte</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "20px" }}>Número de identificación</Typography>
                  <TextField
                    size="small"
                    label="Número de identificación"
                    name="identificationNumber"
                    value={statePatientData.identificationNumber}
                    onChange={handleChange}
                    sx={{ width: "300px" }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "20px" }}>Tipo de cita</Typography>
                  <FormControl >
                    <InputLabel id="appointment-type-label">Selecciona el tipo de cita</InputLabel>
                    <Select
                      size="small"
                      labelId="appointment-type-label"
                      id="appointmentType"
                      name="appointmentType"
                      value={statePatientData.appointmentType}
                      onChange={handleChange}
                      label="Selecciona el tipo de cita"
                      sx={{ width: "300px" }}
                    >
                      <MenuItem value="appointment">Turno médico</MenuItem>
                      <MenuItem value="vitalSignes">Toma de signos vitales</MenuItem>
                      <MenuItem value="injection">Aplicación de inyección</MenuItem>
                      <MenuItem value="desinfection">Desinfección de herida</MenuItem>
                      <MenuItem value="certificate">Validación de Certificado</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {statePatientData.appointmentType === "appointment" &&
                  <>
                    <Typography sx={{ fontSize: "24px", color: "#727272" }}>{"Malestares"}</Typography>
                    <Divider sx={{ borderColor: "black" }} />
                    <Box>
                      <Affections
                        options={stateAffections}
                        onCheckboxChange={handleCheckboxChange}
                        onSliderChange={handleSliderChange}
                      />
                    </Box>
                  </>
                }
                <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                  <Button onClick={onSend} sx={{ backgroundColor: "#115026", width: "215px", height: "42px", color: "white", borderRadius: "12px" }}>Enviar</Button>
                  <Button onClick={() => {
                    setIsCreatingAppointment(false)
                    dispatchAffections({ type: 'RESET_STATE' })
                    dispatchPatientData({ type: 'RESET_STATE' })
                  }} sx={{ backgroundColor: "#FA2424", width: "215px", height: "42px", color: "white", borderRadius: "12px" }}>Descartar</Button>
                </Box>
              </Box>
            </Box>
          </Box>
          <ToastContainer />
        </Box>
      }
    </Box>
  );
};
