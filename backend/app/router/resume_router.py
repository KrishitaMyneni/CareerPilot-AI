from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.services.resume_service import resume_service

router = APIRouter(prefix="/api/resume", tags=["resume"])

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/analyze")
async def analyze_resume(
    user_id: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        file_bytes = await file.read()

        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds 5MB limit")

        if not file.filename:
            raise HTTPException(status_code=400, detail="Filename is required")

        file_type = file.filename.split(".")[-1].lower()

        if file_type not in ["pdf", "docx"]:
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

        analysis = await resume_service.analyze_resume(user_id, file_bytes, file_type)
        return analysis
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}")
async def get_resume_analysis(user_id: str):
    analysis = await resume_service.get_analysis(user_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Resume analysis not found")
    return analysis
