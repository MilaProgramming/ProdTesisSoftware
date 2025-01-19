import os
from abc import ABC, abstractclassmethod
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models.appointment import Appointment, AppointmentDetails, AppointmentTime


class IAppointmentRepository(ABC):
    def __init__(self):
        engine = create_engine(os.environ['DB_CONNECTION_STRING'])
        Session = sessionmaker(bind=engine)
        self.session = Session()

    @abstractclassmethod
    def getAll(self, username: str):
        raise NotImplementedError

    @abstractclassmethod
    def create(self, appointment: Appointment, username: str):
        raise NotImplementedError

    @abstractclassmethod
    def getAppointmentDetails(self, appointmentId: str):
        raise NotImplementedError

    @abstractclassmethod
    def changeAppointmentStatus(self, appointmentId: str, appointmentStatus: str):
        raise NotImplementedError

    @abstractclassmethod
    def updateAppointmentDetails(self, appointmentDetails: AppointmentDetails):
        raise NotImplementedError

    @abstractclassmethod
    def getDrAppointments(self, doctorId: int):
        raise NotImplementedError

    @abstractclassmethod
    def getById(self, appointmentId: int):
        raise NotImplementedError

    @abstractclassmethod
    def updateAppointment(self, appointmentTime: AppointmentTime):
        raise NotImplementedError
