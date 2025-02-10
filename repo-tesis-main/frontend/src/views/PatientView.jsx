import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import infoIcon from "../assets/infoIcon.png";
import ScheduleIcon from '@mui/icons-material/Schedule';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import AirlineSeatLegroomReducedIcon from '@mui/icons-material/AirlineSeatLegroomReduced';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const buttonStyles = {
  backgroundColor: "#E3FDE8",
  color: "#115026",
  borderRadius: "12px",
  padding: "20px",
  margin: "10px",
  width: "400px",
  justifyContent: "flex-start"
};

const iconStyles = {
  marginRight: 1,
  color: "black"
}

export const PatientView = () => {
  const navigate = useNavigate();

  const onClickOptionButton = (option) => {
    navigate('/set-appointment', { state: { appointmentType: option.target.value } });
  }


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
        overflowY: "auto",
        height: "100vh",
        gap: "5em",
      }}
    >
      <Box>
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
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Button
            value="appointment"
            onClick={onClickOptionButton}
            sx={{ ...buttonStyles }}
          >
            <ScheduleIcon sx={{ ...iconStyles }} />
            Agendar Cita
          </Button>
          <Button
            value="vitalSignes"
            onClick={onClickOptionButton}
            sx={{ ...buttonStyles }}
          >
            <WaterDropIcon sx={{ ...iconStyles }} />
            Toma de signos vitales
          </Button>
          <Button
            value="injection"
            onClick={onClickOptionButton}
            sx={{ ...buttonStyles }}
          >
            <VaccinesIcon sx={{ ...iconStyles }} />
            Aplicación de inyecciones
          </Button>
          <Button
            value="desinfection"
            onClick={onClickOptionButton}
            sx={{ ...buttonStyles }}
          >
            <AirlineSeatLegroomReducedIcon sx={{ ...iconStyles }} />
            Desinfección de heridas
          </Button>
          <Button
            value="certificate"
            onClick={onClickOptionButton}
            sx={{ ...buttonStyles }}
          >
            <InsertDriveFileIcon sx={{ ...iconStyles }} />
            Validar certificado médico
          </Button>
        </Box>
        <Box
          sx={{
            width: "auto",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#CCE5D0",
            borderRadius: "40px",
            padding: "30px",
            alignItems: "center",
            alignSelf: "center",
            height: "fit-content",
          }}
        >
          <img
            alt="Icono de monitor"
            src={infoIcon}
          />
          <Typography sx={{ fontSize: "1.5em", fontWeight: "bold" }}>
            {"Atención"}
          </Typography>

          <Typography
            sx={{ fontSize: "1em", marginTop: 2 }}
          >
            {
              "Si te encuentras ante un caso grave, contacta a los números de emergencia:"
            }
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
            <span style={{ fontWeight: 'bold' }}>911</span> Emergencias<br />
            <span style={{ fontWeight: 'bold' }}>131</span> Cruz Roja<br />
            <span style={{ fontWeight: 'bold' }}>102</span> Bomberos
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
