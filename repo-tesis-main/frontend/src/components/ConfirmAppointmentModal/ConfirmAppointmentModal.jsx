import React from "react";
import { months } from "../../utils/constants";
import { Box, Typography, Button, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
  padding: "24px",
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
};

export const ConfirmAppointmentModal = ({
  open,
  onClose,
  onConfirm,
  appointmentDate,
  appointmentTime,
  appointmentScheduled,
}) => {
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      {!appointmentScheduled ? (
        <Box sx={{ ...style }}>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 8, right: 8 }} // Posiciona el IconButton
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ fontSize: "40px" }} component="h2" align="center">
            Estás a punto de agendar un turno
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
              color: "#808080",
            }}
          >
            <Typography sx={{ fontSize: "36px" }}>
              {`${appointmentDate.getDate()} de ${
                months[appointmentDate.getMonth()]
              } del ${appointmentDate.getFullYear()}`}
            </Typography>
            <Typography sx={{ fontSize: "36px" }}>
              {appointmentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 4 }}>
            <Button variant="contained" color="success" onClick={onConfirm}>
              Sí, deseo agendar
            </Button>
            <Button variant="contained" color="error" onClick={onClose}>
              No, deseo regresar
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ ...style }}>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 8, right: 8 }} // Posiciona el IconButton
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ fontSize: "40px" }} component="h2" align="center">
            {"¡Tu turno ha sido agendado con éxito!"}
          </Typography>
          <Button
            sx={{ width: "120px", alignSelf: "center" }}
            variant="contained"
            color="success"
            onClick={onClose}
          >
            Aceptar
          </Button>
        </Box>
      )}
    </Modal>
  );
};
