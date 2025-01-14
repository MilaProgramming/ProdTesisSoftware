from backend.models.user import NewUser
from .base_use_case import BaseUseCase
from backend.repositories.register_repository import IRegisterRepository
from fastapi import HTTPException


class RegisterUseCase(BaseUseCase):
    """Represents the use case to tag the image"""

    def __init__(self, repository: IRegisterRepository):
        super().__init__(repository)

    def execute(self, user: NewUser):
        try:
            return self.repository.register(user)
        except HTTPException as ex:
            raise ex

    def getAllUsers(self):
        try:
            response = self.repository.getAllUsers()
            users = [NewUser(
                id=user.id,
                username=user.username,
                password=user.password,
                role=user.role,
                name=user.name,
                lastname=user.lastname,
                email=user.email)
                for user in response]
            for user in users:
                del user.password
            return users
        except HTTPException as ex:
            raise ex

    def changeUserRole(self, userId: str, userRole: str):
        try:
            print(userId)
            response = self.repository.changeUserRole(
                userId, userRole)
            return response
        except HTTPException as ex:
            raise ex
