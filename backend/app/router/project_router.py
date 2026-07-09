from fastapi import APIRouter, HTTPException
from app.services.project_service import project_service

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.post("/recommend/{user_id}")
async def recommend_projects(user_id: str):
    try:
        recommendations = await project_service.recommend_projects(user_id)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}")
async def get_project_recommendations(user_id: str):
    recommendations = await project_service.get_recommendations(user_id)
    if not recommendations:
        raise HTTPException(status_code=404, detail="Project recommendations not found")
    return recommendations
