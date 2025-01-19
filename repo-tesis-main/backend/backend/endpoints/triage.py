from backend.models.triage import TriageData
from fastapi import APIRouter, status, HTTPException
from typing import Dict
from backend.controllers import triage_controller

router = APIRouter(
    tags=["triage"],
    responses={status.HTTP_404_NOT_FOUND: {"description": "Not found"}},
)


@router.get("/health_check", status_code=200)
async def health_check() -> dict:
    return {"msg": "Triage route is working propperly"}


@router.post("/")
async def do_triage(data: TriageData):
    try:
        return triage_controller.doTriage(data)
    except HTTPException as ex:
        raise ex
