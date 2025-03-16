
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .analyze import router as analyze_router
from .importancias import router as importancias_router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze_router, prefix="/api")
app.include_router(importancias_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Data Analysis API is running"}
