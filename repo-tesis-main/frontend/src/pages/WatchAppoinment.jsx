import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Box, IconButton, Divider, Typography } from "@mui/material";
import { Checkbox, FormControl, FormGroup, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { Stack } from '@mui/material';
import "../css/SetAppointmentButtons.css";
import axios from "axios";
import { environment } from "../utils/evironment";
import { toast } from "react-toastify";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const StatusColor = {
  resuscitation: "#E00C0C",
  emergency: "#E0560C",
  urgency: "#E0B60C",
  minorUrgency: "#115026",
  noUrgency: "#0C68E0",
};

const StatusLabels = {
  resuscitation: "Reanimación",
  emergency: "Emergencia",
  urgency: "Urgencia",
  minorUrgency: "Urgencia menor",
  noUrgency: "Sin urgencia",
};

const StatusNumbers = {
  1: "resuscitation",
  2: "emergency",
  3: "urgency",
  4: "minorUrgency",
  5: "noUrgency"
}

const TheresLessionValues = {
  0: "No Existencia",
  1: "Existencia No Grave",
  2: "Existencia Grave",
};

const GlasgowComaScaleValues = {
  1: "Alerta",
  2: "Respuesta Verbal",
  3: "Respuesta al Dolor",
  4: "Sin Respuesta",
};

export const WatchAppoinment = ({ appointmentId, fullname, time, onReturn }) => {
  const appointmentDate = dayjs(time);

  const user = {
    role: "paciente",
    fullname: "Pepe Pepito",
    email: "pepito@gmail.com",
  };

	const [affections, setAffections] = React.useState({
    fever: false,
    injury: true,
    pain: false,
  });
  const [vitalSigns, setVitalSigns] = useState({
    temperature: "",
    systolicPressure: "",
    diastolicPressure: "",
    heartRate: "",
    respirationRate: ""
  })

  const [appt, setAppt] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${environment.apiUrl}/appointments/details/${appointmentId}`
      );
      if (response !== null) {
        toast.error(response.detail);
      }
      setAppt(response.data.appointmentDetails);
      setAffections({ ...response.data.appointmentDetails.generalAffections })
      setVitalSigns({ ...response.data.appointmentDetails.vitalSigns })
    };
    fetchData()
  }, []);

  return (
    <>
      {appt && (
        <>
          <Typography
            sx={{ fontSize: "48px", lineHeight: "1", letterSpacing: "0" }}
          >
            {"Ver Turno"}
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
                  backgroundColor: "#EBEBEB",
                  '&:hover': { bgcolor: '#EBEBEB' },
                  borderRadius: "12px",
                  marginBottom: "10px",
                }}
                button
                onClick={() => { }}
              >
                <ListItemIcon
                  sx={{
                    justifyContent: "center",
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
                    }}
                  >
                    {`${fullname} | ${appointmentDate.format(
                      "DD - MM, YYYY | hh:mm a"
                    )}`}
                    <Box
                      sx={{
                        borderRadius: 1,
                        bgcolor: StatusColor[StatusNumbers[appt.triageStatus]],
                        color: "white",
                        textAlign: "center",
                        display: "inline-block",
                        width: "100px",
                      }}
                    >
                      <Typography variant="body2">
                        {StatusLabels[StatusNumbers[appt.triageStatus]]}
                      </Typography>
                    </Box>
                  </Box>
                </ListItemText>
              </ListItem>
            </List>
          </Box>

          {/* Details content */}

          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
              {/* Top left box  */}
              <Box sx={{ marginTop: '50px', backgroundColor: '#EBEBEB', width: '100%', minHeight: '200px', borderRadius: '12px' }}>
                <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', margin: '20px 0px 0px 20px' }}>
                  <Typography variant='h6' fontWeight={'bold'}>Estado del paciente:</Typography>
                  <Typography variant="h6" sx={{ whiteSpace: 'pre' }} > {GlasgowComaScaleValues[appt.patientStatus]}</Typography>
                </Stack>
                <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', margin: '20px 0px 0px 20px' }}>
                  <Typography variant='h6' fontWeight={'bold'}>Lesion:</Typography>
                  <Typography variant="h6" sx={{ whiteSpace: 'pre' }} > {TheresLessionValues[appt.theresLession]}</Typography>
                </Stack>
                <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', margin: '20px 0px 0px 20px' }}>
                  <Typography variant='h6' fontWeight={'bold'}>Registro de dolor:</Typography>
                  <FormControl sx={{ justifyContent: 'center', width: '100%' }}>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="0"
                      name="radio-buttons-group"
                      value={appt.painLevel}
                      sx={{
                        fontSize: "0.5em",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        marginBottom: '20px',
                        '& .MuiSvgIcon-root': {
                          fontSize: '2.5em',
                        }
                      }}
                    >
                      <FormControlLabel
                        value="1"
                        sx={{ display: "flex", flexDirection: "column" }}
                        control={<Radio icon={SentimentSatisfiedAltIcon} />}
                        label="1"
                      />
                      <FormControlLabel
                        value="2"
                        sx={{ display: "flex", flexDirection: "column" }}
                        control={<Radio />}
                        label="2"
                      />
                      <FormControlLabel
                        value="3"
                        sx={{ display: "flex", flexDirection: "column" }}
                        control={<Radio />}
                        label="3"
                      />
                      <FormControlLabel
                        value="4"
                        sx={{ display: "flex", flexDirection: "column" }}
                        control={<Radio />}
                        label="4"
                      />
                      <FormControlLabel
                        value="5"
                        sx={{ display: "flex", flexDirection: "column" }}
                        control={<Radio />}
                        label="5"
                      />
                      <FormControlLabel
                        value="6"
                        sx={{ display: "flex", flexDirection: "column" }}
                        control={<Radio />}
                        label="6"
                      />
                      <FormControlLabel
                        value="7"
                        sx={{ display: "flex", flexDirection: "column" }}
                        control={<Radio />}
                        label="7"
                      />
                      <FormControlLabel
                        value="8"
                        sx={{ display: "flex", flexDirection: "column" }}
                        control={<Radio />}
                        label="8"
                      />
                      <FormControlLabel
                        value="9"
                        sx={{ display: "flex", flexDirection: "column" }}
                        control={<Radio />}
                        label="9"
                      />
                      <FormControlLabel
                        value="10"
                        sx={{ display: "flex", flexDirection: "column" }}
                        control={
                          <Radio icon={SentimentVeryDissatisfiedIcon} />
                        }
                        label="10"
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>
              </Box>
              {/* Bottom left box */}
              <Box sx={{ marginTop: '20px', backgroundColor: '#EBEBEB', minHeight: '300px', borderRadius: '12px' }}>
                <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', margin: '20px 0px 0px 20px' }}>
                  <Typography variant='h6' fontWeight={'bold'}>Diagnostico:</Typography>
                  <Typography variant="h6" sx={{ whiteSpace: 'pre' }} > {appt.diagnostic}</Typography>
                </Stack>
                <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', margin: '20px 0px 0px 20px' }}>
                  <Typography variant='h6' fontWeight={'bold'}>Medicamento:</Typography>
                  <Typography variant="h6" sx={{ whiteSpace: 'pre' }} > {appt.prescription}</Typography>
                </Stack>
                <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', margin: '20px 0px 0px 20px' }}>
                  <Typography variant='h6' fontWeight={'bold'}>Indicaciones:</Typography>
                  <Typography variant="h6" sx={{ whiteSpace: 'pre' }} > {appt.indications}</Typography>
                </Stack>
              </Box>
            </Box>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Top right box  */}
              <Box sx={{ marginTop: '10px', backgroundColor: '#EBEBEB', minHeight: '200px', borderRadius: '12px' }}>
                <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', margin: '20px 0px 0px 20px' }}>
                  <Typography variant='h6' fontWeight={'bold'}>Afeccionees generales:</Typography>
                  <FormControl component="fieldset" variant="standard">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={affections.fever}
                            name="fever"
                          />
                        }
                        label="Temperatura alta"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={affections.injury}
                            name="injury"
                          />
                        }
                        label="Lesión o herida"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={affections.pain}
                            name="pain"
                          />
                        }
                        label="Dolor o malestar general"
                      />
                    </FormGroup>
                  </FormControl>
                </Stack>
              </Box>
              {/* Bottom right box */}
              <Box sx={{ marginTop: '20px', backgroundColor: '#EBEBEB', minHeight: '200px', borderRadius: '12px' }}>
                <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', margin: '20px 0px 0px 20px' }}>
                  <Typography variant='h6' fontWeight={'bold'}>Temperatura Corporal (C):</Typography>
                  <Typography variant="h6" sx={{ whiteSpace: 'pre' }} > {vitalSigns.temperature}</Typography>
                </Stack>
                <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', margin: '20px 0px 0px 20px' }}>
                  <Typography variant='h6' fontWeight={'bold'}>Presion arterial Sistolica (mmHg):</Typography>
                  <Typography variant="h6" sx={{ whiteSpace: 'pre' }} > {vitalSigns.systolicPressure}</Typography>
                </Stack>
                <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', margin: '20px 0px 0px 20px' }}>
                  <Typography variant='h6' fontWeight={'bold'}>Presion arterial Diastolica (mmHg):</Typography>
                  <Typography variant="h6" sx={{ whiteSpace: 'pre' }} > {vitalSigns.diastolicPressure}</Typography>
                </Stack>
                <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', margin: '20px 0px 0px 20px' }}>
                  <Typography variant='h6' fontWeight={'bold'}>Frecencia cardiaca (bpm):</Typography>
                  <Typography variant="h6" sx={{ whiteSpace: 'pre' }} > {vitalSigns.heartRate}</Typography>
                </Stack>
                <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', margin: '20px 0px 0px 20px' }}>
                  <Typography variant='h6' fontWeight={'bold'}>Frecencia respiratoria (rpm):</Typography>
                  <Typography variant="h6" sx={{ whiteSpace: 'pre' }} > {vitalSigns.respirationRate}</Typography>
                </Stack>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};
