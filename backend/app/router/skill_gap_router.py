from fastapi import APIRouter, HTTPException
from app.services.skill_gap_service import skill_gap_service

router = APIRouter(prefix="/api/skill-gap", tags=["skill-gap"])


@router.post("/analyze/{user_id}")
async def analyze_skill_gap(user_id: str):
    try:
        report = await skill_gap_service.analyze_skill_gap(user_id)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}")
async def get_skill_gap_report(user_id: str):
    report = await skill_gap_service.get_report(user_id)
    if not report:
        raise HTTPException(status_code=404, detail="Skill gap report not found")
    return report
