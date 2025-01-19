from pydantic import BaseModel


class TriageData(BaseModel):
    Sex: int
    Age: int
    Injury: int
    Mental: int
    NRS_pain: int
    SBP: float
    DBP: float
    HR: int
    RR: int
    BT: float
    Saturation: int
