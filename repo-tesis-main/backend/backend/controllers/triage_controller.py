import logging
from backend.implementation.triage_repository_implementation import TriageRepository
from backend.models.triage import TriageData
from backend.use_case.triage_use_case import TriageUseCase
from fastapi import HTTPException
from http import HTTPStatus


def doTriage(data: TriageData):
    try:
        triage_repository = TriageRepository()
        triage_use_case = TriageUseCase(
            triage_repository
        )
        data = triage_use_case.execute(data)
        return {
            "status": HTTPStatus.OK,
            "message": "Triage succesfully",
            "level": data
        }
    except HTTPException as ex:
        logging.error(msg={"error": ex.detail})
        raise ex
