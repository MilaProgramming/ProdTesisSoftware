import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

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

export const TriageModal = ({ open, onClose, fullname, date, status, onSend }) => {
  const [triageStatus, setTriageStatus] = useState(StatusNumbers[status]);
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
        <Typography sx={{ fontSize: "32px" }}>
          {"Triage determinado:"}
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
            <Typography>{`${fullname} | ${date.split("T")[1]}`}</Typography>
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
        <Typography sx={{ fontSize: "24px" }}>
          {"Si deseas, puedes corregirlo antes de enviarlo a atención:"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Button
            value={"resuscitation"}
            onClick={(event) => setTriageStatus(event.target.value)}
            sx={{
              width: "150px",
              height: "35px",
              backgroundColor: StatusColor.resuscitation,
              color: "white",
              margin: "5px 0",
              borderRadius: "10px",
            }}
          >
            Reanimacion
          </Button>
          <Button
            value={"emergency"}
            onClick={(event) => setTriageStatus(event.target.value)}
            sx={{
              width: "150px",
              height: "35px",
              backgroundColor: StatusColor.emergency,
              color: "white",
              margin: "5px 0",
              borderRadius: "10px",
            }}
          >
            Emergencia
          </Button>
          <Button
            value={"urgency"}
            onClick={(event) => setTriageStatus(event.target.value)}
            sx={{
              width: "150px",
              height: "35px",
              backgroundColor: StatusColor.urgency,
              color: "white",
              margin: "5px 0",
              borderRadius: "10px",
            }}
          >
            Urgencia
          </Button>
          <Button
            value={"minorUrgency"}
            onClick={(event) => setTriageStatus(event.target.value)}
            sx={{
              width: "150px",
              height: "35px",
              backgroundColor: StatusColor.minorUrgency,
              color: "white",
              margin: "5px 0",
              borderRadius: "10px",
            }}
          >
            Urgencia Menor
          </Button>
          <Button
            value={"noUrgency"}
            onClick={(event) => setTriageStatus(event.target.value)}
            sx={{
              width: "150px",
              height: "35px",
              backgroundColor: StatusColor.noUrgency,
              color: "white",
              margin: "5px 0",
              borderRadius: "10px",
            }}
          >
            Sin Urgencia
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Button
            onClick={onSend}
            sx={{
              height: "45px",
              width: "175px",
              backgroundColor: "#115026",
              color: "white",
              borderRadius: "10px",
            }}
          >
            Enviar
          </Button>
          <Button
            onClick={onClose}
            sx={{
              height: "45px",
              width: "175px",
              backgroundColor: "#A02211",
              color: "white",
              borderRadius: "10px",
            }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
