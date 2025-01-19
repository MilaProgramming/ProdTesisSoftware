import React, { useContext, useEffect, useReducer, useState } from "react";
import SessionContext from "../context/SessionContext";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { CustomDrawer } from "../components/Drawer/CustomDrawer";
import { Appointment } from "../components/Appointment/Appointment";
import { CancelAppointmentModal } from "../components/CancelAppointmentModal/CancelAppointmentModal";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { toast } from "react-toastify";
import { TriageModal } from "../components/TriageModal/TriageModal";
import axios from "axios";
import { environment } from "../utils/evironment";
import { useNavigate } from "react-router-dom";
import { SentToAttendModal } from "../components/SentToAttendModal/SentToAttendModal";
import { UpdateAppointment } from "./UpdateAppointment";
import { WatchAppoinment } from "./WatchAppoinment";

const StatusColor = {
  resuscitation: "#E00C0C",
  emergency: "#E0560C",
  urgency: "#E0B60C",
  minorUrgency: "#115026",
  noUrgency: "#0C68E0",
};

const StatusLabels = {
  resuscitation: "Reanimación",
  emergency: "Emergencia",
  urgency: "Urgencia",
  minorUrgency: "Urgencia menor",
  noUrgency: "Sin urgencia",
};

const StatusNumbers = {
  1: "resuscitation",
  2: "emergency",
  3: "urgency",
  4: "minorUrgency",
  5: "noUrgency"
}

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_TEMPERATURE":
      return { ...state, temperature: action.payload };
    case "UPDATE_SYSTOLIC_PRESSURE":
      return { ...state, systolicPressure: action.payload };
    case "UPDATE_DIASTOLIC_PRESSURE":
      return { ...state, diastolicPressure: action.payload };
    case "UPDATE_HEART_RATE":
      return { ...state, heartRate: action.payload };
    case "UPDATE_RESPIRATION_RATE":
      return { ...state, respirationRate: action.payload };
    case "UPDATE_AGE":
      return { ...state, age: action.payload };
    case "UPDATE_SEX":
      return { ...state, sex: action.payload };
    case "UPDATE_PATIENT_STATUS":
      return { ...state, patientStatus: action.payload };
    case "UPDATE_TRIAGE_STATUS":
      return { ...state, triageStatus: action.payload };
    case "UPDATE_THERES_LESSION":
      return { ...state, theresLession: action.payload };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
};

// Estado inicial
const initialState = {
  temperature: "",
  systolicPressure: "",
  diastolicPressure: "",
  heartRate: "",
  respirationRate: "",
  age: "",
  sex: "",
  patientStatus: "",
  theresLession: "",
  triageStatus: "",
};

export const Appointments = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openTriageModal, setOpenTriageModal] = useState(false);
  const [openSentToAttend, setOpenSentToAttend] = useState(false);
  const [appointmentData, setAppointmentData] = useState({});
  const [needsToBeReloaded, setNeedsToBeReloaded] = useState(false);
  const [painLevel, setPainLevel] = useState(0);
  const [affections, setAffections] = useState({});
  const [isAttending, setIsAttending] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [isView, setIsView] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useContext(SessionContext);
  const [buttonClass] = useState(true);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const handleCloseCancelModal = () => {
    setOpenCancelModal(false);
    localStorage.removeItem("appointment");
  };

  const handleOpenCancelModal = (data) => {
    localStorage.setItem("appointment", JSON.stringify(data));
    setOpenCancelModal(true);
  };

  const handleOpenTriageModal = () => {
    setOpenTriageModal(true);
  };

  const handleCloseTriageModal = () => {
    setOpenTriageModal(false);
  };

  const onModify = (data) => {
    setAppointmentData(data);
    setIsModifying(true)
  };

  const onAttend = (data) => {
    setAppointmentData(data);
    setIsAttending(true);
  };

  const onView = (data) => {
    setAppointmentData(data);
    setIsView(true)
  };

  const onSend = () => {
    onSave()
    setOpenSentToAttend(true)
    setOpenTriageModal(false)
  }

  const handleCloseSentToAttendModal = () => {
    setOpenSentToAttend(false);
  };

  const onSave = () => {
    const saveChanges = async () => {
      const response = axios.put(`${environment.apiUrl}/appointments/details`, {
        appointmentId: appointmentData.id,
        generalAffections: { ...affections },
        painLevel: painLevel,
        vitalSigns: {
          temperature: state.temperature,
          systolicPressure: state.systolicPressure,
          diastolicPressure: state.diastolicPressure,
          heartRate: state.heartRate,
          respirationRate: state.respirationRate,
        },
        triageStatus: state.triageStatus !== "" ? state.triageStatus.toString() : "",
        patientStatus: state.patientStatus,
        theresLession: state.theresLession,
      });
      setIsAttending(false);
      toast.success("Los Datos se guardaron correctamente");
    };
    saveChanges();
    dispatch({ type: "RESET_STATE" });
  };

  const onCancel = (event) => {
    const changeStatus = async (appointmentId) => {
      axios.put(`${environment.apiUrl}/appointments/${appointmentId}/canceled`);
    };
    const response = changeStatus(event.target.value);
    if (response.status === 200) {
      toast.success("Cita cancelada exitosamente!");
    } else {
      toast.error("La cita no fue cancelada.");
    }
    setOpenCancelModal(false);
    setNeedsToBeReloaded(true);
  };

  const onCancelInasistance = (event) => {
    const changeStatus = async (appointmentId) => {
      axios.put(`${environment.apiUrl}/appointments/${appointmentId}/canceled`);
    };
    const response = changeStatus(event.target.value);
    if (response.status === 200) {
      toast.success("Cita cancelada exitosamente!");
    } else {
      toast.error("La cita no fue cancelada.");
    }
    setOpenCancelModal(false);
    setNeedsToBeReloaded(true);
  };

  const handleComment = (event) => {
    setComment(event.target.value);
  };

  useEffect(() => {
    if (!user) navigate("/");
    const getAppointmentsByDate = async () => {
      const response = await axios.get(
        `${environment.apiUrl}/appointments/doctor-appointments/${user.id}`
      );
      const appointmentsByDate = response.data.appointments.reduce(
        (acc, appointment) => {
          const date = appointment.appointmentDate.split("T")[0]; // Get only the date (YYYY-MM-DD)
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(appointment);
          return acc;
        },
        {}
      );
      const appointmentByDatesComponents = [];
      const dates = Object.keys(appointmentsByDate);
      for (const date of dates) {
        const appointments = appointmentsByDate[date];
        const appointmentComponents = [];
        appointments.forEach((appointment) => {
          appointmentComponents.push(
            <Appointment
              key={`appointment-${appointment.id}`}
              id={appointment.id}
              time={appointment.appointmentDate}
              fullname={appointment.userFullname}
              status={appointment.appointmentStatus}
              onAttend={onAttend}
              onModify={onModify}
              onCancel={handleOpenCancelModal}
              onView={onView}
            />
          );
        });
        appointmentByDatesComponents.push(
          <Box
            key={`appointments-date-${date}`}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Typography sx={{ fontSize: "24px" }}>{date}</Typography>
            <Divider sx={{ borderColor: "black" }} />
            {appointmentComponents}
          </Box>
        );
      }
      setPendingAppointments(appointmentByDatesComponents);
    };
    getAppointmentsByDate();
    setNeedsToBeReloaded(false);
  }, [needsToBeReloaded]);

  useEffect(() => {
    const getAppointmentData = async () => {
      const response = await axios.get(
        `${environment.apiUrl}/appointments/details/${appointmentData.id}`
      );
      const appointmentDetails = response.data.appointmentDetails;
      setAffections(
        appointmentDetails.generalAffections !== null
          ? appointmentDetails.generalAffections
          : { fever: false, injury: false, pain: false }
      );
      setPainLevel(
        appointmentDetails.painLevel !== null ? appointmentDetails.painLevel : 0
      );
      if (appointmentDetails.vitalSigns !== null) {
        dispatch({
          type: "UPDATE_TEMPERATURE",
          payload: appointmentDetails.vitalSigns.temperature,
        });
        dispatch({
          type: "UPDATE_SYSTOLIC_PRESSURE",
          payload: appointmentDetails.vitalSigns.systolicPressure,
        });
        dispatch({
          type: "UPDATE_DIASTOLIC_PRESSURE",
          payload: appointmentDetails.vitalSigns.diastolicPressure,
        });
        dispatch({
          type: "UPDATE_HEART_RATE",
          payload: appointmentDetails.vitalSigns.heartRate,
        });
        dispatch({
          type: "UPDATE_RESPIRATION_RATE",
          payload: appointmentDetails.vitalSigns.respirationRate,
        });
      }
      if (appointmentDetails.theresLession !== null) {
        dispatch({
          type: "UPDATE_THERES_LESSION",
          payload: appointmentDetails.theresLession,
        });
      }
      if (appointmentDetails.patientStatus !== null) {
        dispatch({
          type: "UPDATE_PATIENT_STATUS",
          payload: appointmentDetails.patientStatus,
        });
      }
      if (appointmentDetails.patientStatus !== null) {
        dispatch({
          type: "UPDATE_TRIAGE_STATUS",
          payload: appointmentDetails.triageStatus,
        });
      }
    };
    if (appointmentData.id !== undefined) {
      getAppointmentData();
    }
  }, [isAttending]);

  useEffect(() => {
    if (openTriageModal) {
      const getTriage = async () => {
        const response = await axios.post("http://127.0.0.1:5000/predict/random_forest", {
          "Sex": Number(state.sex),
          "Age": Number(state.age),
          "Injury": Number(state.theresLession),
          "Mental": Number(state.patientStatus),
          "NRS_pain": painLevel,
          "SBP": Number(state.systolicPressure),
          "DBP": Number(state.diastolicPressure),
          "HR": Number(state.heartRate),
          "RR": Number(state.respirationRate),
          "BT": Number(state.temperature),
          "Saturation": 98
        })
        dispatch({
          type: "UPDATE_TRIAGE_STATUS",
          payload: response.data.prediction[0],
        })
      }
      getTriage()
    }
  }, [openTriageModal]);

  return (
    <Box sx={{ display: "flex", backgroundColor: "#E5E4E4" }}>
      <CustomDrawer
        role={user.role}
        fullname={`${user.name} ${user.lastname}`}
        email={user.email}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            backgroundColor: "white",
            fontFamily: "Roboto",
            paddingY: "50px",
            paddingX: "100px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!isAttending && !isModifying && !isView &&
            <>
              <Typography sx={{ fontSize: "48px" }}>{"Turnos"}</Typography>
              <Divider sx={{ borderColor: "black" }} />
              <Box
                sx={{
                  paddingTop: "35px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Box
                  flex={1}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => { }}
                    sx={{
                      display: "flex",
                      width: "218px",
                      height: "42px",
                      borderRadius: "15px",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: buttonClass ? "#115026" : "#e3fde8",
                      color: buttonClass ? "white" : "black",
                    }}
                    className={
                      buttonClass ? "active-option" : "inactive-option"
                    }
                  >
                    Todos
                  </Button>
                </Box>
                <Box
                  flex={1}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => { }}
                    sx={{
                      display: "flex",
                      width: "218px",
                      height: "42px",
                      borderRadius: "15px",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: buttonClass ? "#E3FDE8" : "#115026",
                      color: buttonClass ? "black" : "white",
                    }}
                    className={
                      buttonClass ? "inactive-option" : "active-option"
                    }
                  >
                    Pendientes
                  </Button>
                </Box>
                <Box
                  flex={1}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => { }}
                    sx={{
                      display: "flex",
                      width: "218px",
                      height: "42px",
                      borderRadius: "15px",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: buttonClass ? "#E3FDE8" : "#115026",
                      color: buttonClass ? "black" : "white",
                    }}
                    className={
                      buttonClass ? "inactive-option" : "active-option"
                    }
                  >
                    Archivados
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                {pendingAppointments}
              </Box>
            </>
          }
          {isAttending &&
            <>
              <Typography sx={{ fontSize: "48px" }}>
                Datos de Enfermería
              </Typography>
              <Divider sx={{ borderColor: "black" }} />
              <IconButton
                sx={{ alignSelf: "start" }}
                onClick={() => {
                  setIsAttending(false);
                  setAppointmentData({});
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Box
                sx={{
                  backgroundColor: "#EBEBEB",
                  borderRadius: "14px",
                  fontSize: "20px",
                  fontWeight: "600px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "20px",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "row", gap: "8px" }}>
                  <VisibilityOutlinedIcon />
                  <Typography
                    sx={{ fontWeight: 600 }}
                  >{`${appointmentData.fullname} | ${appointmentData.time.split("T")}`}</Typography>
                </Box>
                <Box
                  sx={{
                    borderRadius: "10px",
                    color: "white",
                    paddingX: "10px",
                    backgroundColor: state.triageStatus ? StatusColor[StatusNumbers[state.triageStatus]] : "#434343",
                  }}
                >
                  <Typography>{state.triageStatus ? StatusLabels[StatusNumbers[state.triageStatus]] : "Sin Triage"}</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  paddingTop: "10px",
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: "24px", color: "#666565" }}>
                    {"General"}
                  </Typography>
                  <Divider sx={{ borderColor: "black" }} />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    gap: "3rem",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography>Estado del Paciente</Typography>
                    <FormControl fullWidth>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={state.patientStatus}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_PATIENT_STATUS",
                            payload: e.target.value,
                          })
                        }
                      >
                        <MenuItem value={1}>Alerta</MenuItem>
                        <MenuItem value={2}>Respuesta Verbal</MenuItem>
                        <MenuItem value={3}>Respuesta al Dolor</MenuItem>
                        <MenuItem value={4}>Sin Respuesta</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography>Existe lesión?</Typography>
                    <FormControl fullWidth>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={state.theresLession}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_THERES_LESSION",
                            payload: e.target.value,
                          })
                        }
                      >
                        <MenuItem value={0}>No Existencia</MenuItem>
                        <MenuItem value={1}>Existencia No Grave</MenuItem>
                        <MenuItem value={2}>Existencia Grave</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignSelf: "center",
                    }}
                  >
                    <Typography sx={{ alignSelf: "center" }}>
                      ¿Qué tan fuerte es el dolor?
                    </Typography>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        value={painLevel}
                        onChange={() => { }}
                        sx={{
                          paddingTop: "15px",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <FormControlLabel
                          value="1"
                          sx={{ display: "flex", flexDirection: "column" }}
                          control={<Radio icon={SentimentSatisfiedAltIcon} />}
                          label="1"
                        />
                        <FormControlLabel
                          value="2"
                          sx={{ display: "flex", flexDirection: "column" }}
                          control={<Radio />}
                          label="2"
                        />
                        <FormControlLabel
                          value="3"
                          sx={{ display: "flex", flexDirection: "column" }}
                          control={<Radio />}
                          label="3"
                        />
                        <FormControlLabel
                          value="4"
                          sx={{ display: "flex", flexDirection: "column" }}
                          control={<Radio />}
                          label="4"
                        />
                        <FormControlLabel
                          value="5"
                          sx={{ display: "flex", flexDirection: "column" }}
                          control={<Radio />}
                          label="5"
                        />
                        <FormControlLabel
                          value="6"
                          sx={{ display: "flex", flexDirection: "column" }}
                          control={<Radio />}
                          label="6"
                        />
                        <FormControlLabel
                          value="7"
                          sx={{ display: "flex", flexDirection: "column" }}
                          control={<Radio />}
                          label="7"
                        />
                        <FormControlLabel
                          value="8"
                          sx={{ display: "flex", flexDirection: "column" }}
                          control={<Radio />}
                          label="8"
                        />
                        <FormControlLabel
                          value="9"
                          sx={{ display: "flex", flexDirection: "column" }}
                          control={<Radio />}
                          label="9"
                        />
                        <FormControlLabel
                          value="10"
                          sx={{ display: "flex", flexDirection: "column" }}
                          control={
                            <Radio icon={SentimentVeryDissatisfiedIcon} />
                          }
                          label="10"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      borderRadius: "14px",
                      backgroundColor: "#EBEBEB",
                      padding: "25px",
                    }}
                  >
                    <Typography sx={{ fontSize: "16px" }}>
                      Afecciones Generales
                    </Typography>
                    <FormControl component="fieldset" variant="standard">
                      <FormGroup>
                        <FormControlLabel
                          onChange={() => { }}
                          value={affections.fever}
                          control={
                            <Checkbox checked={affections.fever} name="fever" />
                          }
                          label="Temperatura alta"
                        />
                        <FormControlLabel
                          onChange={() => { }}
                          value={affections.injury}
                          control={
                            <Checkbox
                              checked={affections.injury}
                              name="injury"
                            />
                          }
                          label="Lesión o herida"
                        />
                        <FormControlLabel
                          onChange={() => { }}
                          value={affections.injury}
                          control={
                            <Checkbox checked={affections.pain} name="pain" />
                          }
                          label="Dolor o malestar general"
                        />
                      </FormGroup>
                    </FormControl>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      paddingX: "25px",
                    }}
                  >
                    <Typography sx={{ fontSize: "20px", paddingRight: "25px" }}>
                      Edad
                    </Typography>
                    <TextField
                      type="number"
                      value={state.age}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_AGE",
                          payload: e.target.value,
                        })
                      }
                      sx={{ width: "300px" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: "400px",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "20px",
                        paddingRight: "2rem",
                        alignSelf: "center",
                      }}
                    >
                      Sexo
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={state.sex}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_SEX",
                            payload: e.target.value,
                          })
                        }
                      >
                        <MenuItem value={2}>Masculino</MenuItem>
                        <MenuItem value={1}>Femenino</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "24px", color: "#666565" }}>
                    Técnico
                  </Typography>
                  <Divider sx={{ borderColor: "black" }} />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      paddingTop: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingX: "25px",
                      }}
                    >
                      <Typography sx={{ fontSize: "20px" }}>
                        Temperatura Corporal (C)
                      </Typography>
                      <TextField
                        type="number"
                        value={state.temperature}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_TEMPERATURE",
                            payload: e.target.value,
                          })
                        }
                        sx={{ width: "300px" }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingX: "25px",
                      }}
                    >
                      <Typography sx={{ fontSize: "20px" }}>
                        Presión Arterial Sistólica (mmHg)
                      </Typography>
                      <TextField
                        type="number"
                        value={state.systolicPressure}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_SYSTOLIC_PRESSURE",
                            payload: e.target.value,
                          })
                        }
                        sx={{ width: "300px" }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingX: "25px",
                      }}
                    >
                      <Typography sx={{ fontSize: "20px" }}>
                        Presión Arterial Diastólica (mmHg)
                      </Typography>
                      <TextField
                        type="number"
                        value={state.diastolicPressure}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_DIASTOLIC_PRESSURE",
                            payload: e.target.value,
                          })
                        }
                        sx={{ width: "300px" }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingX: "25px",
                      }}
                    >
                      <Typography sx={{ fontSize: "20px" }}>
                        Frecuencia Cardiaca (bpm)
                      </Typography>
                      <TextField
                        type="number"
                        value={state.heartRate}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_HEART_RATE",
                            payload: e.target.value,
                          })
                        }
                        sx={{ width: "300px" }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingX: "25px",
                      }}
                    >
                      <Typography sx={{ fontSize: "20px" }}>
                        Tasa de Respiración (bpm)
                      </Typography>
                      <TextField
                        type="number"
                        value={state.respirationRate}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_RESPIRATION_RATE",
                            payload: e.target.value,
                          })
                        }
                        sx={{ width: "300px" }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <Button
                        onClick={onSave}
                        sx={{
                          width: "216px",
                          height: "42px",
                          backgroundColor: "#D3AD30",
                          color: "white",
                          borderRadius: "10px",
                        }}
                      >
                        Guardar
                      </Button>
                      <Button
                        onClick={handleOpenTriageModal}
                        value={appointmentData}
                        sx={{
                          width: "216px",
                          height: "42px",
                          backgroundColor: "#115026",
                          color: "white",
                          borderRadius: "10px",
                        }}
                      >
                        Enviar a Atención
                      </Button>
                      <Button
                        sx={{
                          width: "216px",
                          height: "42px",
                          backgroundColor: "#FA2424",
                          color: "white",
                          borderRadius: "10px",
                        }}
                      >
                        Descartar
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          }
          {isModifying &&
            <UpdateAppointment
              onReturn={() => setIsModifying(false)}
              fullname={appointmentData.fullname}
              appointmentId={appointmentData.id}
            />
          }
          {isView && (
            <WatchAppoinment
              appointmentId={appointmentData.id}
              fullname={appointmentData.fullname}
              time={appointmentData.time}
              onReturn={() => setIsView(false)}
            />
          )}
          {openCancelModal && (
            <CancelAppointmentModal
              open={openCancelModal}
              onClose={handleCloseCancelModal}
              onCancel={onCancel}
              onCancelInasistance={onCancelInasistance}
              comment={comment}
              handleComment={handleComment}
            />
          )}
          {openTriageModal && (
            <TriageModal
              open={openTriageModal}
              onClose={handleCloseTriageModal}
              onSend={onSend}
              date={appointmentData.time}
              fullname={appointmentData.fullname}
              status={state.triageStatus}
            />
          )}
          {openSentToAttend && (
            <SentToAttendModal
              date={appointmentData.time.split("T")[0]}
              fullname={appointmentData.fullname}
              onClose={handleCloseSentToAttendModal}
              open={openSentToAttend}
              status={state.triageStatus}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
