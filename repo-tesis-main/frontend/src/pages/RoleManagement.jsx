import dayjs from "dayjs";
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
import { toast } from "react-toastify";

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
      axios.put(`${environment.apiUrl}/register/${usuarioId}/${nuevoRol}`);
    };
    const response = changeRole(usuarioId, nuevoRol); //aqui no se que ondas AJJAAJAJ 
    if (response.status === 200) {
      toast.success("Rol cambiado exitosamente!");
    } else {
      toast.error("El rol no fue modificado.");
    }
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
          }}
        >
          <Typography
            sx={{ fontSize: "48px", lineHeight: "1", letterSpacing: "0" }}
          >
            {"Administrción de Roles"}
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
                          <MenuItem value="admin">Doctor</MenuItem>
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
    </Box>
  );
};
