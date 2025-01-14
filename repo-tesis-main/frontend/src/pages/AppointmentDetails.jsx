import { Button, Divider, Paper, TextareaAutosize, Typography, Box, List, ListItem, ListItemText, ListItemIcon, IconButton } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import SessionContext from "../context/SessionContext";
import { CustomDrawer } from "../components/Drawer/CustomDrawer";
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importa la localización en español

export const AppointmentDetails = ({ appointmentData, onReturn }) => {

  dayjs.locale('es'); // Configura dayjs para usar español

  const [appt, setAppt] = useState(appointmentData);

  const [medicalHistory, setMedicalHistory] = useState({
    id: 5,
    diagnostic: "blablablblablablablblablablablbla",
    medications: "blablablblablablablbla",
    instructions: "blablablblablablablblablablablbla",
    userId: 3,
  });

  const formattedDate = dayjs(appt.appointmentDate).format('DD [de] MMMM'); // Formatea la fecha
  const formattedHour = dayjs(appt.appointmentDate).format('HH:mm'); // Formatea la hora
  const [note, setNote] = useState("Observacion que trae back");

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

  const handleCancel = () => {
  };

  return (
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
        <IconButton
          onClick={onReturn}
        ><ChevronLeftIcon /></IconButton>
      </Box>
      <Box
        sx={{
          width: "100%",
          overflowY: "auto",
          mt: 2,
        }}
      >
        <List>
          <ListItem
            sx={{
              bgcolor: "#EBEBEB",
              '&:hover': { bgcolor: '#EBEBEB' },
              borderRadius: "12px",
              marginBottom: "10px",
            }}
            button
            onClick={() => { }}
          >
            <ListItemIcon
              sx={{
                justifyContent: "center"
              }}
            >
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  fontFamily: "Roboto",
                }}
              >
                <Typography variant="subtitle1">
                  {formattedDate} - {formattedHour}
                </Typography>
              </Box>
            </ListItemText>
          </ListItem>
        </List>
        <Box sx={{
          fontFamily: "Roboto",
          display: "flex",
          textAlign: "center",
          flexDirection: "row",
          alignItems: "center",
        }}>
          <Typography variant="h6" gutterBottom>
            Estado:
          </Typography>
          <Box
            sx={{
              borderRadius: 1,
              bgcolor: getColorByState(appt.appointmentStatus),
              color: "white",
              textAlign: "center",
              width: "100px",
              fontFamily: "Roboto",
              padding: "10px",
              marginLeft: "10px"
            }}
          >
            <Typography variant="body2">
              {appt.appointmentStatus}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ width: "400px", paddingTop: "10px" }}>
          <Typography variant="h6" gutterBottom>
            Observaciones:
          </Typography>
          <TextareaAutosize
            value={note !== null && note !== undefined && note !== '' ? note : "No existe ninguna observación"}
            style={{
              width: "673px",
              height: "70px",
              borderRadius: "28px",
              padding: "10px",
            }}
          />
        </Box>
      </Box>
      <div>
        {
          (() => {
            switch (appt.appointmentStatus) {
              case "finish":
                return (
                  <div sx={{ padding: "10px" }}>
                    <Typography variant="h6" gutterBottom>
                      Historial médico:
                    </Typography>
                    <Paper
                      sx={{
                        padding: 2,
                        border: "1px solid black",
                        borderRadius: 6,
                      }}
                    >
                      <Typography variant="body1" color="black">
                        <span style={{ color: 'green' }}>Diagnóstico:</span> {medicalHistory.diagnostic}
                      </Typography>
                      <Typography variant="body1" color="black">
                        <span style={{ color: 'green' }}>Medicamento:</span> {medicalHistory.medications}
                      </Typography>
                      <Typography variant="body1" color="black">
                        <span style={{ color: 'green' }}>Indicaciones:</span> {medicalHistory.instructions}
                      </Typography>
                    </Paper>
                  </div>
                );
              case "pending":
                return (
                  <div sx={{ padding: "10px" }}>
                    <Button sx={{
                      bgcolor: "#E00C0C",
                      color: "white",
                      textAlign: "center",
                      marginTop: "40px"
                    }} onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </div>
                );
              default:
                return <div></div>;
            }
          })()
        }
      </div>
    </>
  );
};
