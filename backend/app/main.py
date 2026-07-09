from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.router import chat_router, profile_router, intent_router, resume_router, skill_gap_router, roadmap_router, project_router


app = FastAPI(title="CareerPilot AI API", version="1.0.0")


@app.on_event("startup")
async def startup_event():
    await init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router.router)
app.include_router(profile_router.router)
app.include_router(intent_router.router)
app.include_router(resume_router.router)
app.include_router(skill_gap_router.router)
app.include_router(roadmap_router.router)
app.include_router(project_router.router)


@app.get("/")
async def root():
    return {"message": "Welcome to CareerPilot AI API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/health/ibm")
async def ibm_health_check():
    from app.services.ibm_client import ibm_client
    try:
        response = await ibm_client.generate_text(
            "Reply with exactly: OK", max_tokens=10
        )
        return {"status": "healthy", "model": ibm_client.model_id, "response": response[:50]}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
