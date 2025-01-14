from backend.endpoints import triage
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from .endpoints import login, register, appointments

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.router.get("/", status_code=200)
async def health_check():
    return {"msg": "Backend is working propperly"}

app.include_router(login.router, prefix="/login")
app.include_router(register.router, prefix="/register")
app.include_router(appointments.router, prefix="/appointments")
app.include_router(triage.router, prefix="/triage")


handler = Mangum(app)
