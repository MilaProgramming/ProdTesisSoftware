from abc import ABC, abstractclassmethod
from backend.models.triage import TriageData

class ITriageRepository(ABC):
    @abstractclassmethod
    def doTriage(self, data: TriageData):
        raise NotImplementedError
