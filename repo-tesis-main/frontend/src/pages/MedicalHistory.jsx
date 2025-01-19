import { Paper, styled, TextField, TextareaAutosize, Button, Divider, Typography, Box, List, ListItem, ListItemText, ListItemIcon, appBarClasses, IconButton } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import SessionContext from "../context/SessionContext";
import { CustomDrawer } from "../components/Drawer/CustomDrawer";
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importa la localización en español
import { environment } from "../utils/evironment";

dayjs.locale("es");

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

export const MedicalHistory = ({ appointmentId, onReturn, appointmentDate, userFullname, }) => {
  const [appt, setAppt] = useState({
    id: 5,
    appointmentStatus: "peding",
    urgency: "grave",
    appointmentDate: "2025-01-15T13:00:00",
    userId: 3,
    name: "Hola German"
  });
  const formattedDate = dayjs(appointmentDate).format('DD [de] MMMM'); // Formatea la fecha
  const formattedHour = dayjs(appointmentDate).format('HH:mm'); // Formatea la hora
  const [diagnosticText, setDiagnosticText] = useState("");
  const [medicineText, setMedicineText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const response = await axios.get(
          `${environment.apiUrl}/appointments/details/${appointmentId}`
        );
        const data = response.data.appointmentDetails
        setAppt(data);
        setDiagnosticText(data.diagnostic)
        setMedicineText(data.prescription)
        setInstructionsText(data.indications)
        setNoteText(data.observations)
      } catch (error) {
        console.error("Error al obtener las fechas de las citas:", error);
      } finally {

      }
    };
    getAppointments();
    // eslint-disable-next-line
  }, []);

  const handleDiagnosticComment = (event) => {
    setDiagnosticText(event.target.value);
  };

  const handleMedicineComment = (event) => {
    setMedicineText(event.target.value);
  };

  const handleInstructionsComment = (event) => {
    setInstructionsText(event.target.value);
  };

  const handleNoteComment = (event) => {
    setNoteText(event.target.value);
  };

  const handleSend = () => {
    handleSave();
    const changeAppointmentStatus = () => {
      const response = axios.put(`${environment.apiUrl}/appointments/${appointmentId}/finished`)
    }
    changeAppointmentStatus();
    onReturn()
  };

  const handleSave = () => {
    const saveData = async () => {
      const response = axios.put(`${environment.apiUrl}/appointments/details`, {
        appointmentId,
        generalAffections: { ...appt.generalAffections },
        painLevel: appt.painLevel,
        vitalSigns: {
          ...appt.vitalSigns
        },
        triageStatus: appt.triageStatus,
        patientStatus: appt.patientStatus,
        theresLession: appt.theresLession,
        observations: noteText,
        diagnostic: diagnosticText,
        prescription: medicineText,
        indications: instructionsText
      });
    }
    saveData();
  };

  return (
    <>
      <Typography
        sx={{ fontSize: "60px", lineHeight: "1", letterSpacing: "0" }}
      >
        {"Historial Médico"}
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
            <ListItemText>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography variant="subtitle1">
                  {userFullname} | {formattedDate} - {formattedHour}
                </Typography>
                <Box
                  sx={{
                    borderRadius: 1,
                    bgcolor: StatusColor[StatusNumbers[appt.triageStatus]],
                    color: "white",
                    textAlign: "center",
                    display: "inline-block",
                    width: "100px",
                    alignContent: "center"
                  }}
                >
                  <Typography>
                    {StatusLabels[StatusNumbers[appt.triageStatus]]}
                  </Typography>
                </Box>
              </Box>
            </ListItemText>
          </ListItem>
        </List>
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Diagnóstico:
          </Typography>
          <TextareaAutosize
            value={diagnosticText}
            onChange={handleDiagnosticComment}
            style={{
              width: "700px",
              borderRadius: "28px",
              padding: "10px",
            }}
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Medicamento:
          </Typography>
          <TextareaAutosize
            value={medicineText}
            onChange={handleMedicineComment}
            style={{
              width: "700px",
              borderRadius: "28px",
              padding: "10px",
            }}
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Indicaciones:
          </Typography>
          <TextareaAutosize
            value={instructionsText}
            onChange={handleInstructionsComment}
            style={{
              width: "700px",
              borderRadius: "28px",
              padding: "10px",
            }}
          />
        </Box>
        <Box sx={{
          display: 'flex',
          width: '100%',
          flexDirection: "row"
        }}>
          <Box sx={{ width: "400px" }}>
            <Typography variant="h6" gutterBottom>
              Observaciones:
            </Typography>
            <TextareaAutosize
              value={noteText}
              onChange={handleNoteComment}
              style={{
                width: "400px",
                height: "70px",
                borderRadius: "28px",
                padding: "10px",
              }}
            />
          </Box>
          <Box sx={{
            flexDirection: "column",
            justifyContent: "center",
            display: 'flex',
            padding: "20px",
            paddingTop: "40px",
            paddingLeft: "30px"
          }}>
            <Button sx={{
              bgcolor: "#5461F2",
              color: "white",
              textAlign: "center",
              margin: "5px"
            }} onClick={handleSave}>
              Guardar
            </Button>
            <Button sx={{
              bgcolor: "#115026",
              color: "white",
              textAlign: "center",
              margin: "5px"
            }} onClick={handleSend}>
              Enviar
            </Button>
          </Box>

        </Box>
      </Box>
    </>
  );
};
