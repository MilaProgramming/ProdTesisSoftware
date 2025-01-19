import { Box, Button, Divider, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Appointment } from "../components/Appointment/Appointment";
import axios from "axios";
import { environment } from "../utils/evironment";
import SessionContext from "../context/SessionContext";

export const AdminView = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [startTime, setStartTime] = useState(dayjs().hour(7).minute(0));
  const [endTime, setEndTime] = useState(dayjs().hour(18).minute(0));
  const { user } = useContext(SessionContext);

  useEffect(() => {
    const getAppointments = async () => {
      const response = await axios.get(
        `${environment.apiUrl}/appointments/doctor-appointments/${user.id}`
      );
      const filteredData = response.data.appointments.filter((appointment) => {
        const transformedDate = new Date(appointment.appointmentDate);
        const todaysDate = new Date();
        if (
          appointment.appointmentStatus === "pending" &&
          transformedDate.getDate() === todaysDate.getDate() &&
          transformedDate.getMonth() === todaysDate.getMonth() &&
          transformedDate.getFullYear() === todaysDate.getFullYear()
        ) {
          if (transformedDate.getHours() > todaysDate.getHours()) {
            return appointment;
          } else if (transformedDate.getHours() === todaysDate.getHours()) {
            if (transformedDate.getMinutes() > todaysDate.getMinutes()) {
              return appointment;
            }
          }
        }
      });
      const appointmentComponents = [];
      filteredData.forEach((appointment) => {
        appointmentComponents.push(
          <Appointment
            key={`appointment-${appointment.userId}`}
            time={appointment.appointmentDate.split("T")[1]}
            fullname={`${appointment.userFullname}`}
            status={appointment.appointmentStatus}
            id={appointment.userId}
          />
        );
      });
      setPendingAppointments(appointmentComponents);
    };
    getAppointments();
  }, []);
  return (
    <Box
      sx={{
        backgroundColor: "white",
        fontFamily: "Roboto",
        paddingY: "50px",
        paddingX: "100px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography sx={{ fontSize: "60px" }}>{"Bienvenido"}</Typography>
        <Typography sx={{ fontSize: "20px", color: "#727272" }}>
          {"Te proporcionamos los turnos pendientes del día:"}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {pendingAppointments.length > 0 ? (
          pendingAppointments
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            <WatchLaterIcon sx={{ fontSize: "76px" }} />
            <Typography sx={{ fontSize: "48px" }}>
              {"No hay turnos pendientes"}
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Typography sx={{ fontSize: "48px" }}>
          {"Horario de Atención"}
        </Typography>
        <Divider sx={{ borderColor: "black" }} />
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography>De:</Typography>
            <Box
              sx={{ display: "flex", flexDirection: "row", paddingX: "1rem" }}
              components={["TimePicker"]}
            >
              <TimePicker
                value={startTime}
                onChange={(newTime) => setStartTime(newTime)}
              />
            </Box>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography>A:</Typography>
            <Box
              sx={{ display: "flex", flexDirection: "row", paddingX: "1rem" }}
              components={["TimePicker"]}
            >
              <TimePicker
                value={endTime}
                onChange={(newTime) => setEndTime(newTime)}
              />
            </Box>
          </LocalizationProvider>
        </Box>
        <Button
          sx={{
            backgroundColor: "#E00C0C",
            height: "31px",
            width: "140px",
            borderRadius: "10px",
            color: "white",
          }}
        >
          Modificar
        </Button>
      </Box>
    </Box>
  );
};
