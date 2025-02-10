from datetime import datetime, timedelta
import random
import os
from backend.models.appointment import Appointment, AppointmentDetails, AppointmentTime
from backend.orm.models.user import AppointmentDto, UserDto, AppointmentDetailsDto
from backend.repositories.appointment_repository import IAppointmentRepository
from http import HTTPStatus
from fastapi import HTTPException
from sqlalchemy import insert
from backend.utils.utils import assign_appointment_time
import requests


class AppointmentsRepository(IAppointmentRepository):

    def getAll(self, username: str) -> tuple:
        try:
            user = self.session.query(UserDto).filter(
                UserDto.username == username).first()
            response = self.session.query(AppointmentDto, AppointmentDetailsDto).join(AppointmentDetailsDto).filter(
                AppointmentDto.userId == user.id).all()
            return response
        except Exception as ex:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )

    def create(self, appointment: Appointment, username: str, newUserFromAppointment: bool):
        try:
            userRole = "medical_staff" if appointment.appointmentType in [
                "injection", "vitalSignes", "desinfection"] else "doctor"
            user = self.session.query(UserDto).filter(
                UserDto.username == username).first() if not newUserFromAppointment else self.session.query(UserDto).filter(
                UserDto.DNI == username).first()
            appointment.userId = user.id
            staff = self.session.query(UserDto).filter(
                UserDto.role == userRole
            ).all()
            if len(staff) == 0:
                randomNurse = None
            else:
                randomNurse = random.randint(0, len(staff)-1)
            payload = {
                "dolor_cabeza": appointment.headache,
                "temperatura": appointment.temperature,
                "dolor_estómago": appointment.stomachache,
                "malestar_general": appointment.generalMalaise,
                "dolor_garganta": appointment.burningThroat,
                "herida": appointment.theresWound
            }

            newPayload = payload.copy()

            for key, value in payload.items():
                if value == -1:
                    del newPayload[key]

            urgencyLevel = requests.post(os.environ['MODEL_URL'], json={
                "dolor_cabeza": appointment.headache,
                "temperatura": appointment.temperature,
                "dolor_estómago": appointment.stomachache,
                "malestar_general": appointment.generalMalaise,
                "dolor_garganta": appointment.burningThroat,
                "herida": appointment.theresWound
            }).json()["nivel_urgencia"]

            asignedDate = ""

            if datetime.now().strftime("%Y-%m-%d") in appointment.appointmentDate.strftime("%Y-%m-%d") and "18:01" in appointment.appointmentDate.strftime("%H:%M"):
                asignedDate = assign_appointment_time(
                    urgency_level=urgencyLevel, available_hours=self.getAppointmentTimes(appointmentType=appointment.appointmentType, date=appointment.appointmentDate.strftime("%Y-%m-%d")))
            else:
                asignedDate = appointment.appointmentDate

            query = insert(AppointmentDto).values(
                appointmentStatus=appointment.appointmentStatus,
                appointmentType=appointment.appointmentType,
                appointmentDate=asignedDate,
                userId=user.id,
                nurseId=staff[randomNurse].id if len(staff) > 0 else None
            )
            result = self.session.execute(query)
            self.session.execute(
                insert(AppointmentDetailsDto), [
                    {
                        "appointmentId": result.inserted_primary_key[0],
                        "observations": appointment.observations,
                        "headache": appointment.headache,
                        "temperature": appointment.temperature,
                        "stomachache": appointment.stomachache,
                        "generalMalaise": appointment.generalMalaise,
                        "burningThroat": appointment.burningThroat,
                        "theresWound": appointment.theresWound,
                        "triageStatus": urgencyLevel
                    }
                ]
            )
            self.session.commit()
            return asignedDate
        except Exception as ex:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )

    def getAppointmentDetails(self, appointmentId: str):
        try:
            return self.session.query(AppointmentDetailsDto).filter(
                AppointmentDetailsDto.appointmentId == appointmentId).first()
        except Exception as ex:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )

    def changeAppointmentStatus(self, appointmentId: str, newStatus: str, observations: str):
        try:
            self.session.query(AppointmentDto).filter(
                AppointmentDto.id == appointmentId).update({"appointmentStatus": newStatus})
            self.session.query(AppointmentDetailsDto).filter(
                AppointmentDetailsDto.appointmentId == appointmentId
            ).update({"observations": observations})
            response = self.session.commit()
            return response
        except Exception as ex:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )

    def updateAppointmentDetails(self, appointmentDetails: AppointmentDetails):
        try:
            self.session.query(AppointmentDetailsDto).filter(
                AppointmentDetailsDto.appointmentId == appointmentDetails.appointmentId
            ).update(appointmentDetails.to_dict())
            response = self.session.commit()
            return response
        except Exception as ex:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )

    def getDrAppointments(self, doctorId: int):
        try:
            response = self.session.query(
                AppointmentDto, UserDto).join(UserDto).all()
            return response
        except Exception as ex:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )

    def getById(self, appointmentId: int):
        try:
            response = self.session.query(AppointmentDto).filter(
                AppointmentDto.id == appointmentId
            ).first()
            return response
        except Exception as ex:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )

    def updateAppointment(self, appointmentTime: AppointmentTime):
        try:
            self.session.query(AppointmentDto).filter(
                AppointmentDto.id == appointmentTime.id
            ).update(appointmentTime.to_dict())
            response = self.session.commit()
            return response
        except Exception as ex:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )

    def getAppointmentTimes(self, appointmentType: str, date: str):
        try:
            now = datetime.now()
            if date in now.strftime("%Y-%m-%d") and now.strftime("%H:%M") > "18:00":
                date = (now + timedelta(days=1)).strftime("%Y-%m-%d")
            existing_appointments = self.session.query(AppointmentDto).filter(
                AppointmentDto.appointmentDate.contains(date)
            ).all()
            all_time_slots = [
                appointment.appointmentDate for appointment in existing_appointments]
            time_interval = 20 if appointmentType == "appointment" else 10
            for hour in range(9, 18):  # Rango de horas de atención (9 AM - 6 PM)
                # Intervalos de 20 o 10 minutos
                for minute in range(0, 60, time_interval):
                    time_slot = datetime.strptime(
                        f"{date} {hour}:{minute}", "%Y-%m-%d %H:%M")
                    if time_slot > now and time_slot not in all_time_slots:
                        all_time_slots.append(time_slot)

            existing_times = [
                appointment.appointmentDate for appointment in existing_appointments
            ]
            available_times = [
                time_slot.strftime("%H:%M")
                for time_slot in all_time_slots
                if time_slot not in existing_times
            ]
            return available_times
        except Exception as ex:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )
