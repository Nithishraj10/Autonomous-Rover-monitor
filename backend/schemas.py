from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class DetectionPayload(BaseModel):
    rover_id: str
    pothole_id: Optional[str] = None
    timestamp: str
    latitude: float
    longitude: float
    depth_cm: float
    confidence: Optional[float] = 0.90
    image_url: Optional[str] = None


class PotholeStatusUpdate(BaseModel):
    status: Optional[str] = None
    inspection_notes: Optional[str] = None
    inspected_at: Optional[str] = None
    repaired_at: Optional[str] = None


class PotholeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    rover_id: str
    timestamp: str
    latitude: float
    longitude: float
    depth_cm: float
    severity: str
    confidence: float
    status: str
    repair_method: str
    image_url: Optional[str] = None
    inspection_notes: Optional[str] = None
    inspected_at: Optional[str] = None
    repaired_at: Optional[str] = None
    created_at: Optional[datetime] = None


class TelemetryPayload(BaseModel):
    rover_id: str
    wifi_connected: bool
    current_activity: str
    latitude: float
    longitude: float
    gps_status: str
    satellites: int
    battery_percentage: int
    temperature: float


class RoverStatusResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    rover_id: str
    is_online: bool
    wifi_connected: bool
    last_sync_timestamp: Optional[str] = None
    current_activity: str
    latitude: float
    longitude: float
    gps_status: str
    satellites: int
    battery_percentage: int
    temperature: float
    updated_at: Optional[datetime] = None
