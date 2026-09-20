from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime
from database import Base


class Pothole(Base):
    __tablename__ = "potholes"

    id = Column(String, primary_key=True, index=True)
    rover_id = Column(String, index=True, nullable=False)
    timestamp = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    depth_cm = Column(Float, nullable=False)
    severity = Column(String, nullable=False)
    confidence = Column(Float, nullable=False, default=0.90)
    status = Column(String, nullable=False)
    repair_method = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    inspection_notes = Column(String, nullable=True)
    inspected_at = Column(String, nullable=True)
    repaired_at = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class RoverStatus(Base):
    __tablename__ = "rover_status"

    rover_id = Column(String, primary_key=True, index=True)
    is_online = Column(Boolean, default=True)
    wifi_connected = Column(Boolean, default=True)
    last_sync_timestamp = Column(String, nullable=True)
    current_activity = Column(String, default="PATROLLING")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    gps_status = Column(String, default="FIX")
    satellites = Column(Integer, default=8)
    battery_percentage = Column(Integer, default=87)
    temperature = Column(Float, default=45.0)
    updated_at = Column(DateTime, default=datetime.utcnow)
