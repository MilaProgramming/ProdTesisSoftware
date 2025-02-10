import dayjs from "dayjs";
import {
  Box,
  Button,
  Divider,
  FormControl,
  MenuItem,
  Select,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { CustomDrawer } from "../components/Drawer/CustomDrawer";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "../css/SetAppointmentButtons.css";
import { useLocation, useNavigate } from "react-router-dom";
import SessionContext from "../context/SessionContext";
import { ConfirmAppointmentModal } from "../components/ConfirmAppointmentModal/ConfirmAppointmentModal";
import axios from "axios";
import { environment } from "../utils/evironment";
import { toast, ToastContainer } from "react-toastify";
import { styled } from '@mui/material/styles';
import { Affections } from "../components/Affections/Affections";

const initialStateAffections = {
  headache: { checked: false, value: 0 },
  temperature: { checked: false, value: 0 },
  stomachache: { checked: false, value: 0 },
  disconfort: { checked: false, value: 0 },
  burningThroat: { checked: false, value: 0 },
  theresWound: { checked: false, value: false },
};

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

const setTheresWound = (value) => {
  if (value) {
    return 2;
  } else {
    return 1;
  }
}

export const SetAppointment = () => {
  const [appointmentTime, setAppointmentTime] = useState();
  const [availableTimesComponents, setAvailableTimesComponents] = useState([]);
  const [appointmentOption, setAppointmentOption] = useState("today");
  const [todayButtonClass, setTodayButtonClass] = useState(true);
  const [otherDayButtonClass, setOtherDayButtonClass] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(dayjs(Date.now()));
  const [stateAffections, dispatchAffections] = useReducer(reducerAffections, initialStateAffections)
  const [commentForNurse, setCommentForNurse] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [appointmentScheduled, setAppointmentScheduled] = useState(false);
  const location = useLocation();
  const [actButtonReason, setActButtonReason] = useState("appointment");
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.appointmentType) {
      setActButtonReason(location.state.appointmentType);
    }
  }, []);

  const handleCheckboxChange = (option) => {
    dispatchAffections({ type: 'TOGGLE_CHECKBOX', payload: option });
    if (stateAffections[option].checked && option === 'headache') {
      dispatchAffections({ type: 'UPDATE_SLIDER', payload: { option: option, value: 1 } })
    } else if (!stateAffections[option].checked && option === 'headache') {
      dispatchAffections({ type: 'UPDATE_SLIDER', payload: { option: option, value: 0 } })
    }
  };

  const getAvailableTimes = async () => {
    const response = await axios.get(`${environment.apiUrl}/appointments/dates/${actButtonReason}/${appointmentDate.format("YYYY-MM-DD")}`);
    const newTime = dayjs().hour(Number(response.data.appointmentDates[0].split(":")[0])).minute(Number(response.data.appointmentDates[0].split(":")[1])).second(0)

    setAppointmentTime(newTime)
    if (response.data.status === 200) {
      setAvailableTimesComponents(response.data.appointmentDates.map((time) => {
        return (
          <MenuItem key={time} value={time}>
            {time}
          </MenuItem>
        );
      }))
    }
  };

  useEffect(() => {
    getAvailableTimes();
    // eslint-disable-next-line
  }, [appointmentDate, actButtonReason]);

  const handleChange = (event) => {
    const newTime = dayjs().hour(Number(event.target.value.split(":")[0])).minute(Number(event.target.value.split(":")[1])).second(0)
    setAppointmentTime(newTime);
  };

  const handleSliderChange = (option, value) => {
    dispatchAffections({ type: 'UPDATE_SLIDER', payload: { option, value } });
  };

  const MyButtonReason = styled(Button)(({ theme, active }) => ({
    color: active ? 'white' : 'black',
    backgroundColor: active ? '#115026' : '#e3fde8',
    '&:hover': {
      backgroundColor: active ? '#115026' : '#d3f6d6',
    },
    borderRadius: "15px",
    padding: '10px 20px',
    marginRight: theme.spacing(2),
    margin: theme.spacing(1),
  }));

  const handleClickReason = (reason) => {
    setActButtonReason(reason);
  };

  const handleComment = (event) => {
    setCommentForNurse(event.target.value);
  };

  const handleDate = (date) => {
    setAppointmentDate(date);
    getAvailableTimes();
  };

  const handleOpenModal = () => {
    setAppointmentScheduled(false);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async () => {
    const formattedDate = appointmentDate.format("YYYY-MM-DD");

    const formattedTime = appointmentTime.format("HH:mm:ss");

    const response = await axios.post(
      `${environment.apiUrl}/appointments/${user.username}?newUserFromAppointment=false`,
      {
        headache: stateAffections.headache.checked ? stateAffections.headache.value : 0,
        temperature: stateAffections.temperature.checked ? 1 : 0,
        stomachache: stateAffections.stomachache.checked ? 1 : 0,
        generalMalaise: stateAffections.disconfort.checked ? 1 : 0,
        burningThroat: stateAffections.burningThroat.checked ? 1 : 0,
        theresWound: stateAffections.theresWound.checked ? setTheresWound(stateAffections.theresWound.value) : 0,
        appointmentType: actButtonReason,
        appointmentStatus: "pending",
        appointmentDate: appointmentOption === "today" ? `${formattedDate} 18:01` : `${formattedDate} ${formattedTime}`,
        observations: commentForNurse,
      }
    );
    if (response !== null) {
      toast.success(`Turno agendado correctamente a las ${response.data.split("T")[1]}`);
      handleCloseModal();
    } else {
      toast.error(response.detail);
    }
    dispatchAffections({ type: "RESET_STATE" })
    setAppointmentDate(dayjs(Date.now()))
    setAppointmentTime(dayjs(Date.now()))
  };

  useEffect(() => {
    if (localStorage.getItem("session") == null) {
      navigate("/");
    }
  });

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#E5E4E4",
        height: "100%",
        fontFamily: "Roboto",
      }}
    >
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
          <Typography
            sx={{ fontSize: "48px", lineHeight: "1", letterSpacing: "0" }}
          >
            {"Agendar turno de atención"}
          </Typography>
          <Divider sx={{ borderColor: "black", paddingTop: "13px" }} />

          <Typography
            sx={{ fontSize: "24px", lineHeight: "1", letterSpacing: "0", paddingTop: "30px" }}
          >
            {"¿Cuál es su motivo de atención?"}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            <MyButtonReason active={actButtonReason === 'appointment'} onClick={() => {
              handleClickReason('appointment')
              dispatchAffections({ type: 'RESET_STATE' })
              setAppointmentTime(dayjs(Date.now()))
              setAppointmentDate(dayjs(Date.now()))
              setCommentForNurse("")
            }}>
              Turno médico
            </MyButtonReason>
            <MyButtonReason active={actButtonReason === 'vitalSignes'} onClick={() => {
              handleClickReason('vitalSignes')
              dispatchAffections({ type: 'RESET_STATE' })
              setAppointmentTime(dayjs(Date.now()))
              setAppointmentDate(dayjs(Date.now()))
              setCommentForNurse("")
            }}>
              Toma de signos vitales
            </MyButtonReason>
            <MyButtonReason active={actButtonReason === 'injection'} onClick={() => {
              handleClickReason('injection')
              dispatchAffections({ type: 'RESET_STATE' })
              setAppointmentTime(dayjs(Date.now()))
              setAppointmentDate(dayjs(Date.now()))
              setCommentForNurse("")
            }}>
              Aplicación de inyección
            </MyButtonReason>
            <MyButtonReason active={actButtonReason === 'desinfection'} onClick={() => {
              handleClickReason('desinfection')
              dispatchAffections({ type: 'RESET_STATE' })
              setAppointmentTime(dayjs(Date.now()))
              setAppointmentDate(dayjs(Date.now()))
              setCommentForNurse("")
            }}>
              Desinfección de herida
            </MyButtonReason>
            <MyButtonReason active={actButtonReason === 'certificate'} onClick={() => {
              handleClickReason('certificate')
              dispatchAffections({ type: 'RESET_STATE' })
              setAppointmentTime(dayjs(Date.now()))
              setAppointmentDate(dayjs(Date.now()))
              setCommentForNurse("")
            }}>
              Validación de certificado
            </MyButtonReason>
          </Box>

          <Typography
            sx={{ fontSize: "24px", lineHeight: "1", letterSpacing: "0", paddingTop: "30px" }}
          >
            {"¿Cúando desea agendar su cita?"}
          </Typography>

          <Box
            sx={{ paddingTop: "35px", display: "flex", flexDirection: "row" }}
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
                onClick={() => {
                  if (appointmentOption !== "today") {
                    setAppointmentOption("today");
                    setTodayButtonClass(!todayButtonClass);
                    setOtherDayButtonClass(!otherDayButtonClass);
                    setAppointmentDate(dayjs(Date.now()));
                  }
                }}
                sx={{
                  display: "flex",
                  width: "218px",
                  height: "42px",
                  borderRadius: "15px",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: todayButtonClass ? "#115026" : "#e3fde8",
                  color: todayButtonClass ? "white" : "black",
                }}
                className={
                  todayButtonClass ? "active-option" : "inactive-option"
                }
              >
                HOY
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
                onClick={() => {
                  if (appointmentOption !== "otherDay") {
                    setAppointmentOption("otherDay");
                    setOtherDayButtonClass(!otherDayButtonClass);
                    setTodayButtonClass(!todayButtonClass);
                    dispatchAffections({ type: 'RESET_STATE' })
                  }
                }}
                sx={{
                  display: "flex",
                  width: "218px",
                  height: "42px",
                  borderRadius: "15px",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: todayButtonClass ? "#E3FDE8" : "#115026",
                  color: todayButtonClass ? "black" : "white",
                }}
                className={
                  todayButtonClass ? "inactive-option" : "active-option"
                }
              >
                OTRO DIA
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              paddingY: "40px",
              justifyContent: "space-around",
            }}
          >
            {appointmentOption === "today" && actButtonReason === "appointment" ? (
              <Box
                flex={4}
                sx={{
                  alignSelf: "start",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <Typography sx={{ fontSize: "1.5em", textAlign: "center", fontWeight: "bold" }}>
                  ¿Siente alguno de estos malestares?
                </Typography>
                <Affections
                  key={"affections"}
                  onCheckboxChange={handleCheckboxChange}
                  onSliderChange={handleSliderChange}
                  options={stateAffections}
                />
              </Box>
            ) : appointmentOption === "today" ? (
              <Box sx={{ justifyItems: 'center' }}>
                <Typography sx={{ fontSize: "24px" }}>
                  ¿Desea agregar algún comentario/especificación al personal que lo atenderá?
                </Typography>
                <TextareaAutosize
                  value={commentForNurse}
                  onChange={handleComment}
                  style={{
                    width: "440px",
                    height: "116px",
                    borderRadius: "28px",
                    padding: "10px",
                  }}
                />
              </Box>) : (
              <Box
                flex={4}
                sx={{
                  alignSelf: "start",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: "24px" }}>
                    Seleccione la fecha:
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker", "DatePicker"]}>
                      <DatePicker
                        value={appointmentDate}
                        onChange={handleDate}
                        sx={{ width: "100%", paddingRight: "50px" }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "24px" }}>
                    Seleccione la hora:
                  </Typography>
                  <FormControl>
                    <Select
                      value={appointmentTime.format("HH:mm")}
                      onChange={handleChange}
                      displayEmpty
                    >
                      {availableTimesComponents}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "24px" }}>
                    ¿Desea agregar algún comentario/especificación al personal que lo atenderá?
                  </Typography>
                  <TextareaAutosize
                    value={commentForNurse}
                    onChange={handleComment}
                    style={{
                      width: "440px",
                      height: "116px",
                      borderRadius: "28px",
                      padding: "10px",
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
          <Button
            sx={{
              alignSelf: "center",
              height: "42px",
              width: "216px",
              backgroundColor: "#115026",
              color: "white",
            }}
            className="active-option"
            onClick={handleOpenModal}
          >
            Agendar
          </Button>
          {openModal && (
            <ConfirmAppointmentModal
              isToday={appointmentOption === "today"}
              open={openModal}
              appointmentDate={appointmentDate.toDate()}
              appointmentTime={appointmentTime.toDate()}
              onClose={handleCloseModal}
              onConfirm={handleSubmit}
              appointmentScheduled={appointmentScheduled}
            />
          )}
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};
