from backend.models.triage import TriageData
from .base_use_case import BaseUseCase
from backend.repositories.triage_repository import ITriageRepository
from fastapi import HTTPException


class TriageUseCase(BaseUseCase):
    """Represents the use case to tag the image"""

    def __init__(self, repository: ITriageRepository):
        super().__init__(repository)

    def execute(self, data: TriageData):
        try:
            return self.repository.doTriage(data)
        except HTTPException as ex:
            raise ex
