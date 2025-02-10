from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship, DeclarativeBase


class Base(DeclarativeBase):
    pass


class UserDto(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String)
    password = Column(String)
    role = Column(String)
    name = Column(String)
    lastname = Column(String)
    email = Column(String)
    DNI = Column(String)
    DNIType = Column(String)
    appointments = relationship('AppointmentDto', back_populates='user')

    def user_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'name': self.name,
            'lastname': self.lastname,
            'email': self.lastname,
            'DNI': self.DNI,
            'DNIType': self.DNIType
        }


class AppointmentDto(Base):
    __tablename__ = 'appointments'

    id = Column(Integer, primary_key=True)
    appointmentStatus = Column(String)
    appointmentDate = Column(DateTime)
    appointmentType = Column(String)
    userId = Column(ForeignKey('users.id'))
    nurseId = Column(ForeignKey('user.id'))
    user = relationship('UserDto', back_populates='appointments')
    appointmentDetails = relationship(
        'AppointmentDetailsDto', back_populates='appointment')

    def appointment_to_dict(self):
        """Convierte un objeto AppointmentDto a un diccionario."""
        data = {}
        data['id'] = self.id
        data['appointmentStatus'] = self.appointmentStatus
        data['appointmentDate'] = self.appointmentDate
        data['appointmentType'] = self.appointmentType
        data['userId'] = self.userId
        data['nurseId'] = self.nurseId
        return data


class AppointmentDetailsDto(Base):
    __tablename__ = 'appointment_details'

    id = Column(Integer, primary_key=True)
    observations = Column(String)
    triageStatus = Column(Integer)
    headache = Column(Integer)
    temperature = Column(Integer)
    stomachache = Column(Integer)
    generalMalaise = Column(Integer)
    burningThroat = Column(Integer)
    theresWound = Column(Integer)
    appointmentId = Column(ForeignKey('appointments.id'))
    appointment = relationship(
        'AppointmentDto', back_populates='appointmentDetails')

    def dict(self):
        return {
            "observations": self.observations
        }
