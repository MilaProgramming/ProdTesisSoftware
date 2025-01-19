import dayjs from "dayjs";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "../css/SetAppointmentButtons.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { environment } from "../utils/evironment";
import { toast } from "react-toastify";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import VisibilityIcon from "@mui/icons-material/Visibility";

dayjs.locale("es");

export const UpdateAppointment = ({ appointmentId, onReturn, fullname }) => {
  const [appointmentTime, setAppointmentTime] = useState();
  const [appointmentDate, setAppointmentDate] = useState(dayjs(Date.now()));

  const navigate = useNavigate();

  const handleDate = (date) => {
    setAppointmentDate(date);
  };

  const handleUpdateBtn = async () => {
    const formatDateTime = `${appointmentDate.year()}-${appointmentDate.month() < 10 ? "0" + (appointmentDate.month() + 1) : appointmentDate.month() + 1}-${appointmentDate.date()}T${appointmentTime.hour()<10?"0"+appointmentTime.hour():appointmentTime.hour()}:${appointmentTime.minute()}`
    const response = await axios.put(
      `${environment.apiUrl}/appointments/`,
      {
        id: appointmentId,
        appointmentDate: formatDateTime
      }
    );
    if (response !== null) {
      toast.error(response.detail);
    }
    onReturn();
  };

  useEffect(() => {
    if (localStorage.getItem("session") == null) {
      navigate("/");
    }
    const getOldDate = async () => {
      const response = await axios.get(`${environment.apiUrl}/appointments/id/${appointmentId}`)
      const data = response.data.appointment.appointmentDate.split("T")
      setAppointmentDate(dayjs(data[0]))
    }
    getOldDate()
  }, []);

  return (
    <>
      <Typography
        sx={{ fontSize: "60px", lineHeight: "1", letterSpacing: "0" }}
      >
        {"Modificar Turno"}
      </Typography>
      <Divider sx={{ borderColor: "black", paddingTop: "13px" }} />
      <Box
        sx={{ paddingTop: "35px", display: "flex", flexDirection: "row" }}
      >
        <IconButton
          onClick={onReturn}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: '60vh',
          overflowY: "auto",
          mt: 2,
        }}
      >
        <List>
          <ListItem
            sx={{
              backgroundColor: "#EBEBEB",
              borderRadius: "12px",
              marginBottom: "10px",
            }}
            button
            onClick={() => { }}
          >
            <ListItemIcon
              sx={{
                justifyContent: "center",
              }}
            >
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText sx={{}}>
              {`${fullname} | ${appointmentDate.format('DD [de] MMMM')}`}
            </ListItemText>
          </ListItem>
        </List>

        <Box sx={{ my: 2 }}>
          <Typography sx={{ fontSize: "24px" }}>
            Modificar la hora:
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
            Modificar la fecha:
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

        <Button
          sx={{
            alignSelf: "center",
            height: "42px",
            width: "216px",
            backgroundColor: "red",
            color: "white",
            marginTop: '20px',
          }}
          className="active-option"
          onClick={handleUpdateBtn}
        >
          Modificar
        </Button>
      </Box>
    </>
  );
};
