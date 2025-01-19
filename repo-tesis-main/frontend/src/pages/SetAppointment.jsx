import dayjs from "dayjs";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { CustomDrawer } from "../components/Drawer/CustomDrawer";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InfoIcon from "@mui/icons-material/Info";
import "../css/SetAppointmentButtons.css";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { useNavigate } from "react-router-dom";
import SessionContext from "../context/SessionContext";
import { ConfirmAppointmentModal } from "../components/ConfirmAppointmentModal/ConfirmAppointmentModal";
import axios from "axios";
import { environment } from "../utils/evironment";
import { toast } from "react-toastify";

export const SetAppointment = () => {
  const [appointmentTime, setAppointmentTime] = useState();
  const [appointmentOption, setAppointmentOption] = useState("today");
  const [todayButtonClass, setTodayButtonClass] = useState(true);
  const [otherDayButtonClass, setOtherDayButtonClass] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(dayjs(Date.now()));
  const [affections, setAffections] = React.useState({
    fever: false,
    injury: false,
    pain: false,
  });
  const [painLevel, setPainLevel] = useState(0);
  const [commentForNurse, setCommentForNurse] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [appointmentScheduled, setAppointmentScheduled] = useState(false);
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();

  const handleCheckbox = (event) => {
    setAffections({
      ...affections,
      [event.target.name]: event.target.checked,
    });
  };

  const handleRadio = (event) => {
    setPainLevel(event.target.value);
  };

  const handleComment = (event) => {
    setCommentForNurse(event.target.value);
  };

  const handleDate = (date) => {
    setAppointmentDate(date);
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

    let response;

    if (appointmentOption === "today") {
      response = await axios.post(
        `${environment.apiUrl}/appointments/${user.username}`,
        {
          appointmentStatus: "pending",
          appointmentDate: `${formattedDate} ${formattedTime}`,
          affections: { ...affections },
          observations: commentForNurse,
          painLevel: painLevel,
        }
      );
    } else {
      response = await axios.post(
        `${environment.apiUrl}/appointments/${user.username}`,
        {
          appointmentStatus: "pending",
          appointmentDate: `${formattedDate} ${formattedTime}`,
          observations: commentForNurse,
        }
      );
    }
    if (response !== null) {
      toast.error(response.detail);
    }
    setAppointmentScheduled(true);
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
          }}
        >
          <Typography
            sx={{ fontSize: "48px", lineHeight: "1", letterSpacing: "0" }}
          >
            {"Agendar Turno"}
          </Typography>
          <Divider sx={{ borderColor: "black", paddingTop: "13px" }} />
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
            {appointmentOption === "today" ? (
              <Box
                flex={4}
                sx={{
                  alignSelf: "start",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <Typography sx={{ fontSize: "24px" }}>
                  Seleccione la hora:
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker"]}>
                    <TimePicker
                      label=" "
                      value={appointmentTime}
                      onChange={(newTime) => setAppointmentTime(newTime)}
                      sx={{ width: "100%", paddingRight: "50px" }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <Typography sx={{ fontSize: "24px" }}>
                  Selecciona si tienes alguna afección:
                </Typography>
                <FormControl component="fieldset" variant="standard">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={affections.fever}
                          onChange={handleCheckbox}
                          name="fever"
                        />
                      }
                      label="Temperatura alta"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={affections.injury}
                          onChange={handleCheckbox}
                          name="injury"
                        />
                      }
                      label="Lesión o herida"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={affections.pain}
                          onChange={handleCheckbox}
                          name="pain"
                        />
                      }
                      label="Dolor o malestar general"
                    />
                  </FormGroup>
                </FormControl>
                {affections.pain && (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ alignSelf: "center" }}>
                      ¿Qué tan fuerte es el dolor?
                    </Typography>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="0"
                        name="radio-buttons-group"
                        value={painLevel}
                        onChange={handleRadio}
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
                )}
                <Box>
                  <Typography sx={{ fontSize: "24px" }}>
                    Agrega un comentario para el enfermero:
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
            ) : (
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["TimePicker"]}>
                      <TimePicker
                        value={appointmentTime}
                        onChange={(newTime) => setAppointmentTime(newTime)}
                        sx={{ width: "100%", paddingRight: "50px" }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "24px" }}>
                    Agrega un comentario para el enfermero:
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

            <Box
              flex={2}
              sx={{
                display: "flex",
                backgroundColor: "#CCE5D0",
                borderRadius: "10px",
                align: "center",
                justifyContent: "center",
                padding: "40px",
                flexDirection: "column",
                height: "fit-content",
              }}
            >
              <InfoIcon sx={{ fontSize: "5em", alignSelf: "center" }} />
              <Typography
                sx={{
                  fontSize: "1.5em",
                  textAlign: "center",
                }}
              >
                RECUERDA
              </Typography>
              <Typography
                sx={{
                  fontSize: "1em",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                Si crees que se trata de un caso grave, contacta a los números
                de emergencia
              </Typography>
            </Box>
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
    </Box>
  );
};
