from backend.models.user import NewUser
from fastapi import APIRouter, status, HTTPException
from typing import Dict
from backend.controllers import register_controller

router = APIRouter(
    tags=["register"],
    responses={status.HTTP_404_NOT_FOUND: {"description": "Not found"}},
)


@router.get("/health_check", status_code=200)
async def health_check() -> dict:
    return {"msg": "Register route is working propperly"}


@router.post("/")
async def register(user: NewUser) -> Dict:
    try:
        return register_controller.register(user)
    except HTTPException as ex:
        raise ex


@router.get("/")
async def get_users():
    try:
        return register_controller.getAllUsers()
    except HTTPException as ex:
        raise ex


@router.put("/{userId}/{userRole}")
async def change_user_role(userId, userRole: str):
    try:
        return register_controller.changeUserRole(userId=userId, userRole=userRole)
    except HTTPException as ex:
        raise ex
