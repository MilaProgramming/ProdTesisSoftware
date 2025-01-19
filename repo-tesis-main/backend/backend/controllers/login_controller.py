import logging
from backend.models.user import User
from fastapi import HTTPException, UploadFile
from http import HTTPStatus
from backend.implementation.login_repository_implementation import (
    LoginRepository
)
from backend.use_case.login_use_case import LoginUseCase


def login(user: User):
    try:
        login_repository = LoginRepository()
        login_use_case = LoginUseCase(
            login_repository
        )
        data = login_use_case.execute(user=user)
        return {
            "status": HTTPStatus.OK,
            "message": "Login succesfully",
            "user": data,
        }
    except HTTPException as ex:
        logging.error(msg={"error": ex.detail})
        raise ex
