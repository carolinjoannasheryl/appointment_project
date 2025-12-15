from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
try:
    from .appointment_service import AppointmentService
except ImportError:
    from appointment_service import AppointmentService

import os

# Check if running on Vercel
is_vercel = os.environ.get("VERCEL")

app = FastAPI(root_path="/api" if is_vercel else "")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

service = AppointmentService()

@app.get("/appointments")
def get_appointments(
    date: Optional[str] = None, 
    status: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    doctor_name: Optional[str] = None,
    search_query: Optional[str] = None
):
    filters = {}
    if date:
        filters["date"] = date
    if status:
        filters["status"] = status
    if start_date:
        filters["start_date"] = start_date
    if end_date:
        filters["end_date"] = end_date
    if doctor_name:
        filters["doctor_name"] = doctor_name
    if search_query:
        filters["search_query"] = search_query
    return service.get_appointments(filters)

@app.patch("/appointments/{id}/status")
def update_status(id: str, status: str = Body(..., embed=True)): # Expects JSON body { "status": "NewStatus" }
    updated_apt = service.update_appointment_status(id, status)
    if not updated_apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return updated_apt

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
