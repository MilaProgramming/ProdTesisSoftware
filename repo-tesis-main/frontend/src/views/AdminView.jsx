import { Box, Typography } from "@mui/material"


export const AdminView = () => {
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
    </Box>
  )
}
