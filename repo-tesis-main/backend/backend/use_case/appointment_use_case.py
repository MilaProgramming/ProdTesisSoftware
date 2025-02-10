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
            formattedResponse = []
            for appointment, detail in response:
                formattedResponse.append(
                    {
                        "id": appointment.id,
                        "userId": appointment.userId,
                        "appointmentStatus": appointment.appointmentStatus,
                        "appointmentDate": appointment.appointmentDate,
                        "appointmentType": appointment.appointmentType,
                        "observations": detail.observations
                    }
                )
            return formattedResponse
        except HTTPException as ex:
            raise ex

    def create(self, appointment: Appointment, username: str, newUserFromAppointment: bool):
        try:
            response = self.repository.create(
                appointment, username, newUserFromAppointment)
            return response
        except HTTPException as ex:
            raise ex

    def getAppointmentDetails(self, appointmentId: str):
        try:
            response = self.repository.getAppointmentDetails(appointmentId)
            return response
        except HTTPException as ex:
            raise ex

    def changeAppointmentStatus(self, appointmentId: str, appointmentStatus: str, observations: str):
        try:
            response = self.repository.changeAppointmentStatus(
                appointmentId, appointmentStatus, observations)
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
                        "appointmentType": appointment.appointmentType,
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

    def getAppointmentTimes(self, appointmentType: str, date: str):
        try:
            response = self.repository.getAppointmentTimes(
                appointmentType, date)
            return response
        except HTTPException as ex:
            raise ex
