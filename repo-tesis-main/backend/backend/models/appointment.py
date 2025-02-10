from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Affections(BaseModel):
    fever: bool
    injury: bool
    pain: bool

    def affections_dict(self):
        return {
            "fever": self.fever,
            "injury": self.injury,
            "pain": self.pain
        }


class Appointment(BaseModel):

    id: Optional[int] = None
    appointmentStatus: str
    appointmentType: str
    appointmentDate: datetime
    userId: Optional[int] = None
    observations: str = None
    headache: Optional[int] = 0
    temperature: Optional[int] = 0
    stomachache: Optional[int] = 0
    generalMalaise: Optional[int] = 0
    burningThroat: Optional[int] = 0
    theresWound: Optional[int] = 0
    appointmentType: str

    def user_dict(self):
        return {
            "id": self.id,
            "appointmentStatus": self.appointmentStatus,
            "appointmentDate": self.appointmentDate,
            "userId": self.userId,
            "affections": self.affections,
            "observations": self.observations,
            "painLevel": self.painLevel
        }


class AppointmentTime(BaseModel):
    id: int = None
    appointmentDate: datetime

    def to_dict(self):
        return {
            "appointmentDate": self.appointmentDate
        }


class DetailedAppointment(BaseModel):

    id: Optional[int] = None
    appointmentStatus: str
    appointmentDate: datetime
    userId: Optional[int] = None
    observations: str = None
    diagnostic: str = None
    prescription: str = None
    incations: str = None

    def user_dict(self):
        return {
            "id": self.id,
            "appointmentStatus": self.appointmentStatus,
            "appointmentDate": self.appointmentDate,
            "userId": self.userId,
            "affections": self.affections,
            "observations": self.observations,
            "painLevel": self.painLevel
        }


class AppointmentDetails(BaseModel):
    observations: Optional[str]
    triageStatus: Optional[int]
    headache: Optional[int]
    temperature: Optional[int]
    stomachache: Optional[int]
    generalMalaise: Optional[int]
    burningThroat: Optional[int]
    theresWound: Optional[int]
    appointmentId: Optional[int] = None

    def to_dict(self):
        return {
            "observations": self.observations,
            "appointmentId": self.appointmentId,
            "triageStatus": self.triageStatus,
            "headache": self.headache,
            "temperature": self.temperature,
            "stomachache": self.stomachache,
            "generalMalaise": self.generalMalaise,
            "burningThroat": self.burningThroat,
            "theresWound": self.theresWound,
        }
