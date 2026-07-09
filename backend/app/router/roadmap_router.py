from fastapi import APIRouter, HTTPException
from app.services.roadmap_service import roadmap_service

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])


@router.post("/generate/{user_id}")
async def generate_roadmap(user_id: str):
    try:
        roadmap = await roadmap_service.generate_roadmap(user_id)
        return roadmap
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}")
async def get_roadmap(user_id: str):
    roadmap = await roadmap_service.get_roadmap(user_id)
    if not roadmap:
        raise HTTPException(status_code=404, detail="Learning roadmap not found")
    return roadmap
