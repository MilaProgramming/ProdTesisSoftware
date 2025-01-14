import { Button, Divider, Typography, Box, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import SessionContext from "../context/SessionContext";
import { CustomDrawer } from "../components/Drawer/CustomDrawer";
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { environment } from "../utils/evironment";
import { MedicalHistory } from "./MedicalHistory";

export const AppointmentsQueue = () => {
  const { user } = useContext(SessionContext);

  const [areAppointmentsLoaded, setAreAppointmentsLoaded] = useState(true);
  const [todayAppts, setTodayAppts] = useState([]);
  const [appts, setAppts] = useState([]);
  const [appointmentData, setAppointmentData] = useState({})
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const response = await axios.get(
          `${environment.apiUrl}/appointments/doctor-appointments/${user.id}`
        );
        const data = response.data.appointments;
        const today = dayjs().format('YYYY-MM-DD');
        const auxTodayAppts = data.filter((appt) => dayjs(appt.appointmentDate).format('YYYY-MM-DD') >= today && appt.appointmentStatus === 'pending');
        setAppts(auxTodayAppts)
      } catch (error) {
        console.error("Error al obtener las fechas de las citas:", error);
      } finally {
        setAreAppointmentsLoaded(false);
      }
    };
    getAppointments();
    // eslint-disable-next-line
  }, []);

  const handleCitaClick = (cita) => {
    setAppointmentData(cita)
    setIsAttending(true)
  };

  const handleReturnButton = () => {
    setIsAttending(false)
  }

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
          {isAttending ? (<MedicalHistory userFullname={appointmentData.userFullname} appointmentDate={appointmentData.appointmentDate} onReturn={handleReturnButton} appointmentId={appointmentData.id} />) : (
            <>
              <Typography
                sx={{ fontSize: "60px", lineHeight: "1", letterSpacing: "0" }}
              >
                {"Fila de atención"}
              </Typography>
              <Divider sx={{ borderColor: "black" }} />
              {!areAppointmentsLoaded && (
                <Box
                  sx={{
                    width: "100%",
                    height: 400,
                    overflowY: "auto",
                    mt: 2,
                  }}
                >
                  {
                    appts.length > 0 ? (<List>
                      {appts.map((appt) => (
                        <ListItem
                          sx={{
                            backgroundColor: "#EBEBEB",
                            borderRadius: "12px",
                            marginBottom: "10px",
                          }}
                          key={appt.id} button onClick={() => handleCitaClick(appt)}>
                          <ListItemIcon
                            sx={{
                              justifyContent: "center"
                            }}
                          >
                            <VisibilityIcon />
                          </ListItemIcon>
                          <ListItemText
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between"
                            }}
                            primary={
                              <> {/* Usar un fragmento para agregar varios elementos */}
                                <Typography variant="body1">
                                  {dayjs(appt.appointmentDate).format('HH:mm')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {appt.userFullname}
                                </Typography>
                              </>
                            }
                            secondary={
                              <Button sx={{
                                borderRadius: 1,
                                bgcolor: "#112950",
                                color: "white",
                                textAlign: "center",
                                display: "inline-block",
                                width: "100px",
                              }}>{"Atender"}</Button>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>) : (<Box sx={{ display: "flex", flexDirection: "row" }}>
                      <AccessTimeIcon sx={{ height: "70px", width: "auto" }} />
                      <Typography sx={{ fontSize: "40px", alignSelf: "center" }}>
                        No existen turnos pendientes.
                      </Typography>
                    </Box>)
                  }
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
