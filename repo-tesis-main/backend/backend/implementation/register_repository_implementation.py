import os
from backend.models.user import NewUser
from backend.orm.models.user import UserDto
from backend.repositories.register_repository import IRegisterRepository
from http import HTTPStatus
import hashlib
from fastapi import HTTPException
from sqlalchemy import Integer, create_engine
from sqlalchemy.orm import sessionmaker


class RegisterRepository(IRegisterRepository):
    def __init__(self):
        engine = create_engine(os.environ['DB_CONNECTION_STRING'])
        Session = sessionmaker(bind=engine)
        self.session = Session()

    def register(self, user: NewUser) -> tuple:
        try:
            password_bytes = user.password.encode('utf-8')
            hashed_password = hashlib.sha256(password_bytes)
            hexa_hashed_password = hashed_password.hexdigest()
            newUser = UserDto(
                username=user.username,
                password=hexa_hashed_password,
                role=user.role, name=user.name,
                lastname=user.lastname,
                email=user.email,
                DNI=user.DNI,
                DNIType=user.DNIType
            )
            self.session.add(newUser)
            self.session.commit()

        except Exception as ex:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )

    def getAllUsers(self):
        try:
            response = self.session.query(UserDto).all()
            return response
        except Exception as ex:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )

    def changeUserRole(self, userId: str, newRole: str):
        try:
            self.session.query(UserDto).filter(
                UserDto.id == userId).update({"role": newRole})
            response = self.session.commit()
            return response
        except Exception as ex:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )
