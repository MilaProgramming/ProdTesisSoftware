from backend.models.user import User
from fastapi import APIRouter, status, HTTPException
from backend.controllers import login_controller

router = APIRouter(
    tags=["login"],
    responses={status.HTTP_404_NOT_FOUND: {"description": "Not found"}},
)


@router.get("/health_check", status_code=200)
async def health_check() -> dict:
    return {"msg": "Login route is working propperly"}


@router.post("/")
async def login(user: User):
    try:
        return login_controller.login(user)
    except HTTPException as ex:
        raise ex
