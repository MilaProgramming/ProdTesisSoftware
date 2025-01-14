import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPassword";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { SetAppointment } from "./pages/SetAppointment";
import { MyAppointments } from "./pages/MyAppointments";
import { SessionProvider } from "./context/SessionContext";
import { AppointmentsQueue } from "./pages/AppointmentsQueue";
import { UpdateAppointment } from "./pages/UpdateAppointment";
import { WatchAppoinment } from "./pages/WatchAppoinment";
import { Appointments } from "./pages/Appointments";
import { AppointmentDetails } from "./pages/AppointmentDetails";
import { RoleManagement } from "./pages/RoleManagement";

function App() {
  return (
    <div>
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/set-appointment" element={<SetAppointment />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/appointments-queue" element={<AppointmentsQueue />} />
            <Route path="/update-appointment" element={<UpdateAppointment />} />
            <Route path="/appoinment" element={<WatchAppoinment />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointment-details" element={<AppointmentDetails />} />
            <Route path="/admin" element={<RoleManagement />} />
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </div>
  );
}

export default App;
