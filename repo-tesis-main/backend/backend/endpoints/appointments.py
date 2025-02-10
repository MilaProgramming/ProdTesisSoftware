from backend.models.appointment import Appointment, AppointmentDetails, AppointmentTime
from fastapi import APIRouter, status, HTTPException
from typing import Dict
from backend.controllers import appointments_controller

router = APIRouter(
    tags=["appointments"],
    responses={status.HTTP_404_NOT_FOUND: {"description": "Not found"}},
)


@router.get("/health_check", status_code=200)
async def health_check() -> dict:
    return {"msg": "Appointments route is working propperly"}


@router.get("/{username}")
async def get_appointments(username: str):
    try:
        return appointments_controller.getAll(username)
    except HTTPException as ex:
        raise ex


@router.get("/id/{appointmentId}")
async def get_appointment_by_id(appointmentId: int):
    try:

        return appointments_controller.getById(appointmentId)
    except HTTPException as ex:
        raise ex


@router.post("/{username}")
async def create_appointment(appointment: Appointment, username: str, newUserFromAppointment: bool):
    try:
        return appointments_controller.create(appointment=appointment, username=username, newUserFromAppointment=newUserFromAppointment)
    except HTTPException as ex:
        raise ex


@router.put("/")
async def update_appointment(appointmentTime: AppointmentTime):
    try:
        return appointments_controller.updateAppointment(appointmentTime=appointmentTime)
    except HTTPException as ex:
        raise ex


@router.get("/details/{appointmentId}")
async def get_appointment_details(appointmentId: str):
    try:
        return appointments_controller.getAppointmentDetails(appointmentId=appointmentId)
    except HTTPException as ex:
        raise ex


@router.put("/{appointmentId}/{appointmentStatus}")
async def change_appointment_status(appointmentId: int, appointmentStatus: str, observations: str):
    try:
        return appointments_controller.changeAppointmentStatus(appointmentId=appointmentId, appointmentStatus=appointmentStatus, observations=observations)
    except HTTPException as ex:
        raise ex


@router.put("/details")
async def update_appointment_details(appointmentDetails: AppointmentDetails):
    try:
        return appointments_controller.updateAppointmentDetails(appointmentDetails)
    except HTTPException as ex:
        raise ex


@router.get("/doctor-appointments/{doctorId}")
async def get_dr_appointments(doctorId: int):
    try:
        return appointments_controller.getDrAppointments(doctorId)
    except HTTPException as ex:
        raise ex


@router.get("/dates/{appointmentType}/{date}")
async def get_appointment_dates(appointmentType: str, date: str):
    try:
        return appointments_controller.getAppointmentTimes(appointmentType, date)
    except HTTPException as ex:
        raise ex
