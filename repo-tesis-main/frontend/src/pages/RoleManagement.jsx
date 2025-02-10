import {
  Box,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { CustomDrawer } from "../components/Drawer/CustomDrawer";
import "../css/SetAppointmentButtons.css";
import SessionContext from "../context/SessionContext";
import axios from "axios";
import { environment } from "../utils/evironment";
import { toast, ToastContainer } from "react-toastify";

export const RoleManagement = () => {
  const { user } = useContext(SessionContext);

  const [usuarios, setUsuarios] = useState([]);
  const [needsToBeReloaded, setNeedsToBeReloaded] = useState(false);

  useEffect(() => {
    setNeedsToBeReloaded(false)
    const getUsers = async () => {
      try {
        const response = await axios.get(
          `${environment.apiUrl}/register`
        );
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al obtener las fechas de las citas:", error);
      } finally {
      }
    };
    getUsers();
  }, [needsToBeReloaded]);


  const handleChangeRol = (usuarioId, nuevoRol) => {
    // Actualizar el rol del usuario en el estado
    setUsuarios(usuarios.map(usuario =>
      usuario.userId === usuarioId ? { ...usuario, role: nuevoRol } : usuario
    ));

    const changeRole = async (usuarioId, nuevoRol) => {
      const response = await axios.put(`${environment.apiUrl}/register/${usuarioId}/${nuevoRol}`);
      if (response.data.status === 200) {
        toast.success("Rol cambiado exitosamente!");
      } else {
        toast.error("El rol no fue modificado.");
      }
    };
    changeRole(usuarioId, nuevoRol); //aqui no se que ondas AJJAAJAJ 

    setNeedsToBeReloaded(true)
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#E5E4E4",
        height: "100%",
        fontFamily: "Roboto",
      }}
    >
      <CustomDrawer
        role={user.role}
        fullname={`${user.name} ${user.lastname}`}
        email={user.email}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            backgroundColor: "white",
            fontFamily: "Roboto",
            paddingY: "50px",
            paddingX: "100px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            height: "100vh",
          }}
        >
          <Typography
            sx={{ fontSize: "48px", lineHeight: "1", letterSpacing: "0" }}
          >
            {"Administración de Roles"}
          </Typography>
          <Divider sx={{ borderColor: "black", paddingTop: "13px", marginBottom: "10px" }} />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Rol</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.id}</TableCell>
                    <TableCell>{usuario.name}</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <Select
                          labelId={`rol-label-${usuario.id}`}
                          value={usuario.role}
                          onChange={(e) => handleChangeRol(usuario.id, e.target.value)}
                        >
                          <MenuItem value="paciente">Paciente</MenuItem>
                          <MenuItem value="medical_staff">Personal Médico</MenuItem>
                          <MenuItem value="doctor">Doctor</MenuItem>
                          <MenuItem value="admin">Administrador</MenuItem>
                          {/* Agrega más roles según tus necesidades */}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};
