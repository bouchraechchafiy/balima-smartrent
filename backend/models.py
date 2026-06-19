
from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True)
    password: str
    name: str
    role: str  # "manager", "tenant", "technician"

class MaintenanceRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_name: str
    unit_number: str
    description: str
    category: str
    priority: str
    ai_analysis: str
    status: str = "To Do"  # "To Do", "In Progress", "Completed"
    created_at: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M"))
class DashboardStats(SQLModel):
    # Just a data shape for the UI, not a table
    occupancy_rate: int
    monthly_revenue: int
    active_leases: int
    pending_requests: int

class Apartment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str  # e.g. "BLM-101"
    type: str  # "Studio", "2 Bedroom"
    size: float # in m2
    price: float # Current Rent
    status: str # "Occupied", "Vacant"
    image_url: str
    # AI Fields
    vacancy_risk: int # 0-100%
    ai_suggested_price: float
    address: str = "Immeuble Balima, Avenue Mohammed V, Rabat"

class Lease(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: int
    apartment_id: int
    start_date: str
    end_date: str
    status: str # "Active", "Expiring"
    risk_score: str # "Low", "Medium", "High"



class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sender_role: str # "manager", "tenant", "technician"
    sender_name: str
    content: str
    timestamp: str = Field(default_factory=lambda: datetime.now().strftime("%H:%M"))