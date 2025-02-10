import { Box, Button, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { Appointment } from "../components/Appointment/Appointment";
import axios from "axios";
import { environment } from "../utils/evironment";
import SessionContext from "../context/SessionContext";
import { useNavigate } from "react-router-dom";

const attendedAppointmentTypesDoctor = {
  "appointment": 0,
  "certificate": 1
}

const attendedAppointmentTypesStaff = {
  "vitalSignes": 0,
  "injection": 1,
  "desinfection": 2,
}

const statisticsLabelsDoctor = {
  "appointment": "Turnos Médicos",
  "certificate": "Validación de Certificado"
}
const statisticsLabelsStaff = {
  "vitalSignes": "Toma de Signos Vitales",
  "injection": "Aplicación de Inyección",
  "desinfection": "Desinfección de Heridas",
}

export const StaffView = ({ onClick }) => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [statisticsComponents, setStatisticsComponents] = useState([]);
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();

  const onAttend = (data) => {
    navigate("/appointments", { state: { isAttending: true, patientData: data } })
  }

  useEffect(() => {
    const getAppointments = async () => {
      const response = await axios.get(
        `${environment.apiUrl}/appointments/doctor-appointments/${user.id}`
      );
      const appointments = response.data.appointments;
      let attendedAppointments;
      if (user.role === "medical_staff") {
        attendedAppointments = [0, 0, 0]
      } else {
        attendedAppointments = [0, 0]
      }
      let filteredData = [];
      for (const appointment of appointments) {
        const transformedDate = new Date(appointment.appointmentDate);
        const todaysDate = new Date();
        if (appointment.appointmentStatus === "finished") {
          if (user.role === "medical_staff") {
            if (appointment.appointmentType === "vitalSignes") {
              attendedAppointments[attendedAppointmentTypesStaff.vitalSignes] += 1;
            } else if (appointment.appointmentType === "injection") {
              attendedAppointments[attendedAppointmentTypesStaff.injection] += 1;
            } else if (appointment.appointmentType === "desinfection") {
              attendedAppointments[attendedAppointmentTypesStaff.desinfection] += 1;
            }
          } else {
            if (appointment.appointmentType === "appointment") {
              attendedAppointments[attendedAppointmentTypesDoctor.appointment] += 1;
            } else if (appointment.appointmentType === "certificate") {
              attendedAppointments[attendedAppointmentTypesDoctor.certificate] += 1;
            }
          }
        }
        if (
          appointment.appointmentStatus === "pending" &&
          transformedDate.getDate() === todaysDate.getDate() &&
          transformedDate.getMonth() === todaysDate.getMonth() &&
          transformedDate.getFullYear() === todaysDate.getFullYear()
        ) {
          console.log("entra", todaysDate);
          if (transformedDate.getHours() > todaysDate.getHours()) {
            filteredData.push(appointment);
          } else if (transformedDate.getHours() === todaysDate.getHours()) {
            if (transformedDate.getMinutes() > todaysDate.getMinutes()) {
              filteredData.push(appointment);
            }
          }
        }
      }
      const statistics = [];
      for (let i = 0; i < attendedAppointments.length; i++) {
        statistics.push(
          <Box
            key={`statistics-${i}`}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
              width: "100%"
            }}
          >
            {
              user.role === "medical_staff" ?
                <>
                  <Typography sx={{ fontSize: "20px" }}>{statisticsLabelsStaff[Object.keys(attendedAppointmentTypesStaff)[i]]} </Typography>
                  <Typography sx={{ fontSize: "40px" }}>{attendedAppointments[i]}</Typography>
                </>
                :
                <>
                  <Typography sx={{ fontSize: "20px" }}>{statisticsLabelsDoctor[Object.keys(attendedAppointmentTypesDoctor)[i]]} </Typography>
                  <Typography sx={{ fontSize: "40px" }}>{attendedAppointments[i]}</Typography>
                </>
            }

          </Box>
        );
      }
      setStatisticsComponents(statistics);
      const appointmentComponentsDr = [];
      const appointmentComponentsStaff = [];
      filteredData.forEach((appointment) => {
        if (Object.keys(attendedAppointmentTypesStaff).includes(appointment.appointmentType)) {
          appointmentComponentsStaff.push(
            <Appointment
              key={`appointment-${appointment.id}`}
              time={appointment.appointmentDate.split("T")[1]}
              fullname={`${appointment.userFullname}`}
              status={appointment.appointmentStatus}
              id={appointment.id}
              onAttend={onAttend}
              appointmentType={appointment.appointmentType}
            />
          );
        } else {
          appointmentComponentsDr.push(
            <Appointment
              key={`appointment-${appointment.id}`}
              time={appointment.appointmentDate.split("T")[1]}
              fullname={`${appointment.userFullname}`}
              status={appointment.appointmentStatus}
              id={appointment.id}
              onAttend={onAttend}
              appointmentType={appointment.appointmentType}
            />
          );
        }
      });
      if (user.role === "medical_staff") {
        setPendingAppointments(appointmentComponentsStaff);
      } else {
        setPendingAppointments(appointmentComponentsDr);
      }
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
        minHeight: "100vh",
        overflowY: "fit-content",
      }}
    >
      <Box>
        <Typography sx={{ fontSize: "60px" }}>{"Bienvenido"}</Typography>
        <Typography sx={{ fontSize: "20px", color: "#727272" }} >Turnos Atendidos</Typography>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
          {statisticsComponents}
        </Box>
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
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3rem" }}>
        <Typography sx={{ fontSize: '24px', color: "#727272" }}>{"Para atender a una persona por ventanilla o no registrada en los turnos"}</Typography>
        <Button onClick={() => onClick(true)} sx={{ borderRadius: "10px", color: "#115026", backgroundColor: "#E3FDE8", width: "400px", height: "60px" }}>{"Reserva de Turno"}</Button>
      </Box>
    </Box>
  );
};
