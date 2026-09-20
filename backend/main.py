from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, SessionLocal, Base
import models
from routers import potholes, rover

# Create DB tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Autonomous Pothole Mapping API",
    description="Local FastAPI backend for real rover data flow and testing.",
    version="1.0.0",
)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def seed_initial_data():
    """Seed initial demo data if database is empty."""
    db = SessionLocal()
    try:
        # Seed initial rover status
        rover = (
            db.query(models.RoverStatus)
            .filter(models.RoverStatus.rover_id == "ROVER-01")
            .first()
        )
        if not rover:
            initial_rover = models.RoverStatus(
                rover_id="ROVER-01",
                is_online=True,
                wifi_connected=True,
                last_sync_timestamp=datetime.utcnow().isoformat() + "Z",
                current_activity="PATROLLING",
                latitude=8.1832,
                longitude=77.4119,
                gps_status="FIX",
                satellites=8,
                battery_percentage=87,
                temperature=49.5,
                updated_at=datetime.utcnow(),
            )
            db.add(initial_rover)

        # Seed initial potholes if empty
        if db.query(models.Pothole).count() == 0:
            minor_pothole = models.Pothole(
                id="PTH-001",
                rover_id="ROVER-01",
                timestamp="2026-09-20T09:15:00Z",
                latitude=8.1825,
                longitude=77.4112,
                depth_cm=3.4,
                severity="minor",
                confidence=0.96,
                status="FILLED",
                repair_method="AUTOMATIC_SAND_DISPENSING",
                image_url=None,
                inspection_notes="Sand dispensing auto-fill executed successfully",
                inspected_at=None,
                repaired_at="2026-09-20T09:15:10Z",
                created_at=datetime.utcnow(),
            )

            major_pothole = models.Pothole(
                id="PTH-002",
                rover_id="ROVER-01",
                timestamp="2026-09-20T10:30:21Z",
                latitude=8.1832,
                longitude=77.4119,
                depth_cm=7.4,
                severity="major",
                confidence=0.94,
                status="MANUAL_INSPECTION_REQUIRED",
                repair_method="MANUAL_INSPECTION",
                image_url=None,
                inspection_notes=None,
                inspected_at=None,
                repaired_at=None,
                created_at=datetime.utcnow(),
            )

            db.add(minor_pothole)
            db.add(major_pothole)

        db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    seed_initial_data()


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}


# Include routers
app.include_router(potholes.router)
app.include_router(rover.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
