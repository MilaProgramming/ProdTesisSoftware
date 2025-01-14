import React, { useContext, useEffect } from "react";
import { Box } from "@mui/material";
import SessionContext from "../context/SessionContext";
import { useNavigate } from "react-router-dom";
import { PatientView } from "../views/PatientView";
import { AdminView } from "../views/AdminView";
import { CustomDrawer } from "../components/Drawer/CustomDrawer";

export const HomePage = () => {
  const { user } = useContext(SessionContext);
  // const user = {
  //   role: "paciente",
  //   fullname: "Pepe Pepito",
  //   email: "pepito@gmail.com"
  // };
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#E5E4E4",
      }}
    >
      {user && (
        <>
          <CustomDrawer
            role={user.role}
            fullname={`${user.name} ${user.lastname}`}
            email={user.email}
          />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {user.role === "paciente" && <PatientView />}
            {user.role === "admin" && <AdminView />}
          </Box>
        </>
      )}
    </Box>
  );
};
