import json
import os
from backend.models.triage import TriageData
from backend.repositories.triage_repository import ITriageRepository
import requests


class TriageRepository(ITriageRepository):

    def doTriage(self, data: TriageData):
        response = requests.post(
            url=os.environ["ML_MODEL_URL"], data=json.dumps())

        return response.json()
