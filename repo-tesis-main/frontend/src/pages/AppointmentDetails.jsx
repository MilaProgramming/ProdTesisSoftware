import { Button, Divider, Paper, TextareaAutosize, Typography, Box, List, ListItem, ListItemText, ListItemIcon, IconButton } from "@mui/material";
import React, { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importa la localización en español
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { environment } from "../utils/evironment";
import { CancelAppointmentModal } from "../components/CancelAppointmentModal/CancelAppointmentModal";

const appointmentStatusLabels = {
  "pending": "Pendiente",
  "finished": "Finalizado",
  "canceled": "Cancelado",
}

export const AppointmentDetails = ({ appointmentData, onReturn }) => {

  dayjs.locale('es'); // Configura dayjs para usar español

  const formattedDate = dayjs(appointmentData.appointmentDate).format('DD [de] MMMM'); // Formatea la fecha
  const formattedHour = dayjs(appointmentData.appointmentDate).format('HH:mm'); // Formatea la hora
  const note = appointmentData.observations

  const getColorByState = (state) => {
    switch (state) {
      case 'pending':
        return '#115026';
      case 'finished':
        return '#E0C80C';
      case 'canceled':
        return '#E00C0C';
      default:
        return '#3b1150';
    }
  };

  const [openCancelModal, setOpenCancelModal] = useState(false);

  const [comment, setComment] = useState("");

  const handleCloseCancelModal = () => setOpenCancelModal(false);

  const handleOpenCancelModal = () => {
    setOpenCancelModal(true)
  };

  const handleComment = (event) => {
    setComment(event.target.value);
  };

  const handleCancel = () => {
    const cancel = async () => {
      const observations = comment === "" ? "Cancelado por el usuario" : comment;
      const cancelResponse = await axios.put(`${environment.apiUrl}/appointments/${appointmentData.id}/canceled?observations=${observations}`);
      if (cancelResponse.status === 200) {
        toast.success("Cita cancelada exitosamente")
        onReturn();
      } else {
        toast.error(cancelResponse.data.detail)
      }
    }
    cancel();
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
              bgcolor: getColorByState(appointmentData.appointmentStatus),
              color: "white",
              textAlign: "center",
              width: "100px",
              fontFamily: "Roboto",
              padding: "10px",
              marginLeft: "10px"
            }}
          >
            <Typography variant="body2">
              {appointmentStatusLabels[appointmentData.appointmentStatus]}
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
      <Box>
        {
          (() => {
            switch (appointmentData.appointmentStatus) {
              case "pending":
                return (
                  <div sx={{ padding: "10px" }}>
                    <Button sx={{
                      bgcolor: "#E00C0C",
                      color: "white",
                      textAlign: "center",
                      marginTop: "40px"
                    }} onClick={handleOpenCancelModal}>
                      Cancelar
                    </Button>
                  </div>
                );
              default:
                return <div></div>;
            }
          })()
        }
      </Box>
      {openCancelModal && (
        <CancelAppointmentModal
          open={openCancelModal}
          onClose={handleCloseCancelModal}
          onCancel={handleCancel}
          comment={comment}
          handleComment={handleComment}
        />
      )}
      <ToastContainer />
    </>
  );
};
