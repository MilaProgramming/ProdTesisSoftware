import { Box, Checkbox, FormControlLabel, Slider, Typography } from "@mui/material";
import React from "react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

export const Affections = ({ options, onCheckboxChange, onSliderChange }) => {
  const labels = [
    { label: 'Dolor de cabeza', state: "headache", min: 1, max: 5, labels: ["Muy Leve", "Leve", "Moderado", "Intenso", " Muy Intenso"] },
    { label: 'Alza Térmica', state: "temperature", min: 1, max: 2, labels: ["Baja", "Alta"] },
    { label: 'Malestar estomacal', state: "stomachache", min: 1, max: 2, labels: ["Cólico Intermitente", "Cólico Continuo"] },
    { label: 'Dolor Abdominal', state: "disconfort", min: 1, max: 2, labels: ["No Tiene", "Tiene"] },
    { label: 'Ardor de garganta', state: "burningThroat", min: 1, max: 2, labels: ["No Tiene", "Tiene"] },
    { label: 'Presencia de herida', state: "theresWound" }
  ]

  return (
    <>
      <Typography sx={{ alignSelf: "center", fontSize: "20px" }}>{"Recuerde que al marcar una casilla especificas que padeces del síntoma seleccionado"}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: "center" }}>
        <Box key={"affections-1"} sx={{ display: 'flex', gap: 2, flexDirection: "column" }}>
          {labels.slice(0, 3).map((label, index) => (
            <>
              <FormControlLabel
                key={`checkbox-${index}`}
                control={
                  <Checkbox
                    checked={options[label.state].checked} // Accede al estado del checkbox
                    onChange={() => onCheckboxChange(label.state)} // Envía la acción para actualizar el checkbox
                  />
                }
                label={label.label}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: "x-large"
                  }
                }}
              />
              {label.state === "headache" &&
                <Box key={`slider-${index}`} sx={{ display: options[label.state].checked ? 'block' : 'none' }}>
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
                    <SentimentSatisfiedAltIcon />
                    <Slider
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => label.labels[value - 1]} // Cambia el formato del valor del slider
                      value={options[label.state].value} // Accede al valor del slider
                      onChange={(event, newValue) => onSliderChange(label.state, newValue)} // Envía la acción para actualizar el slider
                      min={label.min}
                      max={label.max}
                    />
                    <SentimentVeryDissatisfiedIcon />
                  </Box>
                </Box>

              }
            </>
          ))}
        </Box>
        <Box key={"affections-2"} sx={{ display: 'flex', gap: 2, flexDirection: "column" }}>
          {labels.slice(3).map((label, index) => (
            <>
              <FormControlLabel
                key={`checkbox-${index + 3}`}
                control={
                  <Checkbox
                    checked={options[label.state].checked}
                    onChange={() => onCheckboxChange(label.state)}
                  />
                }
                label={label.label}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: "x-large"
                  }
                }}
              />
              {label.state === "theresWound" &&
                <Box key={`slider-${index + 3}`} sx={{ display: options[label.state].checked ? 'block' : 'none' }}>
                  <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <FormControlLabel
                      key={"theresWound"}
                      control={
                        <Checkbox
                          checked={options[label.state].value}
                          onChange={(event, newValue) => onSliderChange(label.state, newValue)}
                        />
                      }
                      label={"La herida sigue sangrando"}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: "medium"
                        }
                      }}
                    />
                  </Box>
                </Box>
              }
            </>
          ))}
        </Box>
      </Box>
    </>
  );
}
