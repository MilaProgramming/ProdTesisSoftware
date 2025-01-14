import os
from backend.models.user import User
from backend.orm.models.user import UserDto
from backend.repositories.login_repository import ILoginRepository
from http import HTTPStatus
from typing import List, Dict
import hashlib
from fastapi import UploadFile, HTTPException
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from werkzeug.security import generate_password_hash, check_password_hash


class LoginRepository(ILoginRepository):
    def __init__(self):
        engine = create_engine(os.environ['DB_CONNECTION_STRING'])
        Session = sessionmaker(bind=engine)
        self.session = Session()

    def login(self, user: User) -> tuple:
        try:
            userFromDb = self.session.query(UserDto).filter_by(
                username=user.username).first()
            password_bytes = user.password.encode('utf-8')
            hashed_password = hashlib.sha256(password_bytes)
            hexa_hashed_password = hashed_password.hexdigest()
            if userFromDb and userFromDb.password == hexa_hashed_password:
                del userFromDb.password
                return userFromDb
            else:
                return ""
        except Exception as ex:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )
