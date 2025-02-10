import React, { useContext, useEffect, useReducer, useState } from "react";
import SessionContext from "../context/SessionContext";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { CustomDrawer } from "../components/Drawer/CustomDrawer";
import { Appointment } from "../components/Appointment/Appointment";
import { CancelAppointmentModal } from "../components/CancelAppointmentModal/CancelAppointmentModal";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { environment } from "../utils/evironment";
import { useLocation, useNavigate } from "react-router-dom";
import { SentToAttendModal } from "../components/SentToAttendModal/SentToAttendModal";

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

const attendedAppointmentTypesStaff = [
  "vitalSignes",
  "injection",
  "desinfection",
]

const symptomsLabels = {
  headache: "Dolor de cabeza",
  stomachache: "Dolor de estómago",
  burningThroat: "Ardor de garganta",
  temperature: "Temperatura",
  generalMalaise: "Malestar general",
  theresWound: "Herida",
};

const symptomsValues = {
  1: "Leve",
  2: "Intenso",
};

const woundValues = {
  1: "No Sangra",
  2: "Sangra",
}

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_TRIAGE_STATUS":
      return { ...state, triageStatus: action.payload };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
};

const initialState = {
  triageStatus: null,
};

export const Appointments = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openSentToAttend, setOpenSentToAttend] = useState(false);
  const [symptomsData, setSymptomsData] = useState({});
  const [symptomsComponents, setSymptomsComponents] = useState([]);
  const [appointmentData, setAppointmentData] = useState({});
  const [needsToBeReloaded, setNeedsToBeReloaded] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useContext(SessionContext);
  const [buttonClass] = useState(true);
  const [comment, setComment] = useState("");
  const [observation, setObservation] = useState("");
  const [triageFinished, setTriageFinished] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCloseCancelModal = () => {
    setOpenCancelModal(false);
    localStorage.removeItem("appointment");
  };

  const handleOpenCancelModal = (data) => {
    localStorage.setItem("appointment", JSON.stringify(data));
    setOpenCancelModal(true);
  };

  const onAttend = (data) => {
    setAppointmentData(data);
    setIsAttending(true);
  };

  const handleCloseSentToAttendModal = () => {
    setOpenSentToAttend(false);
  };

  const handleObservation = (event) => {
    setObservation(event.target.value)
  }

  const onSave = () => {
    const saveChanges = async () => {
      const response = await axios.put(`${environment.apiUrl}/appointments/details`, {
        appointmentId: appointmentData.id,
        triageStatus: state.triageStatus !== "" ? state.triageStatus : "",
        observations: observation,
        ...symptomsData
      });
      const changeResponse = await axios.put(`${environment.apiUrl}/appointments/${appointmentData.id}/finished?observations=${observation}`)
      setIsAttending(false);
      if (response.data.status === 200 && changeResponse.data.status === 200) {
        toast.success("Los Datos se guardaron correctamente");
      } else {
        toast.error("Ocurrio un error al guardar los datos")
      }
    };
    saveChanges();
    setNeedsToBeReloaded(true);
    dispatch({ type: "RESET_STATE" });
  };

  const onCancel = (event) => {
    const changeStatus = async (appointmentId) => {
      const response = axios.put(`${environment.apiUrl}/appointments/${appointmentId}/canceled?observations=${comment}`);
      if (response.data.status === 200) {
        toast.success("Cita cancelada exitosamente!");
      } else {
        toast.error("La cita no fue cancelada.");
      }
    };
    setComment("");
    changeStatus(event.target.value);
    setOpenCancelModal(false);
    setNeedsToBeReloaded(true);
  };

  const onCancelInasistance = (event) => {
    const changeStatus = async (appointmentId) => {
      const response = await axios.put(`${environment.apiUrl}/appointments/${appointmentId}/canceled?observations=Cancelado por inasistencia`);
      if (response.data.status === 200) {
        toast.success("Cita cancelada exitosamente!");
      } else {
        toast.error("La cita no fue cancelada.");
      }
    };
    setComment("");
    changeStatus(event.target.value);
    setOpenCancelModal(false);
    setNeedsToBeReloaded(true);
  };

  const handleComment = (event) => {
    setComment(event.target.value);
  };

  useEffect(() => {
    if (localStorage.getItem("session") === null || localStorage.getItem("session") === "null") navigate("/")
    if (location.state && location.state.isAttending && location.state.patientData) {
      setAppointmentData(location.state.patientData);
      setIsAttending(true);
    }
  }, [])

  useEffect(() => {
    const getAppointmentsByDate = async () => {
      const response = await axios.get(
        `${environment.apiUrl}/appointments/doctor-appointments/${user.id}`
      );
      const appointmentsByDate = response.data.appointments.reduce(
        (acc, appointment) => {
          const date = appointment.appointmentDate.split("T")[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(appointment);
          return acc;
        },
        {}
      );
      const appointmentByDatesComponentsStaff = [];
      const appointmentByDatesComponentsDr = [];
      const dates = Object.keys(appointmentsByDate);
      for (const date of dates) {
        const appointments = appointmentsByDate[date];
        const appointmentComponentsDr = [];
        const appointmentComponentsStaff = [];
        if (date >= new Date().toISOString().split("T")[0]) {
          appointments.forEach((appointment) => {
            if (attendedAppointmentTypesStaff.includes(appointment.appointmentType)) {
              appointmentComponentsStaff.push(
                <Appointment
                  key={`appointment-${appointment.id}`}
                  id={appointment.id}
                  time={appointment.appointmentDate.split("T")[1]}
                  fullname={appointment.userFullname}
                  status={appointment.appointmentStatus}
                  onAttend={onAttend}
                  onCancel={handleOpenCancelModal}
                  appointmentType={appointment.appointmentType}
                />
              );
            } else {
              appointmentComponentsDr.push(
                <Appointment
                  key={`appointment-${appointment.id}`}
                  id={appointment.id}
                  time={appointment.appointmentDate.split("T")[1]}
                  fullname={appointment.userFullname}
                  status={appointment.appointmentStatus}
                  onAttend={onAttend}
                  onCancel={handleOpenCancelModal}
                  appointmentType={appointment.appointmentType}
                />
              );
            }
          });
          if (appointmentComponentsDr.length > 0) {
            appointmentByDatesComponentsDr.push(
              <Box
                key={`appointments-date-${date}`}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Typography sx={{ fontSize: "24px" }}>{date}</Typography>
                <Divider sx={{ borderColor: "black" }} />
                {appointmentComponentsDr}
              </Box>
            );
          }
          if (appointmentComponentsStaff.length > 0) {
            appointmentByDatesComponentsStaff.push(
              <Box
                key={`appointments-date-${date}`}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Typography sx={{ fontSize: "24px" }}>{date}</Typography>
                <Divider sx={{ borderColor: "black" }} />
                {appointmentComponentsStaff}
              </Box>
            );
          }
        }
      }
      setPendingAppointments(user.role === "medical_staff" ? appointmentByDatesComponentsStaff : appointmentByDatesComponentsDr);
    };
    getAppointmentsByDate();
    setNeedsToBeReloaded(false);
    // eslint-disable-next-line
  }, [needsToBeReloaded]);

  useEffect(() => {
    const getAppointmentData = async () => {
      const response = await axios.get(
        `${environment.apiUrl}/appointments/details/${appointmentData.id}`
      );
      const appointmentDetails = response.data.appointmentDetails;

      const getTriage = async () => {
        const response = await axios.post(environment.modelUrl,
          {
            "dolor_cabeza": appointmentDetails.headache,
            "temperatura": appointmentDetails.temperature,
            "dolor_estómago": appointmentDetails.stomachache,
            "malestar_general": appointmentDetails.generalMalaise,
            "dolor_garganta": appointmentDetails.burningThroat,
            "herida": appointmentDetails.theresWound
          }
        )
        dispatch({
          type: "UPDATE_TRIAGE_STATUS",
          payload: response.data.nivel_urgencia,
        })
        appointmentDetails.triageStatus = response.data.nivel_urgencia
      }
      if (appointmentDetails.triageStatus === null) {
        getTriage()
      } else {
        dispatch({
          type: "UPDATE_TRIAGE_STATUS",
          payload: appointmentDetails.triageStatus,
        })
      }
      setSymptomsData({
        "headache": appointmentDetails.headache,
        "temperature": appointmentDetails.temperature,
        "stomachache": appointmentDetails.stomachache,
        "generalMalaise": appointmentDetails.generalMalaise,
        "burningThroat": appointmentDetails.burningThroat,
        "theresWound": appointmentDetails.theresWound
      })
      const tmpComponents = Object.entries(appointmentDetails).map(([symptom, value]) => {
        if (value > 0 && symptom in symptomsLabels) {
          return (
            <Box key={symptom} sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Typography>{`${symptomsLabels?.[symptom]}:`}</Typography>
              <Typography sx={{ fontWeight: "bold" }}>{symptom !== 'theresWound' ? symptomsValues?.[value] : woundValues?.[value]}</Typography>
            </Box>
          );
        }
        return null;
      });
      setSymptomsComponents(tmpComponents.filter((component) => component !== null && component !== undefined));
    };
    if (appointmentData.id !== undefined) {
      getAppointmentData().finally(() => setTriageFinished(true));
    }
    setTriageFinished(false);
    // eslint-disable-next-line
  }, [isAttending]);
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
            height: "100vh",
            overflowY: "auto",
          }}
        >
          {!isAttending &&
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
              </Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                {pendingAppointments.length > 0 ?
                  pendingAppointments
                  :
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <AccessTimeIcon sx={{ height: "70px", width: "auto" }} />
                    <Typography sx={{ fontSize: "40px", alignSelf: "center" }}>
                      No existen turnos pendientes.
                    </Typography>
                  </Box>
                }
              </Box>
            </>
          }
          {isAttending &&
            <>
              {triageFinished ?
                <>
                  <Typography sx={{ fontSize: "48px" }}>
                    Atender Turno
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
                        flexDirection: "column",
                        justifyContent: "space-around",
                        gap: "2rem",
                        paddingX: "2rem",
                      }}
                    >
                      <Typography sx={{ fontSize: "20px" }}>{"El paciente presenta los siguientes malestares:"}</Typography>
                      <Box sx={{ backgroundColor: '#EBEBEB', padding: 2, borderRadius: 3, display: "flex", flexDirection: "column", paddingX: "3rem", gap: 2 }}>
                        {symptomsComponents.length > 0 ? symptomsComponents : (<Typography sx={{ fontSize: "32px" }}>{"El paciente no tiene malestares!"}</Typography>)}
                      </Box>
                      <Box sx={{ paddingLeft: "2rem" }}>
                        <Typography sx={{ fontWeight: "bold" }}>{"Recomendacion del sistema"}</Typography>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: "6px" }}>
                          <Typography>{`Caso de tipo ${state.triageStatus}:`}</Typography>
                          <Typography sx={{
                            color: state.triageStatus ? StatusColor[StatusNumbers[state.triageStatus]] : "#434343",
                          }}>{state.triageStatus ? StatusLabels[StatusNumbers[state.triageStatus]] : "Sin Triage"}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: "2rem",
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: "24px", color: "#666565" }}>{"Observaciones"}</Typography>
                        <Divider sx={{ borderColor: "black" }} />
                      </Box>
                      <Box
                        sx={{ paddingX: "2rem" }}>
                        <TextareaAutosize
                          value={observation}
                          onChange={handleObservation}
                          style={{
                            width: "100%",
                            height: "116px",
                            borderRadius: "28px",
                            padding: "10px",
                          }}
                        />
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
                        <Button onClick={onSave} sx={{ backgroundColor: "#115026", width: "215px", height: "42px", color: "white", borderRadius: "12px" }}>Enviar</Button>
                        <Button onClick={() => {
                          setIsAttending(false);
                          setAppointmentData({});
                        }} sx={{ backgroundColor: "#FA2424", width: "215px", height: "42px", color: "white", borderRadius: "12px" }}>Descartar</Button>
                      </Box>
                    </Box>
                  </Box>
                </>
                :
                <CircularProgress sx={{ display: "flex", justifyContent: "center" }} />
              }
            </>
          }
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
      <ToastContainer />
    </Box>
  );
};
