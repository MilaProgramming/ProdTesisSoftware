import React, { useContext, useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { CustomCalendar } from "../components/CustomCalendar/CustomCalendar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import infoIcon from "../assets/infoIcon.png";
import axios from "axios";
import SessionContext from "../context/SessionContext";
import { environment } from "../utils/evironment";

export const PatientView = () => {
  const [appointmentDates, setAppointmentDates] = useState([]);
  const [areAppointmentsLoaded, setAreAppointmentsLoaded] = useState(true);
  const { user } = useContext(SessionContext);

  useEffect(() => {
    const getAppointmentDates = async () => {
      try {
        const response = await axios.get(
          `${environment.apiUrl}/appointments/${user.username}`
        );
        const dates = response.data.map((appointment) => {
          return new Date(appointment.appointmentDate);
        });
        setAppointmentDates(dates);
      } catch (error) {
        console.error("Error al obtener las fechas de las citas:", error);
      } finally {
        setAreAppointmentsLoaded(false);
      }
    };
    getAppointmentDates();
    // eslint-disable-next-line
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
      }}
    >
      <Typography
        sx={{ fontSize: "60px", lineHeight: "1", letterSpacing: "0" }}
      >
        {"Bienvenido"}
      </Typography>
      <Typography
        sx={{
          fontSize: "20px",
          color: "#747474",
          paddingBottom: "30px",
          paddingTop: "15px",
          lineHeight: "1",
        }}
      >
        {"¿En que podemos ayudarte?"}
      </Typography>
      <Box
        sx={{
          width: "auto",
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#CCE5D0",
          borderRadius: "40px",
          padding: "30px",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <Typography
          sx={{ fontSize: "28px", paddingRight: "240px", paddingLeft: "60px" }}
        >
          {
            "Si deseas ser atendido en el centro médico, solicita un turno ahora, o agéndalo para el futuro."
          }
        </Typography>
        <img
          alt="Icono de monitor"
          src={infoIcon}
          style={{ paddingLeft: "30px", paddingRight: "120px" }}
        />
      </Box>
      <Typography sx={{ paddingTop: "26px", fontSize: "40px" }}>
        {"Próximos turnos"}
      </Typography>
      <Divider sx={{ borderColor: "black" }} />
      {!areAppointmentsLoaded && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "25px",
            }}
          >
            {appointmentDates.length > 0 ? (
              appointmentDates.map((item, index) => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      paddingBottom: "20px",
                    }}
                    key={index + "-box"}
                  >
                    <AccessTimeIcon sx={{ height: "70px", width: "auto" }} />
                    <Typography sx={{ fontSize: "40px", alignSelf: "center" }}>
                      {item.toLocaleString()}
                    </Typography>
                  </Box>
                );
              })
            ) : (
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <AccessTimeIcon sx={{ height: "70px", width: "auto" }} />
                <Typography sx={{ fontSize: "40px", alignSelf: "center" }}>
                  No existen turnos pendientes.
                </Typography>
              </Box>
            )}
          </Box>
          <CustomCalendar
            appointmentDates={appointmentDates.map((date) => {
              return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
              );
            })}
          />
        </Box>
      )}
    </Box>
  );
};
