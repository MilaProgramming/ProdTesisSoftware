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
    appointments = relationship('AppointmentDto', back_populates='user')

    def user_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'name': self.name,
            'lastname': self.lastname,
            'email': self.lastname
        }


class AppointmentDto(Base):
    __tablename__ = 'appointments'

    id = Column(Integer, primary_key=True)
    appointmentStatus = Column(String)
    appointmentDate = Column(DateTime)
    userId = Column(ForeignKey('users.id'))
    doctorId = Column(ForeignKey('user.id'))
    user = relationship('UserDto', back_populates='appointments')
    appointmentDetails = relationship(
        'AppointmentDetailsDto', back_populates='appointment')


class AppointmentDetailsDto(Base):
    __tablename__ = 'appointment_details'

    id = Column(Integer, primary_key=True)
    observations = Column(String)
    diagnostic = Column(String)
    prescription = Column(String)
    indications = Column(String)
    vitalSigns = Column(JSON)
    generalAffections = Column(JSON)
    triageStatus = Column(Integer)
    patientStatus = Column(Integer)
    theresLession = Column(Integer)
    painLevel = Column(Integer)
    appointmentId = Column(ForeignKey('appointments.id'))
    appointment = relationship(
        'AppointmentDto', back_populates='appointmentDetails')
