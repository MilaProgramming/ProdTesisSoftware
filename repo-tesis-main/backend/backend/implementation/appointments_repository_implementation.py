from datetime import datetime
import random
from backend.models.appointment import Appointment, AppointmentDetails, AppointmentTime
from backend.orm.models.user import AppointmentDto, UserDto, AppointmentDetailsDto
from backend.repositories.appointment_repository import IAppointmentRepository
from http import HTTPStatus
from fastapi import HTTPException
from sqlalchemy import insert


class AppointmentsRepository(IAppointmentRepository):

    def getAll(self, username: str) -> tuple:
        try:
            user = self.session.query(UserDto).filter(
                UserDto.username == username).first()
            response = self.session.query(AppointmentDto).filter(
                AppointmentDto.userId == user.id).filter(AppointmentDto.appointmentDate > datetime.now()).all()
            return response
        except Exception as ex:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )

    def create(self, appointment: Appointment, username: str):
        try:
            user = self.session.query(UserDto).filter(
                UserDto.username == username).first()
            appointment.userId = user.id
            doctors = self.session.query(UserDto).filter(
                UserDto.role == "admin"
            ).all()
            randomDr = random.randint(0, len(doctors))
            query = insert(AppointmentDto).values(
                appointmentStatus=appointment.appointmentStatus, appointmentDate=appointment.appointmentDate, userId=user.id, doctorId=doctors[randomDr].id)
            result = self.session.execute(query)
            self.session.execute(
                insert(AppointmentDetailsDto), [
                    {
                        "appointmentId": result.inserted_primary_key[0],
                        "observations": appointment.observations
                    } if appointment.appointmentDate > datetime.now() else {
                        "appointmentId": result.inserted_primary_key[0],
                        "generalAffections": appointment.affections.affections_dict(),
                        "observations": appointment.observations,
                        "painLevel": appointment.painLevel
                    }
                ]
            )
            response = self.session.commit()
            return response
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

    def changeAppointmentStatus(self, appointmentId: str, newStatus: str):
        try:
            self.session.query(AppointmentDto).filter(
                AppointmentDto.id == appointmentId).update({"appointmentStatus": newStatus})
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
            response = self.session.query(AppointmentDto, UserDto).join(UserDto).filter(
                AppointmentDto.doctorId == doctorId
            ).all()
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
