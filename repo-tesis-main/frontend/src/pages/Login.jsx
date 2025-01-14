import React, { useContext, useEffect, useState } from "react";
import { Button, TextField, Grid, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SessionContext from "../context/SessionContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { environment } from "../utils/evironment";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(SessionContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${environment.apiUrl}/login`, {
        username,
        password,
      });
      if (response.data.status === 200 && response.data.user !== "") {
        try {
          const user = response.data.user;
          setUser(user);
        } catch (error) {
          console.error(error);
        }
        navigate("/home");
      } else {
        toast.error("Contraseña incorrecta");
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (localStorage.getItem("session")) {
      navigate("/home");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <img
        src="https://srvcas.espe.edu.ec/authenticationendpoint/images/espe2.jpg"
        alt="ESPE"
        style={{ width: "65%" }}
      />

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          width: "35%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginX: "15px",
          justifyContent: "center",
        }}
      >
        <img
          src="https://srvcas.espe.edu.ec/authenticationendpoint/images/Espe-Angular-Logo.png"
          alt="ESPE"
          style={{ width: "60%" }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Usuario"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: "green",
            color: "white",
            width: "250px",
          }}
        >
          Iniciar Sesión
        </Button>
        <Grid container>
          <Grid item xs>
            <RouterLink to="/forgot-password" variant="body2">
              ¿Olvidaste tu contraseña?
            </RouterLink>
          </Grid>
          <Grid item>
            <RouterLink to="/register" variant="body2">
              {"¿No tienes una cuenta? Regístrate"}
            </RouterLink>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default LoginPage;
