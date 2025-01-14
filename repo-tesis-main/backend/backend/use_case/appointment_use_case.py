from backend.models.appointment import Appointment, AppointmentDetails, AppointmentTime
from .base_use_case import BaseUseCase
from backend.repositories.appointment_repository import IAppointmentRepository
from fastapi import HTTPException


class AppointmentUseCase(BaseUseCase):
    """Represents the use case to tag the image"""

    def __init__(self, repository: IAppointmentRepository):
        super().__init__(repository)

    def getAll(self, username: str):
        try:
            response = self.repository.getAll(username)
            appointments = [Appointment(id=appointment.id, appointmentStatus=appointment.appointmentStatus,
                                        appointmentDate=appointment.appointmentDate, userId=appointment.userId)for appointment in response]
            return appointments
        except HTTPException as ex:
            raise ex

    def create(self, appointment: Appointment, username: str):
        try:
            response = self.repository.create(appointment, username)
            return response
        except HTTPException as ex:
            raise ex

    def getAppointmentDetails(self, appointmentId: str):
        try:
            response = self.repository.getAppointmentDetails(appointmentId)
            return response
        except HTTPException as ex:
            raise ex

    def changeAppointmentStatus(self, appointmentId: str, appointmentStatus: str):
        try:
            response = self.repository.changeAppointmentStatus(
                appointmentId, appointmentStatus)
            return response
        except HTTPException as ex:
            raise ex

    def updateAppointmentDetails(self, appointmentDetails: AppointmentDetails):
        try:
            response = self.repository.updateAppointmentDetails(
                appointmentDetails
            )
            return response
        except HTTPException as ex:
            raise ex

    def getDrAppointments(self, doctorId: int):
        try:
            response = self.repository.getDrAppointments(
                doctorId
            )
            formattedResponse = []
            for appointment, user in response:
                formattedResponse.append(
                    # {"appointment": appointment, "user": user}
                    {
                        "id": appointment.id,
                        "userId": appointment.userId,
                        "appointmentStatus": appointment.appointmentStatus,
                        "appointmentDate": appointment.appointmentDate,
                        "userFullname": f"{user.name} {user.lastname}"
                    }
                )
            return formattedResponse
        except HTTPException as ex:
            raise ex

    def getById(self, appointmentId: int):
        try:
            response = self.repository.getById(appointmentId)
            return response
        except HTTPException as ex:
            raise ex

    def updateAppointment(self, appointmentTime: AppointmentTime):
        try:
            response = self.repository.updateAppointment(appointmentTime)
            return response
        except HTTPException as ex:
            raise ex
