import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  useMediaQuery,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HomeIcon from "@mui/icons-material/Home";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 320;

export const CustomDrawer = (props) => {
  const { role, fullname, email } = props;
  const startTime = new Date(Date.now());
  startTime.setHours(9);
  const endTime = new Date(Date.now());
  endTime.setHours(18);
  const [status, setStatus] = useState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const cerrarSesion = () => {
    localStorage.removeItem("session");
    navigate("/");
  };

  const onClickDrawerOption = (route) => {
    navigate(`/${route}`);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    Date.now() >= startTime && Date.now() < endTime
      ? setStatus(true)
      : setStatus(false);
    // eslint-disable-next-line
  }, []);

  const drawerContent = (
    <>
      <DomainAddIcon
        sx={{
          fontSize: "60px",
          color: "green",
          alignSelf: "center",
          paddingY: "20px",
        }}
      />
      <Divider />
      <List>
        <ListItem>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemButton onClick={() => onClickDrawerOption("home")}>
            Inicio
          </ListItemButton>
        </ListItem>
        {role === "paciente" && (
          <>
            <ListItem>
              <ListItemIcon>
                <CalendarMonthIcon />
              </ListItemIcon>
              <ListItemButton
                onClick={() => onClickDrawerOption("set-appointment")}
              >
                Agendar Turno
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemButton
                onClick={() => onClickDrawerOption("my-appointments")}
              >
                Mis Turnos
              </ListItemButton>
            </ListItem>
          </>
        )}
        {(role === "medical_staff" || role === "doctor") && (
          <>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemButton
                onClick={() => onClickDrawerOption("appointments")}
              >
                Turnos
              </ListItemButton>
            </ListItem>
          </>
        )}
        {role === "admin" && (
          <>
            <ListItem>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemButton onClick={() => onClickDrawerOption("admin")}>
                Administración
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "70%",
        }}
      >
        <Typography sx={{ alignSelf: "center", paddingBottom: "10px" }}>
          {"El centro médico se encuentra:"}
        </Typography>
        <Box
          sx={{
            backgroundColor: status ? "#0CE07A" : "#E00C0C",
            borderRadius: "12px",
            color: "white",
            width: "fit-content",
            padding: "5px",
            alignSelf: "center",
          }}
        >
          <Typography sx={{ fontWeight: "500", fontFamily: "Roboto" }}>
            {status ? "Disponible" : "No Disponible"}
          </Typography>
        </Box>
        <Typography sx={{ alignSelf: "center", textAlign: "center" }}>
          Horario de atención
          <br /> 9:00 a 18:00
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            padding: "40px",
          }}
        >
          <PersonOutlineIcon sx={{ fontSize: "40px" }} />
          <Typography>
            {fullname}
            <br />
            {email}
          </Typography>
          <IconButton
            onClick={cerrarSesion}
            sx={{
              alignSelf: "center",
              padding: "0px",
            }}
          >
            <LogoutIcon sx={{ fontSize: "40px" }} />
          </IconButton>
        </Box>
      </Box>
    </>
  );

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#E5E4E4",
            borderRight: "none",
          },
          color: "#E5E4E4",
        }}
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={!isMobile || mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        {drawerContent}
      </Drawer>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setMobileOpen(true)}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </>
  );
};
