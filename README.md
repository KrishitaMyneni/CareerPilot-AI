# CareerPilot AI

An AI-powered career mentorship platform for engineering students, built for the IBM SkillsBuild Hackathon.

## Tech Stack

- **Backend**: FastAPI, Python, Beanie ODM, MongoDB Atlas
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **AI**: IBM watsonx.ai Granite Models

## Project Structure

```
CareerPilot-AI/
├── backend/
│   ├── app/
│   │   ├── agents/          # AI specialized agents
│   │   ├── router/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── models/          # MongoDB models
│   │   └── utils/           # Utilities
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── app/
    │   ├── components/
    │   ├── lib/
    │   ├── types/
    │   └── (pages)/
    └── package.json
```

## Getting Started

### Backend Setup

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in `backend/`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/careerpilot?retryWrites=true&w=majority
IBM_API_KEY=your_ibm_watsonx_api_key
IBM_PROJECT_ID=your_ibm_watsonx_project_id
IBM_URL=https://us-south.ml.cloud.ibm.com
```

4. Run the backend:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the frontend:
```bash
npm run dev
```

## Features

- 🎯 **Career Guidance**: Personalized career advice and role recommendations
- 📄 **Resume Analysis**: ATS optimization, scoring, and feedback
- 📊 **Skill Gap Assessment**: Identify missing skills and priorities
- 🗺️ **Learning Roadmaps**: Step-by-step learning paths with milestones
- 💡 **Project Recommendations**: Portfolio project ideas
- 💬 **AI Chat**: Instant career guidance through natural language

## License

MIT
