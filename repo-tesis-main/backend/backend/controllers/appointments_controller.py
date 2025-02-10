import logging
import json
from backend.models.appointment import Appointment, AppointmentDetails, AppointmentTime
from fastapi import HTTPException
from http import HTTPStatus
from backend.implementation.appointments_repository_implementation import (
    AppointmentsRepository
)
from backend.use_case.appointment_use_case import AppointmentUseCase


def getAll(username: str):
    try:
        appointment_repository = AppointmentsRepository()
        appointment_use_case = AppointmentUseCase(
            appointment_repository
        )
        data = appointment_use_case.getAll(username)
        return data
    except HTTPException as ex:
        logging.error(msg={"error": ex.detail})
        raise ex


def create(appointment: Appointment, username: str, newUserFromAppointment: bool):
    try:
        appointment_repository = AppointmentsRepository()
        appointment_use_case = AppointmentUseCase(
            appointment_repository
        )
        response = appointment_use_case.create(
            appointment=appointment, username=username, newUserFromAppointment=newUserFromAppointment)
        return response
    except HTTPException as ex:
        logging.error(msg={"error": ex.detail})
        raise ex


def getAppointmentDetails(appointmentId: str):
    try:
        appointment_repository = AppointmentsRepository()
        appointment_use_case = AppointmentUseCase(
            appointment_repository
        )
        response = appointment_use_case.getAppointmentDetails(
            appointmentId=appointmentId)
        return {
            "status": HTTPStatus.OK,
            "message": "Data retrieved succesfully",
            "appointmentDetails": response,
        }
    except HTTPException as ex:
        logging.error(msg={"error": ex.detail})
        raise ex


def changeAppointmentStatus(appointmentId: str, appointmentStatus: str, observations: str):
    try:
        appointment_repository = AppointmentsRepository()
        appointment_use_case = AppointmentUseCase(
            appointment_repository
        )
        appointment_use_case.changeAppointmentStatus(
            appointmentId=appointmentId, appointmentStatus=appointmentStatus, observations=observations)
        return {
            "status": HTTPStatus.OK,
            "message": "Appointment status changed succesfully"
        }
    except HTTPException as ex:
        logging.error(msg={"error": ex.detail})
        raise ex


def updateAppointmentDetails(appointmentDetails: AppointmentDetails):
    try:
        appointment_repository = AppointmentsRepository()
        appointment_use_case = AppointmentUseCase(
            appointment_repository
        )
        appointment_use_case.updateAppointmentDetails(
            appointmentDetails=appointmentDetails)
        return {
            "status": HTTPStatus.OK,
            "message": "Appointment details changed succesfully"
        }
    except HTTPException as ex:
        logging.error(msg={"error": ex.detail})
        raise ex


def getDrAppointments(doctorId: int):
    try:
        appointment_repository = AppointmentsRepository()
        appointment_use_case = AppointmentUseCase(
            appointment_repository
        )
        response = appointment_use_case.getDrAppointments(
            doctorId=doctorId)
        return {
            "status": HTTPStatus.OK,
            "message": "Appointment details changed succesfully",
            "appointments": response
        }
    except HTTPException as ex:
        logging.error(msg={"error": ex.detail})
        raise ex


def getById(appointmentId: int):
    try:
        appointment_repository = AppointmentsRepository()
        appointment_use_case = AppointmentUseCase(
            appointment_repository
        )
        response = appointment_use_case.getById(
            appointmentId=appointmentId)
        return {
            "status": HTTPStatus.OK,
            "message": "Appointment retrieved succesfully",
            "appointment": response
        }
    except HTTPException as ex:
        logging.error(msg={"error": ex.detail})
        raise ex


def updateAppointment(appointmentTime: AppointmentTime):
    try:
        appointment_repository = AppointmentsRepository()
        appointment_use_case = AppointmentUseCase(
            appointment_repository
        )
        response = appointment_use_case.updateAppointment(
            appointmentTime=appointmentTime)
        return {
            "status": HTTPStatus.OK,
            "message": "Appointment details changed succesfully",
            "appointments": response
        }
    except HTTPException as ex:
        logging.error(msg={"error": ex.detail})
        raise ex


def getAppointmentTimes(appointmentType: str, date: str):
    try:
        appointment_repository = AppointmentsRepository()
        appointment_use_case = AppointmentUseCase(
            appointment_repository
        )
        response = appointment_use_case.getAppointmentTimes(
            appointmentType, date)
        return {
            "status": HTTPStatus.OK,
            "message": "Appointment dates retrieved succesfully",
            "appointmentDates": response
        }
    except HTTPException as ex:
        logging.error(msg={"error": ex.detail})
        raise ex
