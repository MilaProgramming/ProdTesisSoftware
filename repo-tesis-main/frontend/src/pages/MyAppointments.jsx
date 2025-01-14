import { Button, Divider, Typography, Box, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import SessionContext from "../context/SessionContext";
import { CustomDrawer } from "../components/Drawer/CustomDrawer";
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { environment } from "../utils/evironment";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AppointmentDetails } from "./AppointmentDetails";

export const MyAppointments = () => {
  const { user } = useContext(SessionContext);
  //   const user = {
  //     role: "paciente",
  //     fullname: "Pepe Pepito",
  //     email: "pepito@gmail.com"
  // };
  dayjs.locale('es');
  const [currentApptOption, setCurrentApptOption] = useState("pending");
  const [currentActiveButtonClass, setCurrentActiveButtonClass] = useState(0);
  const [isView, setIsView] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState([]);
  const [appts, setAppts] = useState([
    {
      "id": 5,
      "appointmentStatus": "peding",
      "appointmentDate": "2025-01-15T13:00:00",
      "userId": 3
    },
    {
      "id": 6,
      "appointmentStatus": "finish",
      "appointmentDate": "2025-01-22T14:00:00",
      "userId": 3
    },
    {
      "id": 28,
      "appointmentStatus": "cancel",
      "appointmentDate": "2025-01-16T12:15:00",
      "userId": 3
    },
    {
      "id": 30,
      "appointmentStatus": "finish",
      "appointmentDate": "2025-02-01T15:30:00",
      "userId": 3
    },
    {
      "id": 33,
      "appointmentStatus": "pending",
      "appointmentDate": "2025-02-04T15:30:00",
      "userId": 3
    },
    {
      "id": 34,
      "appointmentStatus": "cancel",
      "appointmentDate": "2025-02-05T15:30:00",
      "userId": 3
    }
  ]);

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const response = await axios.get(
          `${environment.apiUrl}/appointments/${user.username}`
        );
        setAppts(response.data);
      } catch (error) {
        console.error("Error al obtener las fechas de las citas:", error);
      } finally {
        //setAreAppointmentsLoaded(false);
      }
    };
    getAppointments();
    // eslint-disable-next-line
  }, []);

  // Función para manejar los clics de los botones

  const handleClick = (index) => {
    setCurrentActiveButtonClass(index);
  };

  const handleCitaClick = (cita) => {
    setSelectedAppointment(cita)
    setIsView(true)
  };

  const getApptsByState = () => {
    switch (currentActiveButtonClass) {
      case 0:
        return appts.filter((appt) => appt.appointmentStatus === 'pending');
      case 1:
        return appts.filter((appt) => appt.appointmentStatus === 'finish');
      case 2:
        return appts;
      default:
        return appts;
    }
  };

  const getColorByState = (state) => {
    switch (state) {
      case 'pending':
        return '#115026';
      case 'finish':
        return '#E0C80C';
      case 'cancel':
        return '#E00C0C';
      default:
        return '#3b1150';
    }
  };

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
          {!isView && (
            <>
              <Typography
                sx={{ fontSize: "60px", lineHeight: "1", letterSpacing: "0" }}
              >
                {"Mis Turnos"}
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
                      setCurrentApptOption("pending");
                      handleClick(0);
                    }}
                    sx={{
                      display: "flex",
                      width: "218px",
                      height: "42px",
                      borderRadius: "15px",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: currentActiveButtonClass === 0 ? "#115026" : "#e3fde8",
                      color: currentActiveButtonClass === 0 ? "white" : "black",
                    }}
                    className={
                      currentActiveButtonClass === 0 ? "active-option" : "inactive-option"
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
                    onClick={() => {
                      setCurrentApptOption("archived");
                      handleClick(1);
                    }}
                    sx={{
                      display: "flex",
                      width: "218px",
                      height: "42px",
                      borderRadius: "15px",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: currentActiveButtonClass === 1 ? "#115026" : "#E3FDE8",
                      color: currentActiveButtonClass === 1 ? "white" : "black",
                    }}
                    className={
                      currentActiveButtonClass === 1 ? "active-option" : "inactive-option"
                    }
                  >
                    Archivados
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
                      setCurrentApptOption("all");
                      handleClick(2);
                    }}
                    sx={{
                      display: "flex",
                      width: "218px",
                      height: "42px",
                      borderRadius: "15px",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: currentActiveButtonClass === 2 ? "#115026" : "#E3FDE8",
                      color: currentActiveButtonClass === 2 ? "white" : "black",
                    }}
                    className={
                      currentActiveButtonClass === 2 ? "active-option" : "inactive-option"
                    }
                  >
                    Todos
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: 300,
                  overflowY: "auto",
                  mt: 2,
                }}
              >
                <List>
                  {getApptsByState().map((appt) => (
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
                        primary={`${dayjs(appt.appointmentDate).format('DD [de] MMMM')} - ${dayjs(appt.appointmentDate).format('HH:mm')}`}
                        secondary={
                          <Box
                            sx={{
                              borderRadius: 1,
                              bgcolor: getColorByState(appt.appointmentStatus),
                              color: "white",
                              textAlign: "center",
                              display: "inline-block",
                              width: "100px",
                              cursor: "pointer"
                            }}
                          >
                            <Typography>{appt.appointmentStatus}</Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </>
          )}
          {isView && (<AppointmentDetails appointmentData={selectedAppointment} onReturn={() => setIsView(false)} />)}
        </Box>
      </Box>
    </Box>
  );
};


/*caja para los bonotes*/
/*caja blanca que no sirve para nada*/
/*caja que tiene el titulo*/
/*caja de main*/
/*caja gigante blanca*/
