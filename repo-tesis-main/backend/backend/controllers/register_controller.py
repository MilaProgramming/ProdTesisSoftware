import logging
from backend.models.user import NewUser
from fastapi import HTTPException
from http import HTTPStatus
from backend.implementation.register_repository_implementation import (
    RegisterRepository
)
from backend.use_case.register_use_case import RegisterUseCase


def register(user: NewUser):
    try:
        register_repository = RegisterRepository()
        register_use_case = RegisterUseCase(
            register_repository
        )
        data = register_use_case.execute(user=user)
        return {
            "status": HTTPStatus.OK,
            "message": "Register succesfully",
        }
    except HTTPException as ex:
        logging.error(msg={"error": ex.detail})
        raise ex


def getAllUsers():
    try:
        register_repository = RegisterRepository()
        register_use_case = RegisterUseCase(
            register_repository
        )
        data = register_use_case.getAllUsers()
        serializedData = [vars(user) for user in data]
        return serializedData
    except HTTPException as ex:
        logging.error(msg={"error": ex.detail})
        raise ex


def changeUserRole(userId: str, userRole: str):
    try:
        register_repository = RegisterRepository()
        register_use_case = RegisterUseCase(
            register_repository
        )
        register_use_case.changeUserRole(
            userId=userId, userRole=userRole)
        return {
            "status": HTTPStatus.OK,
            "message": "User role changed succesfully"
        }
    except HTTPException as ex:
        logging.error(msg={"error": ex.detail})
        raise ex
