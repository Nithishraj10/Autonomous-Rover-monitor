from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/potholes", tags=["potholes"])


@router.get("", response_model=List[schemas.PotholeResponse])
def get_all_potholes(db: Session = Depends(get_db)):
    """Retrieve all pothole records."""
    return db.query(models.Pothole).all()


@router.get("/{pothole_id}", response_model=schemas.PotholeResponse)
def get_pothole_by_id(pothole_id: str, db: Session = Depends(get_db)):
    """Retrieve a single pothole by ID."""
    pothole = db.query(models.Pothole).filter(models.Pothole.id == pothole_id).first()
    if not pothole:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pothole with ID '{pothole_id}' not found",
        )
    return pothole


@router.patch("/{pothole_id}/status", response_model=schemas.PotholeResponse)
def update_pothole_status(
    pothole_id: str,
    payload: schemas.PotholeStatusUpdate,
    db: Session = Depends(get_db),
):
    """Allow updating pothole status and inspection notes."""
    pothole = db.query(models.Pothole).filter(models.Pothole.id == pothole_id).first()
    if not pothole:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pothole with ID '{pothole_id}' not found",
        )

    if payload.status is not None:
        pothole.status = payload.status
    if payload.inspection_notes is not None:
        pothole.inspection_notes = payload.inspection_notes
    if payload.inspected_at is not None:
        pothole.inspected_at = payload.inspected_at
    if payload.repaired_at is not None:
        pothole.repaired_at = payload.repaired_at

    db.commit()
    db.refresh(pothole)
    return pothole
