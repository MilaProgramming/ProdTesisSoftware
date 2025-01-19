from backend.models.user import User
from .base_use_case import BaseUseCase
from backend.repositories.login_repository import ILoginRepository
from fastapi import UploadFile, HTTPException


class LoginUseCase(BaseUseCase):
    """Represents the use case to tag the image"""

    def __init__(self, repository: ILoginRepository):
        super().__init__(repository)

    def execute(self, user: User):
        try:
            return self.repository.login(user)
        except HTTPException as ex:
            raise ex
