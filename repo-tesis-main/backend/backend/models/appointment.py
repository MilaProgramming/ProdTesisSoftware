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
    appointmentDate: datetime
    userId: Optional[int] = None
    affections: Affections = None
    observations: str = None
    painLevel: int = None

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
    observations: Optional[str] = None
    diagnostic: Optional[str] = None
    prescription: Optional[str] = None
    indications: Optional[str] = None
    appointmentId: Optional[int] = None
    generalAffections: Optional[dict] = None
    painLevel: Optional[int] = None
    vitalSigns: Optional[dict] = None
    triageStatus: Optional[str] = None
    patientStatus: Optional[int] = None
    theresLession: Optional[int] = None

    def to_dict(self):
        return {
            "observations": self.observations,
            "diagnostic": self.diagnostic,
            "prescription": self.prescription,
            "indications": self.indications,
            "appointmentId": self.appointmentId,
            "generalAffections": self.generalAffections,
            "painLevel": self.painLevel,
            "vitalSigns": self.vitalSigns,
            "triageStatus": self.triageStatus,
            "patientStatus": self.patientStatus,
            "theresLession": self.theresLession,
        }
