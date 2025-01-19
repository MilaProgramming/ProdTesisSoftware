import React, { useState } from "react";
import ReactCalendar from "react-calendar";
import "./CustomCalendar.css";

export const CustomCalendar = ({ appointmentDates }) => {
  const [dates] = useState(appointmentDates);
  const [selectedDate] = useState(new Date());

  const dateAlreadyClicked = (dates, date) =>
    dates.some((d) => new Date(d).getTime() === new Date(date).getTime());

  const tileClassName = ({ date }) => {
    if (dateAlreadyClicked(dates, date)) {
      return "react-calendar__tile--active";
    }
  };

  return <ReactCalendar value={selectedDate} tileClassName={tileClassName} />;
};
