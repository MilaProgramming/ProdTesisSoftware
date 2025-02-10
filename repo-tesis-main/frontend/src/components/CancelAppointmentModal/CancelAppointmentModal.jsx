import CloseIcon from "@mui/icons-material/Close";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextareaAutosize,
  Typography,
} from "@mui/material";
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

export const CancelAppointmentModal = ({
  open,
  onClose,
  onCancel,
  onCancelInasistance,
  comment,
  handleComment,
}) => {
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    console.log(onCancelInasistance)
    if (localStorage.getItem("appointment") !== null) {
      setUserInfo(JSON.parse(localStorage.getItem("appointment")));
    } else {
      setUserInfo({ id: "" });
    }
  }, []);

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
        <Typography sx={{ fontSize: "36px" }}>
          {"Estás a punto de cancelar el turno:"}
        </Typography>
        {userInfo.id !== "" && (
          <Box
            sx={{ alignSelf: "center", display: "flex", flexDirection: "row" }}
          >
            <WatchLaterIcon sx={{ fontSize: "65px" }} />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ color: "black", fontSize: "24px" }}>
                {userInfo.time}
              </Typography>
              <Typography sx={{ color: "#938D8D", fontSize: "24px" }}>
                {userInfo.fullname}
              </Typography>
            </Box>
          </Box>
        )

        }
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            flex={1}
            value={userInfo.id || ""}
            sx={{
              backgroundColor: "#A02211",
              borderRadius: "10px",
              height: "42px",
              width: "275px",
              color: "white",
            }}
            onClick={onCancel}
          >
            Cancelar Turno
          </Button>
          {onCancelInasistance !== undefined && (
            <Button
              flex={1}
              value={userInfo.id || ""}
              sx={{
                backgroundColor: "#A02211",
                borderRadius: "10px",
                height: "42px",
                width: "275px",
                color: "white",
              }}
              onClick={onCancelInasistance}
            >
              Cancelar por Inasistencia
            </Button>
          )
          }
        </Box>
        <Box align={"center"}>
          <Typography sx={{ fontSize: "24px" }}>
            {"Agrega un comentario para el usuario (opcional):"}
          </Typography>
          <TextareaAutosize
            value={comment}
            onChange={handleComment}
            style={{
              width: "440px",
              height: "116px",
              borderRadius: "28px",
              paddingLeft: "24px",
              paddingTop: "8px"
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};
