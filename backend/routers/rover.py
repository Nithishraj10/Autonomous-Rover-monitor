from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/rover", tags=["rover"])


@router.post("/detection", response_model=schemas.PotholeResponse)
def receive_detection(
    payload: schemas.DetectionPayload, db: Session = Depends(get_db)
):
    """
    Receive pothole detection payload from Raspberry Pi 5.
    Calculates severity, status, and repair_method from depth_cm.
    """
    # Calculate severity & status based on depth threshold (5 cm)
    if payload.depth_cm < 5.0:
        severity = "minor"
        pothole_status = "FILLED"
        repair_method = "AUTOMATIC_SAND_DISPENSING"
    else:
        severity = "major"
        pothole_status = "MANUAL_INSPECTION_REQUIRED"
        repair_method = "MANUAL_INSPECTION"

    # Determine ID
    pothole_id = payload.pothole_id
    if not pothole_id:
        count = db.query(models.Pothole).count()
        pothole_id = f"PTH-{(count + 1):03d}"

    # Check if existing record exists with this ID
    existing = (
        db.query(models.Pothole).filter(models.Pothole.id == pothole_id).first()
    )

    if existing:
        existing.rover_id = payload.rover_id
        existing.timestamp = payload.timestamp
        existing.latitude = payload.latitude
        existing.longitude = payload.longitude
        existing.depth_cm = payload.depth_cm
        existing.severity = severity
        existing.confidence = (
            payload.confidence if payload.confidence is not None else 0.90
        )
        existing.status = pothole_status
        existing.repair_method = repair_method
        existing.image_url = payload.image_url
        db.commit()
        db.refresh(existing)
        pothole = existing
    else:
        pothole = models.Pothole(
            id=pothole_id,
            rover_id=payload.rover_id,
            timestamp=payload.timestamp,
            latitude=payload.latitude,
            longitude=payload.longitude,
            depth_cm=payload.depth_cm,
            severity=severity,
            confidence=(
                payload.confidence if payload.confidence is not None else 0.90
            ),
            status=pothole_status,
            repair_method=repair_method,
            image_url=payload.image_url,
            inspection_notes=None,
            inspected_at=None,
            repaired_at=None,
            created_at=datetime.utcnow(),
        )
        db.add(pothole)
        db.commit()
        db.refresh(pothole)

    # Also update rover's last sync timestamp and location if status exists
    rover = (
        db.query(models.RoverStatus)
        .filter(models.RoverStatus.rover_id == payload.rover_id)
        .first()
    )
    if rover:
        rover.last_sync_timestamp = payload.timestamp
        rover.latitude = payload.latitude
        rover.longitude = payload.longitude
        rover.updated_at = datetime.utcnow()
        db.commit()

    return pothole


@router.get("/status", response_model=schemas.RoverStatusResponse)
def get_rover_status(
    rover_id: Optional[str] = "ROVER-01", db: Session = Depends(get_db)
):
    """Retrieve rover status."""
    rover = (
        db.query(models.RoverStatus)
        .filter(models.RoverStatus.rover_id == rover_id)
        .first()
    )
    if not rover:
        rover = db.query(models.RoverStatus).first()
    if not rover:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rover status record not found",
        )
    return rover


@router.post("/telemetry", response_model=schemas.RoverStatusResponse)
def update_rover_telemetry(
    payload: schemas.TelemetryPayload, db: Session = Depends(get_db)
):
    """Accept rover telemetry and update status."""
    now_iso = datetime.utcnow().isoformat() + "Z"
    rover = (
        db.query(models.RoverStatus)
        .filter(models.RoverStatus.rover_id == payload.rover_id)
        .first()
    )

    if not rover:
        rover = models.RoverStatus(
            rover_id=payload.rover_id,
            is_online=True,
            wifi_connected=payload.wifi_connected,
            last_sync_timestamp=now_iso,
            current_activity=payload.current_activity,
            latitude=payload.latitude,
            longitude=payload.longitude,
            gps_status=payload.gps_status,
            satellites=payload.satellites,
            battery_percentage=payload.battery_percentage,
            temperature=payload.temperature,
            updated_at=datetime.utcnow(),
        )
        db.add(rover)
    else:
        rover.is_online = True
        rover.wifi_connected = payload.wifi_connected
        rover.last_sync_timestamp = now_iso
        rover.current_activity = payload.current_activity
        rover.latitude = payload.latitude
        rover.longitude = payload.longitude
        rover.gps_status = payload.gps_status
        rover.satellites = payload.satellites
        rover.battery_percentage = payload.battery_percentage
        rover.temperature = payload.temperature
        rover.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(rover)
    return rover
