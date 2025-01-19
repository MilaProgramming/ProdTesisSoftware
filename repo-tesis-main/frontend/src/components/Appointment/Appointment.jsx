import { Box, Button, Typography } from "@mui/material";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export const Appointment = (props) => {
  const { id, time, fullname, status, onAttend, onModify, onCancel, onView } =
    props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "5px",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        {status === "pending" && <WatchLaterIcon sx={{ fontSize: "76px" }} />}
        {status === "finished" && (
          <AssignmentTurnedInIcon sx={{ fontSize: "76px" }} />
        )}
        {status === "canceled" && <CloseIcon sx={{ fontSize: "76px" }} />}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: "24px", color: "black" }}>
            {time.split("T")[1]}
          </Typography>
          <Typography sx={{ fontSize: "24px", color: "#938D8D" }}>
            {fullname}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {status === "pending" && (
          <>
            <Button
              onClick={() =>
                onAttend({ id: id, fullname: fullname, time: time })
              }
              type="button"
              sx={{
                backgroundColor: "#0CE07A",
                height: "31px",
                width: "140px",
                borderRadius: "10px",
                color: "white",
              }}
            >
              Atender
            </Button>
            <Button
              onClick={() => onModify({ id: id, fullname: fullname, time: time })}
              type="button"
              value={id}
              sx={{
                backgroundColor: "#E0B60C",
                height: "31px",
                width: "140px",
                borderRadius: "10px",
                color: "white",
              }}
            >
              Modificar
            </Button>
            <Button
              type="button"
              value={JSON.stringify({ id: id, fullname: fullname, time: time })}
              sx={{
                backgroundColor: "#E00C0C",
                height: "31px",
                width: "140px",
                borderRadius: "10px",
                color: "white",
              }}
              onClick={() =>
                onCancel({ id: id, fullname: fullname, time: time })
              }
            >
              Cancelar
            </Button>
          </>
        )}
        {status === "finished" && (
          <>
            <Button
              onClick={() => onView({ id: id, fullname: fullname, time: time })}
              type="button"
              sx={{
                backgroundColor: "#112950",
                height: "31px",
                width: "fit-content",
                borderRadius: "10px",
                color: "white",
              }}
            >
              Ver Detalle
            </Button>
          </>
        )}
        {status === "canceled" && (
          <>
            <Box
              sx={{
                backgroundColor: "#575757",
                height: "31px",
                width: "fit-content",
                borderRadius: "10px",
                color: "white",
                display: "flex",
                flexDirection: "row",
                paddingX: "10px",
                alignItems: "center",
              }}
            >
              Cancelado
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
