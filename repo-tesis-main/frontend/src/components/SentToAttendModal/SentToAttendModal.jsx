import React from "react";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 400,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  padding: "3rem",
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  gap: "2rem",
};

export const SentToAttendModal = ({ open, onClose, fullname, date, status }) => {
  const triageStatus = StatusNumbers[status];
  const color = StatusColor[triageStatus];
  const statusLabel = StatusLabels[triageStatus];
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...style }}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }} // Posiciona el IconButton
        >
          <CloseIcon />
        </IconButton>
        <Typography sx={{ fontSize: "32px", alignSelf: "center" }}>
          {"Turno Enviado a Atención"}
        </Typography>
        <Box
          sx={{
            backgroundColor: "#EBEBEB",
            borderRadius: "14px",
            fontSize: "20px",
            fontWeight: "600px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "20px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: "8px" }}>
            <VisibilityOutlinedIcon />
            <Typography>{`${fullname} | ${date}`}</Typography>
          </Box>
          <Box
            sx={{
              borderRadius: "10px",
              color: "white",
              paddingX: "10px",
              backgroundColor: color,
            }}
          >
            <Typography>{statusLabel}</Typography>
          </Box>
        </Box>
        <Button onClick={onClose} sx={{ borderRadius: "10px", backgroundColor: "#115026", color: "white", width: "175px", height: "45px", alignSelf: "center" }}>Aceptar</Button>

      </Box>
    </Modal>)
}
